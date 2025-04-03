<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VideoPopupSubmission;
use App\Models\Lesson;
use App\Models\VideoPopup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'userMetrics' => $this->getUserMetrics(),
            'lessonMetrics' => $this->getLessonMetrics(),
            'quizMetrics' => $this->getQuizMetrics(),
            'topLessons' => $this->getTopLessons(),
            'ctaPopupMetrics' => $this->getCtaPopupMetrics(),
            'featureMetrics' => $this->getFeatureMetrics(),
        ]);
    }

    private function getUserMetrics()
    {
        $now = Carbon::now();
        $thirtyDaysAgo = $now->copy()->subDays(30);
        $sevenDaysAgo = $now->copy()->subDays(7);

        $totalUsers = User::count();
        $activeUsers = User::where('last_login_at', '>=', $thirtyDaysAgo)->count();
        $newUsers = User::where('created_at', '>=', $sevenDaysAgo)->count();
        $adminUsers = User::where('is_admin', true)->count();

        return [
            'totalUsers' => $totalUsers,
            'activeUsers' => $activeUsers,
            'newUsers' => $newUsers,
            'adminUsers' => $adminUsers,
            'retentionRate' => $totalUsers > 0 ? round(($activeUsers / $totalUsers) * 100) : 0,
        ];
    }

    private function getLessonMetrics()
    {
        $totalLessons = Lesson::count();
        $publishedLessons = Lesson::where('is_published', true)->count();
        $totalDuration = Lesson::sum('duration');

        // Average time in minutes
        $averageDuration = $totalLessons > 0 ? round($totalDuration / $totalLessons / 60, 1) : 0;

        // Get count by difficulty
        $lessonsByDifficulty = Lesson::select('difficulty', DB::raw('count(*) as count'))
            ->groupBy('difficulty')
            ->pluck('count', 'difficulty')
            ->toArray();

        return [
            'totalLessons' => $totalLessons,
            'publishedLessons' => $publishedLessons,
            'unpublishedLessons' => $totalLessons - $publishedLessons,
            'totalDurationHours' => round($totalDuration / 3600, 1),
            'averageDurationMinutes' => $averageDuration,
            'lessonsByDifficulty' => $lessonsByDifficulty,
        ];
    }

    private function getQuizMetrics()
    {
        // Get total popups
        $totalPopups = VideoPopup::count();
        $quizPopups = VideoPopup::where('type', 'quiz')->count();
        $ctaPopups = VideoPopup::where('type', 'cta')->count();

        // Get submissions data
        $totalSubmissions = VideoPopupSubmission::count();
        $correctSubmissions = VideoPopupSubmission::where('is_correct', true)->count();

        // Calculate average response time in seconds
        $avgResponseTime = VideoPopupSubmission::whereNotNull('response_time_seconds')
            ->avg('response_time_seconds') ?? 0;

        // Get unique users who submitted answers
        $uniqueUsers = VideoPopupSubmission::select('user_id')
            ->distinct()
            ->count();

        return [
            'totalPopups' => $totalPopups,
            'quizPopups' => $quizPopups,
            'ctaPopups' => $ctaPopups,
            'totalSubmissions' => $totalSubmissions,
            'correctSubmissions' => $correctSubmissions,
            'correctRate' => $totalSubmissions > 0 ? round(($correctSubmissions / $totalSubmissions) * 100) : 0,
            'avgResponseTime' => round($avgResponseTime, 1),
            'uniqueUsers' => $uniqueUsers,
        ];
    }

    private function getTopLessons($limit = 5)
    {
        // Get top lessons by submission count
        return VideoPopupSubmission::select('lesson_id', DB::raw('count(*) as submission_count'))
            ->with(['lesson:id,title,thumbnail,difficulty'])
            ->groupBy('lesson_id')
            ->orderByDesc('submission_count')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->lesson_id,
                    'title' => $item->lesson->title ?? 'Unknown Lesson',
                    'thumbnail' => $item->lesson->thumbnail,
                    'difficulty' => $item->lesson->difficulty,
                    'submission_count' => $item->submission_count,
                ];
            });
    }

    private function getCtaPopupMetrics($limit = 5)
    {
        return Lesson::with(['videoPopups' => function ($query) {
            $query->where('type', 'cta');
        }])
            ->whereHas('videoPopups', function ($query) {
                $query->where('type', 'cta');
            })
            ->get()
            ->map(function ($lesson) {
                $popups = $lesson->videoPopups->map(function ($popup) {
                    $closeCount = VideoPopupSubmission::where('video_popup_id', $popup->id)
                        ->where('answer', 'close')
                        ->count();

                    $openCount = VideoPopupSubmission::where('video_popup_id', $popup->id)
                        ->where('answer', 'open')
                        ->count();

                    return [
                        'id' => $popup->id,
                        'title' => $popup->title,
                        'close_submissions' => $closeCount,
                        'open_submissions' => $openCount,
                        'total_submissions' => $closeCount + $openCount
                    ];
                });

                return [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'thumbnail' => $lesson->thumbnail,
                    'difficulty' => $lesson->difficulty,
                    'cta_popups' => $popups,
                ];
            })
            ->sortByDesc(function ($lesson) {
                return $lesson['cta_popups']->sum('total_submissions');
            })
            ->take($limit)
            ->values()
            ->all();
    }

    private function getFeatureMetrics()
    {
        // Get all features and their usage counts from the features table
        $features = DB::table('features')
            ->select('name', 'value', DB::raw('count(*) as count'))
            ->groupBy('name', 'value')
            ->orderBy('name')
            ->get();

        // Restructure the data to group by feature name
        $featureData = [];
        foreach ($features as $feature) {
            if (!isset($featureData[$feature->name])) {
                $featureData[$feature->name] = [
                    'name' => $feature->name,
                    'enabled' => 0,
                    'disabled' => 0,
                    'total' => 0
                ];
            }

            // Convert string 'true'/'false' to boolean if needed
            $isEnabled = filter_var($feature->value, FILTER_VALIDATE_BOOLEAN);

            if ($isEnabled) {
                $featureData[$feature->name]['enabled'] += $feature->count;
            } else {
                $featureData[$feature->name]['disabled'] += $feature->count;
            }

            $featureData[$feature->name]['total'] += $feature->count;
        }

        // Convert to array and calculate percentages
        $result = array_values($featureData);
        foreach ($result as &$feature) {
            $feature['enabled_percentage'] = $feature['total'] > 0 ?
                round(($feature['enabled'] / $feature['total']) * 100) : 0;
            $feature['disabled_percentage'] = $feature['total'] > 0 ?
                round(($feature['disabled'] / $feature['total']) * 100) : 0;
        }

        return $result;
    }
}

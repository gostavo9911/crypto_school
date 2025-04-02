<?php

namespace Database\Seeders;

use App\Models\Lesson;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LessonsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lessons = [
            [
                'title' => 'Coincall Buy & Transfer Crypto Tutorial',
                'description' => 'Learn how to buy and transfer crypto on Coincall with this quick tutorial by Crypto School! Simple, fast, and secure.',
                'thumbnail' => 'https://i.ytimg.com/vi/i-B3LhfkuEA/hqdefault.jpg',
                'video_url' => 'https://www.youtube.com/watch?v=i-B3LhfkuEA',
                'duration' => 74,
                'difficulty' => 'beginner',
                'is_published' => true,
            ],
            [
                'title' => 'Blofin Buy & Transfer Crypto Tutorial',
                'description' => 'Learn how to buy and transfer crypto on Blofin in this quick tutorial! Follow our step-by-step guide for a seamless experience.',
                'thumbnail' => 'https://i.ytimg.com/vi/IRtavJD3lrU/hqdefault.jpg',
                'video_url' => 'https://www.youtube.com/watch?v=IRtavJD3lrU',
                'duration' => 120,
                'difficulty' => 'intermediate',
                'is_published' => true,
            ],
            [
                'title' => 'How To Get Started In Crypto In 2024! (FULL BEGINNERS GUIDE)',
                'description' => 'A comprehensive guide for beginners on how to start in the crypto world in 2024. Learn the basics and start your crypto journey!',
                'thumbnail' => 'https://i.ytimg.com/vi/jZAORRdEVjQ/hqdefault.jpg',
                'video_url' => 'https://www.youtube.com/watch?v=jZAORRdEVjQ',
                'duration' => 3600,
                'difficulty' => 'beginner',
                'is_published' => true,
            ],
            [
                'title' => 'Making Money Trading Crypto ANYWHERE, ANY TIME! [Cohort 3]',
                'description' => 'Learn how to trade crypto profitably from anywhere at any time. Join Cohort 3 and master crypto trading!',
                'thumbnail' => 'https://i.ytimg.com/vi/9Qh8oH6mWxQ/hqdefault.jpg',
                'video_url' => 'https://www.youtube.com/watch?v=9Qh8oH6mWxQ',
                'duration' => 1800,
                'difficulty' => 'intermediate',
                'is_published' => true,
            ],
        ];

        foreach ($lessons as $lesson) {
            Lesson::create($lesson);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VideoPopupsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lesson 1: Coincall Buy & Transfer Crypto Tutorial (74 seconds)
        DB::table('video_popups')->insert([
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 1,
                'title' => 'Coincall Features',
                'content' => 'What is the main benefit of using Coincall?',
                'type' => 'quiz',
                'appear_at' => 30,
                'is_skippable' => false,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'Fast transactions with low fees', 'is_correct' => true],
                        ['id' => 2, 'text' => 'Complex trading interface', 'is_correct' => false],
                        ['id' => 3, 'text' => 'No KYC requirements', 'is_correct' => false],
                        ['id' => 4, 'text' => 'Only supports Bitcoin', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 1,
                'title' => 'Transferring Crypto',
                'content' => 'What information do you need to transfer crypto from Coincall?',
                'type' => 'quiz',
                'appear_at' => 60,
                'is_skippable' => true,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'Only the recipient\'s name', 'is_correct' => false],
                        ['id' => 2, 'text' => 'The recipient\'s wallet address', 'is_correct' => true],
                        ['id' => 3, 'text' => 'The recipient\'s phone number', 'is_correct' => false],
                        ['id' => 4, 'text' => 'The recipient\'s email only', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Lesson 2: Blofin Buy & Transfer Crypto Tutorial (120 seconds)
        DB::table('video_popups')->insert([
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 2,
                'title' => 'Blofin Platform',
                'content' => 'Which of the following is a key feature of Blofin?',
                'type' => 'quiz',
                'appear_at' => 40,
                'is_skippable' => false,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'High trading fees', 'is_correct' => false],
                        ['id' => 2, 'text' => 'Integrated trading tools', 'is_correct' => true],
                        ['id' => 3, 'text' => 'Limited cryptocurrency options', 'is_correct' => false],
                        ['id' => 4, 'text' => 'No mobile app support', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 2,
                'title' => 'Buying Crypto',
                'content' => 'What method can you use to buy crypto on Blofin?',
                'type' => 'quiz',
                'appear_at' => 80,
                'is_skippable' => true,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'Credit/debit card', 'is_correct' => true],
                        ['id' => 2, 'text' => 'Only PayPal', 'is_correct' => false],
                        ['id' => 3, 'text' => 'Only cryptocurrency', 'is_correct' => false],
                        ['id' => 4, 'text' => 'Only bank transfers', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 2,
                'title' => 'Security Features',
                'content' => 'What security feature is recommended when using Blofin?',
                'type' => 'quiz',
                'appear_at' => 110,
                'is_skippable' => false,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'Sharing your password with friends', 'is_correct' => false],
                        ['id' => 2, 'text' => 'Using public WiFi', 'is_correct' => false],
                        ['id' => 3, 'text' => 'Two-factor authentication (2FA)', 'is_correct' => true],
                        ['id' => 4, 'text' => 'Using the same password as other platforms', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Lesson 3: How To Get Started In Crypto In 2024! (3600 seconds)
        DB::table('video_popups')->insert([
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 3,
                'title' => 'Cryptocurrency Basics',
                'content' => 'What is cryptocurrency?',
                'type' => 'quiz',
                'appear_at' => 300,
                'is_skippable' => false,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'A type of digital or virtual currency that uses cryptography', 'is_correct' => true],
                        ['id' => 2, 'text' => 'A physical currency issued by banks', 'is_correct' => false],
                        ['id' => 3, 'text' => 'A government-issued currency', 'is_correct' => false],
                        ['id' => 4, 'text' => 'A form of stock market investment', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 3,
                'title' => 'Blockchain Technology',
                'content' => 'What is blockchain?',
                'type' => 'quiz',
                'appear_at' => 900,
                'is_skippable' => true,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'A centralized database managed by banks', 'is_correct' => false],
                        ['id' => 2, 'text' => 'A distributed ledger technology', 'is_correct' => true],
                        ['id' => 3, 'text' => 'A type of cryptocurrency', 'is_correct' => false],
                        ['id' => 4, 'text' => 'A mobile app for trading', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 3,
                'title' => 'Crypto Wallets',
                'content' => 'What is the safest type of crypto wallet?',
                'type' => 'quiz',
                'appear_at' => 1800,
                'is_skippable' => false,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'Exchange wallet', 'is_correct' => false],
                        ['id' => 2, 'text' => 'Mobile wallet', 'is_correct' => false],
                        ['id' => 3, 'text' => 'Hardware wallet', 'is_correct' => true],
                        ['id' => 4, 'text' => 'Web wallet', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 3,
                'title' => 'Exchanges',
                'content' => 'What should you consider when choosing a crypto exchange?',
                'type' => 'quiz',
                'appear_at' => 2700,
                'is_skippable' => true,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'Only the trading fees', 'is_correct' => false],
                        ['id' => 2, 'text' => 'Only the user interface', 'is_correct' => false],
                        ['id' => 3, 'text' => 'Only the available cryptocurrencies', 'is_correct' => false],
                        ['id' => 4, 'text' => 'Security, fees, available coins, and user experience', 'is_correct' => true],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 3,
                'title' => 'Crypto Safety',
                'content' => 'What is a common security practice in crypto?',
                'type' => 'quiz',
                'appear_at' => 3300,
                'is_skippable' => false,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'Sharing your private keys online', 'is_correct' => false],
                        ['id' => 2, 'text' => 'Keeping all your crypto on exchanges', 'is_correct' => false],
                        ['id' => 3, 'text' => 'Using the same password for all platforms', 'is_correct' => false],
                        ['id' => 4, 'text' => 'Using hardware wallets and enabling 2FA', 'is_correct' => true],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Lesson 4: Making Money Trading Crypto ANYWHERE, ANY TIME! (1800 seconds)
        DB::table('video_popups')->insert([
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 4,
                'title' => 'Trading Strategies',
                'content' => 'What is the difference between day trading and HODLing?',
                'type' => 'quiz',
                'appear_at' => 300,
                'is_skippable' => false,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'Day trading is buying and selling within the same day, HODLing is long-term holding', 'is_correct' => true],
                        ['id' => 2, 'text' => 'They are the same thing', 'is_correct' => false],
                        ['id' => 3, 'text' => 'Day trading is only for Bitcoin, HODLing is for altcoins', 'is_correct' => false],
                        ['id' => 4, 'text' => 'Day trading is illegal, HODLing is legal', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 4,
                'title' => 'Technical Analysis',
                'content' => 'What is a candlestick chart used for?',
                'type' => 'quiz',
                'appear_at' => 600,
                'is_skippable' => true,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'To show the current price only', 'is_correct' => false],
                        ['id' => 2, 'text' => 'To display open, high, low, and close prices in a time period', 'is_correct' => true],
                        ['id' => 3, 'text' => 'To track your portfolio value', 'is_correct' => false],
                        ['id' => 4, 'text' => 'To show market sentiment on social media', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 4,
                'title' => 'Risk Management',
                'content' => 'What is a stop-loss order?',
                'type' => 'quiz',
                'appear_at' => 1200,
                'is_skippable' => false,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'An order to buy when prices increase', 'is_correct' => false],
                        ['id' => 2, 'text' => 'An order to sell when prices reach a certain low point', 'is_correct' => true],
                        ['id' => 3, 'text' => 'An order to buy more cryptocurrency', 'is_correct' => false],
                        ['id' => 4, 'text' => 'An order to close your trading account', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uuid' => Str::uuid()->toString(),
                'lesson_id' => 4,
                'title' => 'Mobile Trading',
                'content' => 'What is the main advantage of mobile trading?',
                'type' => 'quiz',
                'appear_at' => 1700,
                'is_skippable' => true,
                'is_active' => true,
                'options' => json_encode([
                    'answers' => [
                        ['id' => 1, 'text' => 'It requires no internet connection', 'is_correct' => false],
                        ['id' => 2, 'text' => 'It provides more advanced tools than desktop platforms', 'is_correct' => false],
                        ['id' => 3, 'text' => 'It allows you to trade from anywhere at any time', 'is_correct' => true],
                        ['id' => 4, 'text' => 'It automatically makes profitable trades for you', 'is_correct' => false],
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

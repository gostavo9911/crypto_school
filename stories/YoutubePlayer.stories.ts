import type { Meta, StoryObj } from '@storybook/vue3';
import YouTubePlayer from '../resources/js/components/player/YouTubePlayer.vue';
import './YouTubePlayerStyles.css';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a fresh mock adapter for each story to avoid interference
const createMockAdapter = () => new MockAdapter(axios, { onNoMatch: 'passthrough', delayResponse: 0 });

// Define common arguments for all stories
const commonArgs = {
    videoId: 'IRtavJD3lrU', // Taken from the DB lesson's video_url
    lessonId: '2',         // Lesson ID from the DB
    title: 'Blofin Buy & Transfer Crypto Tutorial', // As in the DB record
    subtitle: 'Learn how to buy and transfer crypto on Blofin in this quick tutorial!',
    poster: 'https://i.ytimg.com/vi/IRtavJD3lrU/hqdefault.jpg', // DB lesson thumbnail
    autoplay: false,
    progressBarColor: '#3B82F6',
    hideTitle: false,
    logo: true,
};

// Meta information for the component
const meta: Meta<typeof YouTubePlayer> = {
    title: 'Player/YouTubePlayer',
    component: YouTubePlayer,
    tags: ['autodocs'],
    argTypes: {
        videoId: {
            control: 'text',
            description: 'YouTube video ID',
        },
        lessonId: {
            control: 'text',
            description: 'Associated lesson ID for popups',
        },
        poster: {
            control: 'text',
            description: 'Custom poster image URL',
        },
        logo: {
            control: 'boolean',
            description: 'Whether to show the app logo',
        },
        progressBarColor: {
            control: 'color',
            description: 'Color of the progress bar',
        },
        popupContent: {
            control: 'text',
            description: 'Content for embedded popup',
        },
        popupType: {
            control: 'select',
            options: ['quiz', 'cta'],
            description: 'Type of popup to display',
        },
        autoplay: {
            control: 'boolean',
            description: 'Whether to autoplay the video',
        },
        title: {
            control: 'text',
            description: 'Video title',
        },
        subtitle: {
            control: 'text',
            description: 'Video subtitle',
        },
        hideTitle: {
            control: 'boolean',
            description: 'Whether to hide the title overlay',
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    'A YouTube player component with custom controls, popups, and an enhanced user experience using lesson data from the DB.',
            },
        },
        // Constrain the component's width using a decorator
        decorators: [
            () => ({
                template: '<div class="max-w-2xl mx-auto"><story /></div>',
            }),
        ],
    },
};

export default meta;
type Story = StoryObj<typeof YouTubePlayer>;

// Default story using lesson data from the DB but with no popups
export const Default: Story = {
    args: {
        ...commonArgs,
        // Explicitly remove popupContent to prevent default popup from showing
        popupContent: undefined,
    },
    parameters: {
        backgrounds: { default: 'dark' },
        mockData: {
            setupMocks: (mock: MockAdapter) => {
                // Mock the lessons endpoint with empty popup data
                mock.onGet('/lessons/2/popups').reply(200, {
                    data: [], // Empty array to ensure no popups show
                });
            }
        }
    },
    decorators: [
        (story) => {
            // Set up mocks before component is created
            const mock = createMockAdapter();
            const { setupMocks } = Default.parameters?.mockData || {};
            if (setupMocks) setupMocks(mock);

            return {
                components: { story },
                template: '<story />',
                // Clean up mock when component is unmounted
                unmounted() {
                    mock.restore();
                }
            }
        }
    ]
};

// Story demonstrating a quiz popup for testing
export const WithPopup: Story = {
    args: {
        ...commonArgs,
        popupType: 'quiz',
        popupContent: JSON.stringify({
            title: 'Quiz: Blockchain Basics',
            content: 'Which of the following best describes a blockchain?',
            options: {
                answers: [
                    { id: 1, text: 'A centralized database' },
                    { id: 2, text: 'A distributed ledger', is_correct: true },
                    { id: 3, text: 'An encryption algorithm' },
                    { id: 4, text: 'A type of cryptocurrency' },
                ],
            },
        }),
        autoplay: false,
    },
    parameters: {
        backgrounds: { default: 'dark' },
        docs: {
            description: {
                story:
                    'This story demonstrates a custom quiz popup for testing purposes, separate from the database records.',
            },
        },
        mockData: {
            setupMocks: (mock: MockAdapter) => {
                // Mock the lesson popups endpoint with a custom test popup that appears immediately
                mock.onGet('/lessons/2/popups').reply(200, {
                    data: [
                        {
                            id: 3,
                            uuid: '16fb10c5-fd0f-4f0e-a69e-87835cd57397',
                            lesson_id: 2,
                            title: 'Blofin Platform Quiz',
                            content: 'Which feature helps traders analyze markets directly on Blofin?',
                            type: 'quiz',
                            appear_at: 5, // Make popup appear almost immediately
                            is_skippable: false,
                            is_active: true,
                            options: {
                                answers: [
                                    { id: 1, text: 'Social media integration', is_correct: false },
                                    { id: 2, text: 'Advanced charting tools', is_correct: true },
                                    { id: 3, text: 'Email notifications', is_correct: false },
                                    { id: 4, text: 'PDF exports', is_correct: false },
                                ],
                            },
                        },
                    ],
                });

                // Mock the popup submission endpoint
                mock.onPost(/\/popups\/.*\/submit/).reply(200, {
                    message: 'Submission recorded successfully',
                    data: {
                        is_correct: true,
                    },
                });
            }
        }
    },
    decorators: [
        (story) => {
            // Set up mocks before component is created
            const mock = createMockAdapter();
            const { setupMocks } = WithPopup.parameters?.mockData || {};
            if (setupMocks) setupMocks(mock);

            return {
                components: { story },
                template: '<story />',
                // Clean up mock when component is unmounted
                unmounted() {
                    mock.restore();
                }
            }
        }
    ]
};
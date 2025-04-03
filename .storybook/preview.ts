import '../resources/css/app.css';
import { Preview } from '@storybook/vue3';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Ensure we don't actually make real API requests in Storybook
const mock = new MockAdapter(axios, { onNoMatch: 'passthrough' });

// Setup default handlers for common endpoints
// This allows stories to override these if needed
mock.onAny(/\/api\//).reply(config => {
    console.log('Intercepted API request:', config.url);
    return [404, { error: 'No mock defined for this endpoint' }];
});

const preview: Preview = {
    parameters: {
        backgrounds: {
            default: 'light',
            values: [
                {
                    name: 'light',
                    value: '#f8fafc',
                },
                {
                    name: 'dark',
                    value: '#1e293b',
                },
            ],
        },
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
};

export default preview;

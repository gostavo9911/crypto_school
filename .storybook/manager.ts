import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
    theme: {
        ...themes.light, // Extend the default light theme
        brandTitle: 'Crypto School UI',
        brandUrl: '/',
        brandTarget: '_self',
        colorPrimary: '#3B82F6', // Primary blue color
        colorSecondary: '#2563EB', // Darker blue
    },
});

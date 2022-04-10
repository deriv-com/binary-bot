import { isProduction } from 'Tools';

export const trackjs_config = {
    token: process.env.TRACKJS_TOKEN,
    application: 'binary-bot',
    enabled: isProduction(),
    console: {
        display: false,
    },
};

export default trackjs_config;

export const MAX_MOBILE_WIDTH = 813;

export const APP_ID_MAP = Object.freeze({
    production: Object.freeze({
        'bot.deriv.com': '29864',
        'bot.deriv.me': '29864', // todo: change when will be registered
        'bot.deriv.be': '31223',
    }),
    staging: Object.freeze({
        'staging-bot.deriv.com': '29934',
        'staging-bot.deriv.be': '31248',
    }),
    dev: Object.freeze({
        localhost: '16014',
        'localbot.binary.sx': '16014',
    }),
});

export const OFFICIAL_DOMAINS = [
    'https://app.deriv.com',
    'https://app.deriv.be',
    'https://app.deriv.me',
    'https://staging-app.deriv.com',
    'https://staging-app.deriv.be',
    'https://staging-app.deriv.me',
];

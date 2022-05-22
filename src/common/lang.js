import { parseQueryString } from '../common/utils/tools';
import { set as setStorage, get as getStorage } from '../common/utils/storageManager';
import { setCookieLanguage } from '../common/utils/cookieManager';
import { supportedLanguages, init } from './i18n';

export const getLanguage = () => {
    const queryLang = parseQueryString().l || getStorage('lang');
    const lang = queryLang in supportedLanguages ? queryLang : 'en';
    setStorage('lang', lang);
    setCookieLanguage(lang);
    return lang;
    
};

export const load = () => {
    if (typeof $ !== 'function') return; // Adding this check to skip unit test
    const lang = getLanguage();

    if (lang === 'ach') {
        // eslint-disable-next-line no-underscore-dangle
        window._jipt = [['project', 'binary-bot']];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `${document.location.protocol}//cdn.crowdin.com/jipt/jipt.js`;
        document.body.appendChild(script)
    }

    init(lang);
};

export const showBanner = () => {
    if (getLanguage() === 'pt') {
        document.querySelectorAll(`.${getLanguage()}-show`).forEach(el => {
            el.classList.remove('invisible');
        });
        // TODO: Whenever banners for all languages were added remove else part of the condition.
    } else {
        document.querySelectorAll('.any-show').forEach(el => {
            el.classList.remove('invisible');
        });
    }
};

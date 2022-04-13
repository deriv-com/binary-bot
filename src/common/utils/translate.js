/* eslint-disable import/prefer-default-export */

import { translate as i18nTranslate } from '../i18n';

export const translate = (input, params = []) => {
    let item = i18nTranslate(input)
    if (!params.length) return item;
    params.forEach((replacement, index) => {
        if (item && typeof item === 'string') {
            item = item.replaceAll(`{$${index}}`, replacement);
        }
    });
    return item;
};
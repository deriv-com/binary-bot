/* eslint-disable import/prefer-default-export */
import { translate as i18nTranslate } from 'Translate';

export const translate = (input, params = []) => {
    if (!params.length) return i18nTranslate(input);
    const stringToBeTranslated = input.replace(/\{\$([0-9])\}/gi, '%$1');

    let translatedString = i18nTranslate(stringToBeTranslated);

    params.forEach((replacement, index) => {
        if (translatedString && typeof translatedString === 'string') {
            translatedString = translatedString.replaceAll(`{$${index}}`, replacement);
        }
    });

    return translatedString;
};
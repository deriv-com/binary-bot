import React from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import config from '@config';
import { getLanguage, setLanguage } from '@storage';
import { redirectToSupportedLang, translate } from '@i18n';
import './language-selector.scss';

const current_language = getLanguage();
const toggleModal = () => $('#language-menu-modal').toggleClass('invisible');

const LanguageModal = () => (
    <div id='language-menu-modal' className='invisible' onClick={toggleModal}>
        <div className='language-menu' onClick={e => e.stopPropagation()}>
            <div className='language-menu-header'>
                <span>{translate('Select Language')}</span>
                <span className='language-menu-close_btn' onClick={toggleModal} />
            </div>
            <div className='language-menu-container'>
                <div className='language-menu-list'>
                    {Object.keys(config.supported_languages).map(lang => (
                        <LanguageItem lang={lang} key={lang} />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const LanguageItem = ({ lang }) => {
    const self = React.useRef(null); // todo: refactor self-reference, maybe use document.getElementById

    return (
        <div
            ref={self}
            className={`language-menu-item${current_language === lang ? '__active language-menu-item' : ''}`}
            onClick={() => {
                if (current_language === lang) return;
                $('.language-menu-item__active').toggleClass('language-menu-item__active');
                self.current.classList.add('language-menu-item__active');
                setLanguage(lang);
                Cookies.set('user_language', lang, null);
                if (lang === 'en') {
                    document.location.assign(document.location.origin);
                } else {
                    const parsed_search_param = document.location.search.match(/(lang|l)+=[a-z]{2}/);
                    if (parsed_search_param === null) {
                        // to assign language & reload the page, when the url hasn't search parameters (https://bot.deriv.com)
                        document.location.search = `l=${lang}`;
                    } else {
                        redirectToSupportedLang(lang);
                        document.location.reload();
                    }
                }
            }}
        >
            <img src={`/public/images/flags/ic-flag-${lang}.svg`} />
            <span>{config.supported_languages[lang]}</span>
        </div>
    );
};

LanguageItem.propTypes = {
    lang: PropTypes.string,
};

const LanguageSelector = () => (
    <React.Fragment>
        <div id='language-select' onClick={toggleModal}>
            <img id='language-select__logo' src={`/public/images/flags/ic-flag-${getLanguage()}.svg`} />
        </div>
        <LanguageModal />
    </React.Fragment>
);

export default LanguageSelector;

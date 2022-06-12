import React from "react";
import { supportedLanguages } from "../../../config.js";
import { translate } from "../../../../../../common/utils/tools";
import { getLanguage } from "../../../../../../common/lang";

const current_language = getLanguage();

const LanguageModal = ({toggleModal}) => (
    <div id="language-menu-modal" onClick={()=> { toggleModal(false)}}>
        <div className="language-menu" onClick={e => { 
            e.stopPropagation()
            e.preventDefault()}}>
            <div className="language-menu-header">
                <span>{translate("Language settings")}</span>
                <span
                    className="language-menu-close_btn"
                    onClick={()=>toggleModal(false)}
                />
            </div>
            <div className="language-menu-container">
                <div className="language-menu-list">
                    {Object.keys(supportedLanguages).map(lang => <LanguageItem lang={lang} key={lang} />)}
                </div>
            </div>
        </div>
    </div>
)

const LanguageItem = ({ lang }) => {
    const self = React.useRef(null); // todo: refactor self-reference, maybe use document.getElementById

    return (
        <div
            ref={self}
            className={`language-menu-item${current_language === lang ? "__active language-menu-item" : ""}`}
            onClick={() => {
                if (current_language === lang) return;
                self.current.classList.add("language-menu-item__active");
                document.location.search = `l=${lang}`;
            }}
        >
            <img src={`image/deriv/flag/ic-flag-${lang}.svg`} />
            <span>{supportedLanguages[lang]}</span>
        </div>
    )
}

const LanguageSelector = () => {
    const [show_language_modal,toggleLanguageModal] = React.useState(false)
    return(
    <React.Fragment>
        <div id="language-select" onClick={()=> toggleLanguageModal(true)}>
            <img
                id="language-select__logo"
                src={`image/deriv/flag/ic-flag-${getLanguage()}.svg`}
            />
        </div>
        {show_language_modal && <LanguageModal toggleModal={toggleLanguageModal} />}
    </React.Fragment>
)}

export default LanguageSelector;
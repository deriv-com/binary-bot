import React from 'react';
import { translate } from '../../../../../../common/i18n';

const AuthButtons = () => (
    <div className="header__btn">
        <button id="btn__login" className="btn btn--tertiary header__btn-login">Log in</button>
        <a 
            id="btn__signup" 
            className="btn btn--primary header__btn-signup" 
            target="_blank" 
            rel="noopener noreferrer" 
            href="https://deriv.com/signup/"
        >
            {translate("Sign up")}
        </a>
    </div>
);

export default AuthButtons;
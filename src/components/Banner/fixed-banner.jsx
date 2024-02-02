import React from 'react';
import { translate } from '@i18n';
import './fixed-banner.scss';

const visitDerivBot = () => {
    window.open('https://app.deriv.com/bot/?redirect_from_bbot=1', '_self', 'noopener');
};

const FixedBanner = () => (
    <div className='fixed-banner'>
        <div className='fixed-banner__container'>
            <div className='fixed-banner__content'>
                <div className='fixed-banner__content-title'>{translate('Level up your bot trading')}</div>
                <div className='fixed-banner__content-description'>
                    {translate('For improved features and an overall better performance, switch to Deriv Bot now.')}
                </div>
                <div>
                    <button className='fixed-banner__button' onClick={visitDerivBot}>
                        {translate('Take me to Deriv Bot')}
                    </button>
                </div>
            </div>
            <div className='fixed-banner__image'>
                <img src='/public/images/deriv-banner.svg' alt='deriv-banner' />
            </div>
        </div>
    </div>
);

export default FixedBanner;

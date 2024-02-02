import React from 'react';
import { translate } from '@i18n';
import { isMobile } from '@utils';
import visitDerivBot from './redirect-to-dbot';
import './fixed-dbot-banner.scss';

const FixedDbotBanner = () => (
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
                {isMobile() ? (
                    <img src='/public/images/deriv-banner-responsive.svg' alt='deriv-banner-responsive' />
                ) : (
                    <img src='/public/images/deriv-banner.svg' alt='deriv-banner' />
                )}
            </div>
        </div>
    </div>
);

export default FixedDbotBanner;

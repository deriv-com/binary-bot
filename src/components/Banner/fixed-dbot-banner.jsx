import React from 'react';
import { translate } from '@i18n';
import { isMobile } from '@utils';
import { getActiveLoginId } from '@storage';
import GTM from '@utilities/integrations/gtm';
import './fixed-dbot-banner.scss';

const openDerivBot = () => {
    const user_id = getActiveLoginId();
    GTM.pushDataLayer({ event: 'bbot_moved_to_deriv_bot', user_id: user_id ?? null });
    window.open('https://app.deriv.com/bot/?redirect_from_bbot=1', '_self', 'noopener');
};

const FixedDbotBanner = () => (
    <div className='fixed-banner'>
        <div className='fixed-banner__container'>
            <div className='fixed-banner__content'>
                <div className='fixed-banner__content-title'>{translate('Level up your bot trading')}</div>
                <div className='fixed-banner__content-description'>
                    {translate('For improved features and an overall better performance, switch to Deriv Bot now.')}
                </div>
                <div>
                    <button className='fixed-banner__button' onClick={openDerivBot}>
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

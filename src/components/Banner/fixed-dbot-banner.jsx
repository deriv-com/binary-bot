import React from 'react';
import { translate } from '@i18n';
import { visitDerivBot } from './redirect-to-dbot';
import './fixed-dbot-banner.scss';

const FixedDbotBanner = () => (
    <div className='fixed-banner__container'>
        <div className='fixed-banner__content'>
            <img className='fixed-banner__icon' alt='move to deriv' src='/public/images/ic-megaphone.svg' />
            <div>
                <span>
                    <strong>{translate('Important: ')}</strong>
                </span>
                <span>{translate('Binary Bot will be discontinued on')} </span>
                <strong>
                    <span>{translate('31 August 2024.')} </span>
                    <a className='fixed-banner__visit-deriv-bot' href='#' onClick={visitDerivBot}>
                        {translate('Upgrade to Deriv Bot')}
                    </a>
                </strong>
                <span>{translate(' to continue trading.')}</span>
            </div>
        </div>
    </div>
);

export default FixedDbotBanner;

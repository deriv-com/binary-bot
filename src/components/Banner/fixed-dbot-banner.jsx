import React from 'react';
import { translate } from '@i18n';
import { visitDerivBot } from './redirect-to-dbot';
import './fixed-dbot-banner.scss';

const FixedDbotBanner = () => (
    <div className='fixed-banner__container'>
        <div className='fixed-banner__content'>
            <div className='fixed-banner__icon-info icon-info'></div>
            <div>
                <span>{translate('For improved features and an overall better performance, ')}</span>
                <a className='fixed-banner__visit-deriv-bot' href='#' onClick={visitDerivBot}>
                    {translate('switch to Deriv Bot')}
                </a>
                <span>{translate(' now.')}</span>
            </div>
        </div>
    </div>
);

export default FixedDbotBanner;

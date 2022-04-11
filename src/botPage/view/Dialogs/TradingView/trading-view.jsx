import React from 'react';
import { translate } from 'Translate';
import Dialog from '../Dialog';

const chartWidth = 700;
const chartHeight = 700;

// [Todo] remove styles
const iframeStyle = { width: '100%', height: '100%' };

function TradingViewComponent() {
    return <iframe style={iframeStyle} src="https://tradingview.binary.com/" />;
}

export default class TradingView extends Dialog {
    constructor() {
        super('trading-view-dialog', translate('Trading View'), <TradingViewComponent />, {
            width : chartWidth,
            height: chartHeight,
        });
    }
}

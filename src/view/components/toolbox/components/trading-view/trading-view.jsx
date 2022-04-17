import React from 'react';

// [Todo] remove styles
const iframeStyle = { width: '100%', height: '100%' };

const TradingView = ()=> {
    return <iframe style={iframeStyle} src="https://tradingview.binary.com/" />;
}

export default TradingView;

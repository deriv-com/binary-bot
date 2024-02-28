import React from 'react';
import config from '@config';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import PropTypes from 'prop-types';
import { DraggableResizeWrapper } from '../Draggable';

const chartWidth = 800;
const chartHeight = 700;

function TradingViewComponent() {
    React.useEffect(() => {
        // eslint-disable-next-line no-console
        const onLoad = () => console.info('TradingView chart loaded successfully!');
        const onError = error => globalObserver.emit('Error', error);
        const iframe = document.querySelector('iframe');
        iframe.addEventListener('load', onLoad);
        iframe.addEventListener('error', onError);

        return () => {
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
        };
    }, []);
    return (
        <div style={{ height: 'calc(100% - 2.8rem)', position: 'relative', top: '-1rem' }}>
            <iframe
                id='iframe'
                style={{ width: '100%', height: '100%', border: 'none' }}
                src={config.trading_view_chart.url}
                title={translate('Trading View')}
            />
        </div>
    );
}

const TradingView = ({ setShowTradingView }) => (
    <DraggableResizeWrapper
        boundary={'body'}
        minWidth={600}
        minHeight={600}
        modalHeight={chartHeight}
        modalWidth={chartWidth}
        header={translate('Trading View')}
        onClose={() => {
            setShowTradingView(is_shown => !is_shown);
        }}
        enableResizing
    >
        <TradingViewComponent />
    </DraggableResizeWrapper>
);

TradingView.propTypes = {
    setShowTradingView: PropTypes.func.isRequired,
};

export default TradingView;

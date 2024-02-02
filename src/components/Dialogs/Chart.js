import React from 'react';
import { api_base } from '@api-base';
import { setSmartChartsPublicPath, SmartChart } from '@deriv/deriv-charts';
import { getLanguage } from '@storage';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import PropTypes from 'prop-types';
import ChartTicksService from '../../botPage/common/ChartTicksService';
import ToolbarWidgets from './ToolbarWidgets';
import './chart.scss';
import { DraggableResizeWrapper } from '../Draggable';

setSmartChartsPublicPath('./js/');

const BarrierTypes = {
    CALL: 'ABOVE',
    PUT: 'BELOW',
    EXPIRYRANGE: 'BETWEEN',
    EXPIRYMISS: 'OUTSIDE',
    RANGE: 'BETWEEN',
    UPORDOWN: 'OUTSIDE',
    ONETOUCH: 'NONE_SINGLE',
    NOTOUCH: 'NONE_SINGLE',
};

const getInitialSymbolFromBlockly = () =>
    // eslint-disable-next-line no-underscore-dangle
    Blockly?.getMainWorkspace()
        ?.getAllBlocks()
        ?.find(e => e?.type === 'trade')
        ?.inputList?.find(e => e?.name === 'MARKETDEFINITION')
        ?.fieldRow?.find(e => e?.name === 'SYMBOL_LIST')?.value_;

const ChartContent = ({ show_digits_stats }) => {
    const [show, setVisibility] = React.useState(true);
    const [state, setState] = React.useState({
        high: undefined,
        low: undefined,
        symbol: getInitialSymbolFromBlockly(),
        should_barrier_display: false,
    });
    const [granularity, setGranularity] = React.useState(0);
    const [chart_type, setChartType] = React.useState('line');

    const ticksService = new ChartTicksService(api_base.api_chart);
    const listeners = [];

    const restoreFromStorage = () => {
        try {
            const props = localStorage.getItem('bot.chart_props');
            if (props) {
                const { granularity: tmp_granularity, chart_type: tmp_chart_type } = JSON.parse(props);
                setGranularity(tmp_granularity);
                setChartType(tmp_chart_type);
            }
        } catch {
            localStorage.remove('bot.chart_props');
        }
    };

    React.useEffect(() => {
        restoreFromStorage();
        globalObserver.register('bot.init', initializeBot);
        globalObserver.register('bot.contract', updateContract);

        return () => {
            globalObserver.unregister('bot.init', initializeBot);
            globalObserver.unregister('bot.contract', updateContract);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.symbol]);

    const initializeBot = symbol => {
        if (symbol && state.symbol !== symbol) {
            setVisibility(false);
            setState({
                ...state,
                symbol,
            });
            setTimeout(() => {
                setVisibility(true);
            }, 500);
        }
    };

    const updateContract = contract => {
        if (!contract) return;
        if (contract?.is_sold) {
            setState({
                ...state,
                should_barrier_display: false,
            });
        } else {
            const updated_state = {
                ...state,
                barriers: BarrierTypes[contract.contract_type],
            };

            if (contract?.barrier) updated_state.high = contract.barrier;
            if (contract?.high_barrier) {
                updated_state.high = contract.high_barrier;
                updated_state.low = contract.low;
            }
            setState(updated_state);
        }
    };

    const getKey = request => `${request.ticks_history}-${request.granularity}`;
    const requestAPI = data =>
        api_base.api.send(data).catch(e => {
            globalObserver.emit('Error', e);
        });

    const requestSubscribe = (request, callback) => {
        const { ticks_history: symbol, style: dataType, granularity: tmp_granularity } = request;

        if (dataType === 'candles') {
            listeners[getKey(request)] = ticksService.monitor({
                symbol,
                granularity: tmp_granularity,
                callback,
                is_chart_candles: true,
            });
        } else {
            listeners[getKey(request)] = ticksService.monitor({
                symbol,
                callback,
                is_chart_ticks: true,
            });
        }
    };

    const wsForgetStream = stream_id => {
        api_base.api_chart.forget(stream_id);
    };

    const requestForget = request => {
        const { ticks_history: symbol, style: dataType, granularity: tmp_granularity } = request;

        const requested_key = getKey(request);
        if (dataType === 'candles') {
            ticksService.stopMonitor({
                symbol,
                granularity: tmp_granularity,
                key: listeners[requested_key],
                is_chart: true,
            });
        } else {
            ticksService.stopMonitor({
                symbol,
                key: listeners[requested_key],
                is_chart: true,
            });
        }
        delete listeners[requested_key];
    };

    const renderTopWidgets = () => <span />;

    if (!show) return null;

    const settings = {
        assetInformation: false,
        countdown: true,
        isHighestLowestMarkerEnabled: false,
        language: getLanguage()?.toLowerCase(),
        position: 'bottom',
        theme: 'light',
    };

    const saveToLocalStorage = () => {
        localStorage.setItem(
            'bot.chart_props',
            JSON.stringify({
                granularity,
                chart_type,
            })
        );
    };

    const handleChartTypeChange = data => {
        setChartType(data);
        saveToLocalStorage();
    };

    const handleGranularityChange = data => {
        setGranularity(data);
        saveToLocalStorage();
    };

    return (
        <SmartChart
            id='bbot'
            barriers={[]}
            showLastDigitStats={show_digits_stats}
            chartControlsWidgets={null}
            enabledChartFooter={false}
            // chartStatusListener={v => !v}
            toolbarWidget={() => (
                <ToolbarWidgets updateChartType={handleChartTypeChange} updateGranularity={handleGranularityChange} />
            )}
            chartType={chart_type}
            isMobile={false}
            enabledNavigationWidget={true}
            granularity={granularity}
            requestAPI={requestAPI}
            requestForget={requestForget}
            requestForgetStream={wsForgetStream}
            requestSubscribe={requestSubscribe}
            settings={settings}
            symbol={state.symbol}
            topWidgets={renderTopWidgets}
            // isConnectionOpened={is_socket_opened}
            // getMarketsOrder={getMarketsOrder}
            isLive
            leftMargin={80}
        />
    );
};

ChartContent.propTypes = {
    show_digits_stats: PropTypes.bool,
};

const Chart = ({ setShowChart }) => (
    <DraggableResizeWrapper
        boundary={'.main'}
        minWidth={600}
        minHeight={600}
        header={translate('Chart')}
        onClose={() => {
            setShowChart(is_shown => !is_shown);
        }}
    >
        <ChartContent />
    </DraggableResizeWrapper>
);

Chart.propTypes = {
    setShowChart: PropTypes.func.isRequired,
};

export default Chart;

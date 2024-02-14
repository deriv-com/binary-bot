import React, { Suspense } from 'react';
import { api_base } from '@api-base';
import { getLanguage } from '@storage';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import PropTypes from 'prop-types';
import ChartTicksService from '../../botPage/common/ChartTicksService';
import ToolbarWidgets from './ToolbarWidgets';
import './chart.scss';
import { DraggableResizeWrapper } from '../Draggable';
import { SmartChart } from '../SmartChart';
import { debounce } from '../../utilities/utility-functions';

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

const settings = {
    assetInformation: false,
    countdown: true,
    isHighestLowestMarkerEnabled: false,
    language: getLanguage()?.toLowerCase(),
    position: 'bottom',
    theme: 'light',
};

const getInitialSymbolFromBlockly = () =>
    // eslint-disable-next-line no-underscore-dangle
    Blockly?.getMainWorkspace()
        ?.getAllBlocks()
        ?.find(e => e?.type === 'trade')
        ?.inputList?.find(e => e?.name === 'MARKETDEFINITION')
        ?.fieldRow?.find(e => e?.name === 'SYMBOL_LIST')?.value_;

const ChartContent = ({ show_digits_stats }) => {
    const [show, setVisibility] = React.useState(false);
    const [state, setState] = React.useState({
        high: undefined,
        low: undefined,
        symbol: getInitialSymbolFromBlockly(),
        should_barrier_display: false,
        granularity: null,
        chart_type: null,
    });

    const chart_type_ref = React.useRef(null);
    const granularity_ref = React.useRef(null);

    const ticksService = new ChartTicksService(api_base.api_chart);
    const listeners = [];

    const saveToLocalStorage = data => {
        localStorage.setItem(
            'bot.chart_props',
            JSON.stringify({
                ...data,
            })
        );
    };

    const handleChartTypeChange = data => {
        chart_type_ref.current = data;
        setState(prev_state => ({
            ...prev_state,
            chart_type: data,
        }));
        saveToLocalStorage({
            ...state,
            granularity: granularity_ref.current,
            chart_type: data,
        });
    };

    const handleGranularityChange = data => {
        granularity_ref.current = data;
        setState(prev_state => ({
            ...prev_state,
            granularity: data,
        }));
        saveToLocalStorage({
            ...state,
            chart_type: chart_type_ref.current,
            granularity: data,
        });
    };

    const restoreFromStorage = () => {
        let tmp_granularity = 0;
        let tmp_chart_type = 'line';
        try {
            const props = localStorage.getItem('bot.chart_props');
            if (props) {
                const stored_object = JSON.parse(props);
                tmp_granularity = stored_object.granularity;
                tmp_chart_type = stored_object.chart_type;
            }
        } catch {
            localStorage.remove('bot.chart_props');
        }
        setState(prev_state => ({
            ...prev_state,
            granularity: tmp_granularity,
            chart_type: tmp_chart_type,
        }));
        chart_type_ref.current = tmp_chart_type;
        granularity_ref.current = tmp_granularity;
        setVisibility(true);
    };

    React.useEffect(() => {
        restoreFromStorage();

        return () => {
            wsForgetStream();
        };
    }, []);

    React.useEffect(() => {
        globalObserver.register('bot.init', initializeBot);
        globalObserver.register('bot.contract', updateContract);

        return () => {
            globalObserver.unregister('bot.init', initializeBot);
            globalObserver.unregister('bot.contract', updateContract);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.symbol]);

    const initializeBot = debounce(symbol => {
        if (symbol && state.symbol !== symbol) {
            setState(prev_state => ({
                ...prev_state,
                symbol,
            }));
        }
    }, 600);

    const updateContract = contract => {
        if (!contract) return;
        if (contract?.is_sold) {
            setState(prev_state => ({
                ...prev_state,
                should_barrier_display: false,
            }));
        } else {
            const updated_state = {
                barriers: BarrierTypes[contract.contract_type],
            };

            if (contract?.barrier) updated_state.high = contract.barrier;
            if (contract?.high_barrier) {
                updated_state.high = contract.high_barrier;
                updated_state.low = contract.low;
            }
            // enable when should_barrier_display is available
            // setState(prev_state => ({
            //     ...prev_state,
            //     ...updated_state,
            // }));
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

    const wsForgetStream = () => {
        const requested_key = getKey({
            ticks_history: state.symbol,
            granularity: state.granularity,
        });
        if (listeners[requested_key])
            api_base.api_chart.forgetAll(chart_type_ref.current === 'candles' ? 'candles' : 'ticks');
        delete listeners[requested_key];
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
        if (listeners[requested_key])
            api_base.api_chart.forgetAll(chart_type_ref.current === 'candles' ? 'candles' : 'ticks');
        delete listeners[requested_key];
    };

    const renderTopWidgets = () => <span />;

    if (!show) return null;

    return (
        <Suspense fallback={'Loading...'}>
            <SmartChart
                id='bbot'
                barriers={[]}
                showLastDigitStats={show_digits_stats}
                chartControlsWidgets={null}
                enabledChartFooter={false}
                // chartStatusListener={v => !v}
                toolbarWidget={() => (
                    <ToolbarWidgets
                        updateChartType={handleChartTypeChange}
                        updateGranularity={handleGranularityChange}
                    />
                )}
                chartType={state.chart_type}
                isMobile={false}
                enabledNavigationWidget={true}
                granularity={state.granularity}
                requestAPI={requestAPI}
                requestForget={requestForget}
                // requestForgetStream={wsForgetStream}
                requestSubscribe={requestSubscribe}
                settings={settings}
                symbol={state.symbol}
                topWidgets={renderTopWidgets}
                // isConnectionOpened={is_socket_opened}
                // getMarketsOrder={getMarketsOrder}
                isLive
                leftMargin={80}
            />
        </Suspense>
    );
};

ChartContent.propTypes = {
    show_digits_stats: PropTypes.bool,
};

const Chart = ({ setShowChart }) => (
    <DraggableResizeWrapper
        boundary={'#bot-blockly'}
        minWidth={600}
        minHeight={600}
        modalHeight={600}
        modalWidth={600}
        header={translate('Chart')}
        onClose={() => {
            setShowChart(is_shown => !is_shown);
        }}
        enableResizing
    >
        <ChartContent />
    </DraggableResizeWrapper>
);

Chart.propTypes = {
    setShowChart: PropTypes.func.isRequired,
};

export default Chart;

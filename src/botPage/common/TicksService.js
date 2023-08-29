import { Map } from 'immutable';
import { isLoggedIn } from '@storage';
import { historyToTicks, getLast } from '../../common/utils/binary';
import { observer as globalObserver } from '../../common/utils/observer';
import { doUntilDone, getUUID } from '../bot/tools';

const parseTick = tick => ({
    epoch: +tick.epoch,
    quote: +tick.quote,
});

const parseOhlc = ohlc => ({
    open: +ohlc.open,
    high: +ohlc.high,
    low: +ohlc.low,
    close: +ohlc.close,
    epoch: +(ohlc.open_time || ohlc.epoch),
});

const parseCandles = candles => candles.map(t => parseOhlc(t));

const updateTicks = (ticks, newTick) => (getLast(ticks).epoch >= newTick.epoch ? ticks : [...ticks.slice(1), newTick]);

const updateCandles = (candles, ohlc) => {
    const lastCandle = getLast(candles);
    if (
        (lastCandle.open === ohlc.open &&
            lastCandle.high === ohlc.high &&
            lastCandle.low === ohlc.low &&
            lastCandle.close === ohlc.close &&
            lastCandle.epoch === ohlc.epoch) ||
        lastCandle.epoch > ohlc.epoch
    ) {
        return candles;
    }
    const prevCandles = lastCandle.epoch === ohlc.epoch ? candles.slice(0, -1) : candles.slice(1);
    return [...prevCandles, ohlc];
};

const getType = isCandle => (isCandle ? 'candles' : 'ticks');

export default class TicksService {
    constructor(api) {
        this.api = api;
        this.ticks = new Map();
        this.candles = new Map();
        this.tickListeners = new Map();
        this.ohlcListeners = new Map();
        this.subscriptions = new Map();
        this.ticks_history_promise = null;
        this.candles_promise = null;
        this.active_symbols_promise = null;
        this.observe();
    }
    requestPipSizes() {
        if (this.pipSizes) {
            return Promise.resolve(this.pipSizes);
        }

        if (!this.active_symbols_promise) {
            this.active_symbols_promise = new Promise(resolve => {
                this.getActiveSymbols()
                    .then((activeSymbols = []) => {
                        this.pipSizes = activeSymbols
                            ?.reduce((s, i) => s.set(i.symbol, +(+i.pip).toExponential().substring(3)), new Map())
                            .toObject();
                        resolve(this.pipSizes);
                    })
                    .catch(error => {
                        globalObserver.emit('Error', error);
                    });
            });
        }
        return this.active_symbols_promise;
    }

    getActiveSymbols = () =>
        new Promise(resolve => {
            const getSymbols = () => {
                this.api
                    .send({ active_symbols: 'brief' })
                    .then(({ active_symbols }) =>
                        // eslint-disable-next-line camelcase
                        resolve(active_symbols)
                    )
                    .catch(err => {
                        globalObserver.emit('Error', err);
                    });
            };

            if (isLoggedIn()) {
                this.api.expectResponse('authorize').then(() => {
                    getSymbols();
                });
            } else {
                getSymbols();
            }
        });

    request(options) {
        const { symbol, granularity } = options;

        const style = getType(granularity);

        if (style === 'ticks' && this.ticks.has(symbol)) {
            return Promise.resolve(this.ticks.get(symbol));
        }

        if (style === 'candles' && this.candles.hasIn([symbol, Number(granularity)])) {
            return Promise.resolve(this.candles.getIn([symbol, Number(granularity)]));
        }

        return this.requestStream({ ...options, style });
    }
    monitor(options) {
        const { symbol, granularity, callback } = options;
        const type = getType(granularity);
        const key = getUUID();

        this.request(options).catch(e => globalObserver.emit('Error', e));

        if (type === 'ticks') {
            this.tickListeners = this.tickListeners.setIn([symbol, key], callback);
        } else {
            this.ohlcListeners = this.ohlcListeners.setIn([symbol, Number(granularity), key], callback);
        }

        return key;
    }
    stopMonitor(options) {
        const { symbol, granularity, key } = options;
        const type = getType(granularity);

        if (type === 'ticks' && this.tickListeners.hasIn([symbol, key])) {
            this.tickListeners = this.tickListeners.deleteIn([symbol, key]);
        }

        if (type === 'candles' && this.ohlcListeners.hasIn([symbol, Number(granularity), key])) {
            this.ohlcListeners = this.ohlcListeners.deleteIn([symbol, Number(granularity), key]);
        }

        this.unsubscribeIfEmptyListeners(options);
    }
    unsubscribeIfEmptyListeners(options) {
        const { symbol, granularity } = options;
        let needToUnsubscribe = false;
        const tickListener = this.tickListeners.get(symbol);
        const ohlcListener = this.ohlcListeners.getIn([symbol, Number(granularity)]);

        if (tickListener && !tickListener.size) {
            this.tickListeners = this.tickListeners.delete(symbol);
            this.ticks = this.ticks.delete(symbol);
            needToUnsubscribe = true;
        }

        if (ohlcListener && !ohlcListener.size) {
            this.ohlcListeners = this.ohlcListeners.deleteIn([symbol, Number(granularity)]);
            this.candles = this.candles.deleteIn([symbol, Number(granularity)]);
            needToUnsubscribe = true;
        }

        if (needToUnsubscribe) {
            this.unsubscribeAllAndSubscribeListeners(symbol);
        }
    }
    unsubscribeAllAndSubscribeListeners(symbol) {
        const ohlcSubscriptions = this.subscriptions.getIn(['ohlc', symbol]);
        const tickSubscription = this.subscriptions.getIn(['tick', symbol]);
        const subscription = [];
        const ohlc = ohlcSubscriptions ? Array.from(ohlcSubscriptions.values()) : [];

        if (ohlc?.length) {
            subscription.push(...ohlc);
        }

        if (tickSubscription) {
            subscription.push(tickSubscription);
        }
        Promise.all(subscription.map(id => doUntilDone(() => this.api.forget(id))));
        this.subscriptions = new Map();
    }
    updateTicksAndCallListeners(symbol, ticks) {
        if (this.ticks.get(symbol) === ticks) {
            return;
        }
        const listeners = this.tickListeners.get(symbol);
        this.ticks = this.ticks.set(symbol, ticks);

        if (listeners) {
            listeners.forEach(callback => callback(this.ticks.get(symbol)));
        }
    }
    updateCandlesAndCallListeners(address, candles) {
        if (this.ticks.getIn(address) === candles) {
            return;
        }
        const listeners = this.ohlcListeners.getIn(address);
        this.candles = this.candles.setIn(address, candles);

        if (listeners) {
            listeners.forEach(callback => callback(this.candles.getIn(address)));
        }
    }
    observe() {
        this.api.onMessage().subscribe(({ data }) => {
            if (data?.error?.code) {
                return;
            }
            if (data?.msg_type === 'tick') {
                const {
                    tick,
                    tick: { symbol, id },
                } = data;
                if (this.ticks.has(symbol)) {
                    this.subscriptions = this.subscriptions.setIn(['tick', symbol], id);
                    this.updateTicksAndCallListeners(symbol, updateTicks(this.ticks.get(symbol), parseTick(tick)));
                }
            }

            if (data?.msg_type === 'ohlc') {
                const {
                    ohlc,
                    ohlc: { symbol, granularity, id },
                } = data;
                if (this.candles.hasIn([symbol, Number(granularity)])) {
                    this.subscriptions = this.subscriptions.setIn(['ohlc', symbol, Number(granularity)], id);
                    const address = [symbol, Number(granularity)];
                    this.updateCandlesAndCallListeners(
                        address,
                        updateCandles(this.candles.getIn(address), parseOhlc(ohlc))
                    );
                }
            }
        });
    }
    requestStream(options) {
        const { style } = options;
        const stringified_options = JSON.stringify(options);

        if (style === 'ticks') {
            if (!this.ticks_history_promise || this.ticks_history_promise.stringified_options !== stringified_options) {
                this.ticks_history_promise = {
                    promise: this.requestPipSizes().then(() => this.requestTicks(options)),
                    stringified_options,
                };
            }

            return this.ticks_history_promise.promise;
        }

        if (style === 'candles') {
            if (!this.candles_promise || this.candles_promise.stringified_options !== stringified_options) {
                this.candles_promise = {
                    promise: this.requestPipSizes().then(() => this.requestTicks(options)),
                    stringified_options,
                };
            }

            return this.candles_promise.promise;
        }

        return [];
    }
    requestTicks(options) {
        const { symbol, granularity, style } = options;
        const request_object = {
            ticks_history: symbol,
            subscribe: 1,
            end: 'latest',
            count: 1000,
            granularity: granularity ? Number(granularity) : undefined,
            style,
        };

        return new Promise((resolve, reject) => {
            doUntilDone(() => this.api.send(request_object))
                .then(r => {
                    if (style === 'ticks') {
                        const ticks = historyToTicks(r.history);

                        this.updateTicksAndCallListeners(symbol, ticks);
                        resolve(ticks);
                    } else {
                        const candles = parseCandles(r.candles);

                        this.updateCandlesAndCallListeners([symbol, Number(granularity)], candles);
                        resolve(candles);
                    }
                })
                .catch(e => {
                    reject(e);
                    globalObserver.emit('Error', e);
                });
        });
    }

    forget = subscription_id => {
        if (subscription_id) {
            this.api.forget(subscription_id);
        }
    };

    unsubscribeFromTicksService() {
        if (this.ticks_history_promise) {
            const { stringified_options } = this.ticks_history_promise;
            const { symbol = '' } = JSON.parse(stringified_options);
            if (symbol) {
                this.forget(this.subscriptions.getIn(['tick', symbol]));
            }
        }
        if (this.candles_promise) {
            const { stringified_options } = this.candles_promise;
            const { symbol = '' } = JSON.parse(stringified_options);
            if (symbol) {
                this.forget(this.subscriptions.getIn(['candle', symbol]));
            }
        }
    }
}

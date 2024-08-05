import { datadogLogs } from '@datadog/browser-logs';

const DATADOG_CLIENT_LOGS_TOKEN = process.env.DATADOG_CLIENT_LOGS_TOKEN ?? '';
const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';
let dataDogSessionSampleRate = 0;

dataDogSessionSampleRate = process.env.DATADOG_LOGS_SESSION_SAMPLE_RATE
    ? +process.env.DATADOG_LOGS_SESSION_SAMPLE_RATE
    : 1;
let dataDogVersion = '';
let dataDogEnv = '';

if (isProduction) {
    dataDogVersion = `binary-bot-${process.env.REF_NAME}`;
    dataDogEnv = 'production';
} else if (isStaging) {
    dataDogEnv = 'staging';
}

if (DATADOG_CLIENT_LOGS_TOKEN) {
    datadogLogs.init({
        clientToken: DATADOG_CLIENT_LOGS_TOKEN,
        site: 'datadoghq.com',
        forwardErrorsToLogs: false,
        service: 'BinaryBot',
        sessionSampleRate: dataDogSessionSampleRate,
        version: dataDogVersion,
        env: dataDogEnv,
    });
}

export const REQUESTS = [
    'active_symbols',
    'authorize',
    'balance',
    'buy',
    'proposal',
    'proposal_open_contract',
    'transaction',
    'ticks_history',
    'history',
];

class APIMiddleware {
    constructor(config) {
        this.config = config;
        this.addGlobalMethod();
    }

    /* eslint-disable class-methods-use-this */
    getRequestType = request => {
        let req_type;
        REQUESTS.forEach(type => {
            if (type in request && !req_type) req_type = type;
        });

        return req_type;
    };

    /* eslint-disable class-methods-use-this */
    log = (measures = [], is_bot_running) => {
        if (measures && measures.length) {
            measures.forEach(measure => {
                datadogLogs.logger.info(measure.name, {
                    name: measure.name,
                    startTime: measure.startTimeDate,
                    duration: measure.duration,
                    detail: measure.detail,
                    isBotRunning: is_bot_running,
                });
            });
        }
    };

    /* eslint-disable class-methods-use-this */
    defineMeasure = res_type => {
        if (res_type) {
            let measure;
            if (res_type === 'history') {
                performance.mark('ticks_history_end');
                measure = performance.measure('ticks_history', 'ticks_history_start', 'ticks_history_end');
            } else {
                performance.mark(`${res_type}_end`);
                measure = performance.measure(`${res_type}`, `${res_type}_start`, `${res_type}_end`);
            }
            return (measure.startTimeDate = new Date(Date.now() - measure.startTime));
        }
        return false;
    };

    sendIsCalled = ({ response_promise, args: [request] }) => {
        const req_type = this.getRequestType(request);
        if (req_type) performance.mark(`${req_type}_start`);
        response_promise
            .then(res => {
                const res_type = this.getRequestType(res);
                if (res_type) {
                    this.defineMeasure(res_type);
                }
            })
            .catch(() => {});
        return response_promise;
    };

    sendRequestsStatistic = is_bot_running => {
        REQUESTS.forEach(req_type => {
            const measure = performance.getEntriesByName(req_type);
            if (measure && measure.length) {
                if (DATADOG_CLIENT_LOGS_TOKEN) {
                    this.log(measure, is_bot_running, req_type);
                }
            }
        });
        performance.clearMeasures();
    };

    addGlobalMethod() {
        if (window) window.sendRequestsStatistic = this.sendRequestsStatistic;
    }
}

export default APIMiddleware;

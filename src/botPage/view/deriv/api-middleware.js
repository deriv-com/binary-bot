export const REQUESTS = [
    'active_symbols',
    'authorize',
    'balance',
    'buy',
    'proposal',
    'proposal_open_contract',
    'run-proposal',
    'transaction',
    'ticks_history',
];

class APIMiddleware {
    constructor(config) {
        this.config = config;
        this.debounced_calls = {};
        this.addGlobalMethod();
    }

    getRequestType = request => {
        let req_type;
        REQUESTS.forEach(type => {
            if (type in request && !req_type) req_type = type;
        });

        return req_type;
    };

    defineMeasure = res_type => {
        if (res_type) {
            let measure;
            if (res_type === 'proposal') {
                performance.mark('first_proposal_end');
                if (performance.getEntriesByName('bot-start', 'mark').length) {
                    measure = performance.measure('run-proposal', 'bot-start', 'first_proposal_end');
                    performance.clearMarks('bot-start');
                    console.table('bot-first-run', measure.duration)
                }
            }
            if (res_type === 'history') {
                performance.mark('ticks_history_end');
                measure = performance.measure('ticks_history', 'ticks_history_start', 'ticks_history_end');
                console.table('ticks_history', measure.duration)
            } else {
                performance.mark(`${res_type}_end`);
                measure = performance.measure(`${res_type}`, `${res_type}_start`, `${res_type}_end`);
                if (res_type === 'proposal') { 
                    console.table('proposal', measure.duration)
                }
            }
            return (measure.startTimeDate = new Date(Date.now() - measure.startTime));
        }
        return false;
    };

    sendIsCalled = ({ response_promise, args: [request] }) => {
        const req_type = this.getRequestType(request);
        if (req_type) performance.mark(`${req_type}_start`);
        response_promise.then(res => {
            const res_type = this.getRequestType(res);
            if (res_type) {
                this.defineMeasure(res_type);
            }
        });
        return response_promise;
    };

    sendRequestsStatistic = () => {
        // REQUESTS.forEach(req_type => {
        //    const measure = performance.getEntriesByName(req_type);
        // });
        performance.clearMeasures();
    };

    addGlobalMethod() {
        if (window) window.sendRequestsStatistic = this.sendRequestsStatistic;
    }
}

export default APIMiddleware;

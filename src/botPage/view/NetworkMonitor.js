import { observer as globalObserver } from '../../common/utils/observer';
import api_base from './deriv/api_base';

export default class NetworkMonitor {
    constructor(apiInstance, parentElement) {
        this.api = apiInstance;
        this.parentElement = parentElement;
        this.addEvents();
    }
    addEvents() {
        if ('onLine' in navigator) {
            window.addEventListener('online', () => this.setStatus());
            window.addEventListener('offline', () => this.setStatus());
        } else {
            navigator.onLine = true;
            setInterval(() => this.setStatus(), 10000);
        }
        this.setStatus();
    }
    setStatus() {
        if (navigator.onLine) {
            this.parentElement.html("<span class='connecting'></span>");
            api_base.api
                .send({ ping: '1' })
                .then(() => {
                    this.parentElement.html("<span class='online'></span>");
                })
                .catch(e => globalObserver.emit('Error', e));
        } else {
            this.parentElement.html("<span class='offline'></span>");
        }
    }
}

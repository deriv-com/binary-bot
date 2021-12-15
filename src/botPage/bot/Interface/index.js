import TradeEngine from '../TradeEngine';
import { noop, createDetails } from '../tools';
import getTicksInterface from './TicksInterface';
import getToolsInterface from './ToolsInterface';

/**
 * Bot - Bot Module
 * @namespace Bot
 */

export default class Interface {
    constructor($scope) {
        this.tradeEngine = new TradeEngine($scope);
        this.api = $scope.api;
        this.observer = $scope.observer;
        this.$scope = $scope;
        this.getTicksInterface = () => getTicksInterface(this.tradeEngine);
        this.getToolsInterface = () => getToolsInterface(this.tradeEngine);
    }
    getGlobalInterface() {
        return {
            watch: (...args) => this.tradeEngine.watch(...args),
            sleep: (...args) => this.sleep(...args),
            alert: (...args) => alert(...args), // eslint-disable-line no-alert
            prompt: (...args) => prompt(...args), // eslint-disable-line no-alert
            console: {
                log(...args) {
                    // eslint-disable-next-line no-console
                    console.log(new Date().toLocaleTimeString(), ...args);
                },
            },
        };
    }
    getInterface() {
        return {
            ...this.getBotInterface(),
            ...this.getToolsInterface(),
        };
    }
    getBotInterface() {
        const getDetail = (i, pipSize) => createDetails(this.tradeEngine.data.contract, pipSize)[i];

        return {
            init: (...args) => this.tradeEngine.init(...args),
            start: (...args) => this.tradeEngine.start(...args),
            stop: (...args) => this.tradeEngine.stop(...args),
            purchase: (...args) => this.tradeEngine.purchase(...args),
            getPurchaseReference: () => this.tradeEngine.getPurchaseReference(),
            getAskPrice: contractType => Number(this.getProposal(contractType).ask_price),
            getPayout: contractType => Number(this.getProposal(contractType).payout),
            isSellAvailable: () => this.tradeEngine.isSellAtMarketAvailable(),
            sellAtMarket: () => this.tradeEngine.sellAtMarket(),
            getSellPrice: () => this.getSellPrice(),
            isResult: result => getDetail(10) === result,
            readDetails: i => getDetail(i - 1, this.tradeEngine.getPipSize()),
        };
    }
    sleep(arg = 1) {
        return new Promise(
            r =>
                setTimeout(() => {
                    r();
                    setTimeout(() => this.observer.emit('CONTINUE'), 0);
                }, arg * 1000),
            noop
        );
    }
    getProposal(contractType) {
        return this.tradeEngine.data.proposals.find(
            proposal =>
                proposal.contractType === contractType &&
                proposal.purchaseReference === this.tradeEngine.getPurchaseReference()
        );
    }
    getSellPrice() {
        return this.tradeEngine.getSellPrice();
    }
}

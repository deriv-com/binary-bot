import crc32 from 'crc-32/crc32';
import pako from 'pako';
import { getTokenList, get as getStorage } from '@storage';
import { isProduction } from '@utils';
import { observer } from '../../common/utils/observer';

export const cleanXmlDom = xmlDom => {
    const uselessAttributes = ['x', 'y'];
    const updatedDom = xmlDom;

    const removeAttributesRecursively = element => {
        uselessAttributes.forEach(uselessAttribute => element.removeAttribute(uselessAttribute));
        Array.from(element.children).forEach(child => removeAttributesRecursively(child));
    };

    removeAttributesRecursively(updatedDom);
    return updatedDom;
};

export const getHash = string => btoa(crc32.str(string));

export const getLoginId = () => {
    const tokenList = getTokenList();
    const current_login_id = getStorage('active_loginid') || '';
    let lognin_id = null;
    if (tokenList.length) {
        tokenList.forEach(token_list => {
            if (current_login_id === token_list.loginInfo.loginid) {
                lognin_id = token_list.loginInfo.loginid;
            }
        });
    }
    return lognin_id;
};

export const getUTCDate = () => {
    const date = new Date();
    const utcDate = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCMinutes()
    );

    return Math.floor(utcDate / 1000);
};

export default class DataCollection {
    constructor(workspace) {
        this.workspace = workspace;
        this.loginid = getLoginId();
        if (isProduction()) {
            observer.register('bot.contract', contract => this.trackTransaction(contract));
            observer.register('bot.running', () => this.trackRun());
        }

        DataCollection.prototype.rendered = workspace.rendered;
    }

    IS_PENDING = false;
    IS_PROCESSED = true;
    endpoint = 'https://dbot-conf-dot-deriv-bi-reporting.as.r.appspot.com/dbotconf';
    loginid;
    runId = '';
    runStart = 0;
    shouldPostXml = true;
    strategyContent = '';
    transactionIds = {};
    workspace;

    async trackRun() {
        const xmlDom = cleanXmlDom(Blockly.Xml.workspaceToDom(this.workspace, /* opt_noId */ true));
        const xmlString = Blockly.Xml.domToText(xmlDom);
        const xmlHash = getHash(xmlString);

        if (getHash(this.strategyContent) !== xmlHash) {
            this.shouldPostXml = true;
            this.setStrategyContent(xmlString);
        }

        this.setRunId(getHash(xmlHash + this.loginid + Math.random()));
        this.setRunStart(getUTCDate());
    }

    async trackTransaction(contract) {
        if (!contract) return;

        const { buy: transactionId } = contract.transaction_ids;
        const isKnownTransaction = Object.keys(this.transactionIds).includes(transactionId.toString());

        if (isKnownTransaction) {
            return;
        }

        this.transactionIds[transactionId] = this.IS_PENDING;

        const getPayload = () => {
            const content = pako.gzip(this.strategyContent);

            return {
                body: content,
                headers: {
                    'Content-Encoding': 'gzip',
                    'Content-Type': 'application/xml',
                    Referer: window.location.hostname,
                },
            };
        };

        fetch(`${this.endpoint}/${this.runId}/${transactionId}/${this.runStart}/${getHash(this.strategyContent)}`, {
            ...(this.shouldPostXml ? getPayload() : {}),
            method: 'POST',
            mode: 'cors',
        })
            .then(() => {
                this.shouldPostXml = false;
                this.transactionIds[transactionId] = this.IS_PROCESSED;
            })
            .catch(() => {
                delete this.transactionIds[transactionId];
            });
    }

    setRunId(runId) {
        this.runId = runId;
    }

    setRunStart(timestamp) {
        this.runStart = timestamp;
    }

    setStrategyContent(strategyContent) {
        this.strategyContent = strategyContent;
    }
}

export const createDataStore = workspace => new DataCollection(workspace);

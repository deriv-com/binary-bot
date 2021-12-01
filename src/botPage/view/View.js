import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'jquery-ui/ui/widgets/dialog';
import _Blockly, { load } from './blockly';
import Chart from './Dialogs/Chart';
import Limits from './Dialogs/Limits';
import logHandler from './logger';
import { symbolPromise } from './shared';
import { showDialog } from '../bot/tools';
import config, { updateConfigCurrencies } from '../common/const';
import { isVirtual } from '../common/tools';
import {
    logoutAllTokens,
    getOAuthURL,
    generateLiveApiInstance,
    AppConstants,
    addTokenIfValid,
} from '../../common/appId';
import { translate } from '../../common/i18n';
import { isEuCountry, showHideEuElements, hasEuAccount } from '../../common/footer-checks';
import googleDrive from '../../common/integrations/GoogleDrive';
import { getLanguage, showBanner } from '../../common/lang';
import { observer as globalObserver } from '../../common/utils/observer';
import {
    getTokenList,
    removeAllTokens,
    get as getStorage,
    set as setStorage,
    getToken,
    syncWithDerivApp,
    convertForDerivStore,
} from '../../common/utils/storageManager';
import GTM from '../../common/gtm';
import {
    getMissingBlocksTypes,
    getDisabledMandatoryBlocks,
    getUnattachedMandatoryPairs,
    saveBeforeUnload,
} from './blockly/utils';

// Deriv components
import Header from './deriv/layout/Header';
import Main from './deriv/layout/Main';
import store from './deriv/store';

let realityCheckTimeout;
let chart;
const clientInfo = {};

export const api = generateLiveApiInstance();

api.events.on('balance', response => {
    if (response.balance.accounts) {
        clientInfo.balance = response.balance;
    } else {
        const accountToUpdate = response.balance.loginid;
        const isDemo = accountToUpdate.includes('VRTC');

        clientInfo.balance.accounts[accountToUpdate].balance = response.balance.balance;
        if (isDemo) {
            clientInfo.balance.total.deriv_demo.amount = response.balance.balance;
        } else {
            Object.keys(response.balance.total).forEach(
                plf => (clientInfo.balance.total[plf] = response.balance.total[plf])
            );
        }
    }

    ReactDOM.render(
        <Provider store={store}>
            <Header clientInfo={clientInfo} />
        </Provider>,
        document.getElementById('header-wrapper')
    );

    const {
        balance: { balance: b, currency },
    } = response;

    const elTopMenuBalances = document.querySelectorAll('.topMenuBalance');
    const localString = getLanguage().replace('_', '-');
    const balance = (+b).toLocaleString(localString, {
        minimumFractionDigits: config.lists.CRYPTO_CURRENCIES.includes(currency) ? 8 : 2,
    });

    elTopMenuBalances.forEach(elTopMenuBalance => {
        const element = elTopMenuBalance;
        element.textContent = `${balance} ${currency === 'UST' ? 'USDT' : currency}`;
    });

    globalObserver.setState({ balance: b, currency });
});

const subscribeToAllAccountsBalance = token => {
    api.authorize(token).then(() => {
        api.send({ forget_all: 'balance' }).then(() => {
            api.send({
                balance: 1,
                account: 'all',
                subscribe: 1,
            });
        });
    });
};

const showRealityCheck = () => {
    $('.blocker').show();
    $('.reality-check').show();
};

const hideRealityCheck = () => {
    $('#rc-err').hide();
    $('.blocker').hide();
    $('.reality-check').hide();
};

const stopRealityCheck = () => {
    clearInterval(realityCheckTimeout);
    realityCheckTimeout = null;
};

const realityCheckInterval = stopCallback => {
    realityCheckTimeout = setInterval(() => {
        const now = parseInt(new Date().getTime() / 1000);
        const checkTime = +getStorage('realityCheckTime');
        if (checkTime && now >= checkTime) {
            showRealityCheck();
            stopRealityCheck();
            stopCallback();
        }
    }, 1000);
};

const startRealityCheck = (time, token, stopCallback) => {
    stopRealityCheck();
    if (time) {
        const start = parseInt(new Date().getTime() / 1000) + time * 60;
        setStorage('realityCheckTime', start);
        realityCheckInterval(stopCallback);
    } else {
        const tokenObj = getToken(token);
        if (tokenObj.hasRealityCheck) {
            const checkTime = +getStorage('realityCheckTime');
            if (!checkTime) {
                showRealityCheck();
            } else {
                realityCheckInterval(stopCallback);
            }
        }
    }
};

const clearRealityCheck = () => {
    setStorage('realityCheckTime', null);
    stopRealityCheck();
};

const getActiveToken = (tokenList, activeToken) => {
    const activeTokenObject = tokenList.filter(tokenObject => tokenObject.token === activeToken);
    return activeTokenObject.length ? activeTokenObject[0] : tokenList[0];
};

const updateTokenList = () => {
    const tokenList = getTokenList();
    const loginButton = $('#login, #toolbox-login');
    const accountList = $('#account-list, #toolbox-account-list');
    clientInfo.tokenList = tokenList;
    if (tokenList.length === 0) {
        clientInfo.isLogged = false;
        loginButton.show();
        accountList.hide();

        // If logged out, determine EU based on IP.
        isEuCountry(api).then(isEu => showHideEuElements(isEu));
        showBanner();

        $('.account-id')
            .removeAttr('value')
            .text('');
        $('.account-type').text('');
        $('.login-id-list')
            .children()
            .remove();
    } else {
        clientInfo.isLogged = true;
        loginButton.hide();
        accountList.show();

        const activeToken = getActiveToken(tokenList, getStorage(AppConstants.STORAGE_ACTIVE_TOKEN));
        showHideEuElements(hasEuAccount(tokenList));
        showBanner();
        subscribeToAllAccountsBalance(activeToken.token);

        if (!('loginInfo' in activeToken)) {
            removeAllTokens();
            updateTokenList();
        } else {
            const activeLoginId = tokenList[0].accountName;
            const clientAccounts = convertForDerivStore(tokenList);
            setStorage('active_loginid', activeLoginId);
            setStorage('client.accounts', JSON.stringify(clientAccounts));
            syncWithDerivApp();
        }

        tokenList.forEach(tokenInfo => {
            let prefix;

            if (isVirtual(tokenInfo)) {
                prefix = 'Virtual Account';
            } else if (tokenInfo.loginInfo.currency === 'UST') {
                prefix = 'USDT Account';
            } else {
                prefix = `${tokenInfo.loginInfo.currency} Account`;
            }

            if (tokenInfo === activeToken) {
                $('.account-id')
                    .attr('value', `${tokenInfo.token}`)
                    .text(`${tokenInfo.accountName}`);
                $('.account-type').text(`${prefix}`);
            } else {
                $('.login-id-list').append(
                    `<a href="#" value="${tokenInfo.token}"><li><span>${prefix}</span><div>${tokenInfo.accountName}</div></li></a><div class="separator-line-thin-gray"></div>`
                );
            }
        });
    }
};

const applyToolboxPermissions = () => {
    const fn = getTokenList().length ? 'show' : 'hide';
    $('#runButton, #showSummary, #logButton')
        [fn]()
        .prevAll('.toolbox-separator:first')
        [fn]();
};

const checkForRequiredBlocks = () => {
    const displayError = errorMessage => {
        const error = new Error(errorMessage);
        globalObserver.emit('Error', error);
    };

    const blockLabels = { ...config.blockLabels };
    const missingBlocksTypes = getMissingBlocksTypes();
    const disabledBlocksTypes = getDisabledMandatoryBlocks().map(block => block.type);
    const unattachedPairs = getUnattachedMandatoryPairs();

    if (missingBlocksTypes.length) {
        missingBlocksTypes.forEach(blockType =>
            displayError(`"${blockLabels[blockType]}" ${translate('block should be added to the workspace')}.`)
        );
        return false;
    }

    if (disabledBlocksTypes.length) {
        disabledBlocksTypes.forEach(blockType =>
            displayError(`"${blockLabels[blockType]}" ${translate('block should be enabled')}.`)
        );
        return false;
    }

    if (unattachedPairs.length) {
        unattachedPairs.forEach(pair =>
            displayError(
                `"${blockLabels[pair.childBlock]}" ${translate('must be added inside:')} "${
                    blockLabels[pair.parentBlock]
                }"`
            )
        );
        return false;
    }

    return true;
};

const setFileBrowser = () => {
    const readFile = (f, dropEvent = {}) => {
        const reader = new FileReader();
        reader.onload = e => load(e.target.result, dropEvent);
        reader.readAsText(f);
    };

    const handleFileSelect = e => {
        let files;
        let dropEvent;
        if (e.type === 'drop') {
            e.stopPropagation();
            e.preventDefault();
            ({ files } = e.dataTransfer);
            dropEvent = e;
        } else {
            ({ files } = e.target);
        }
        files = Array.from(files);
        files.forEach(file => {
            if (file.type.match('text/xml')) {
                readFile(file, dropEvent);
            } else {
                globalObserver.emit('ui.log.info', `${translate('File is not supported:')} ${file.name}`);
            }
        });
        $('#files').val('');
    };

    const handleDragOver = e => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
    };

    const dropZone = document.body;

    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

    $('#files').on('change', handleFileSelect);

    $('#open_btn')
        .on('click', () => {
            $.FileDialog({
                // eslint-disable-line new-cap
                accept: '.xml',
                cancelButton: 'Close',
                dragMessage: 'Drop files here',
                dropheight: 400,
                errorMessage: 'An error occured while loading file',
                multiple: false,
                okButton: 'OK',
                readAs: 'DataURL',
                removeMessage: 'Remove&nbsp;file',
                title: 'Load file',
            });
        })
        .on('files.bs.filedialog', ev => {
            handleFileSelect(ev.files);
        })
        .on('cancel.bs.filedialog', ev => {
            handleFileSelect(ev);
        });
};

const addBindings = blockly => {
    const stop = e => {
        if (e) {
            e.preventDefault();
        }
        stopRealityCheck();
        blockly.stop();
    };

    const getAccountSwitchText = () => {
        if (blockly.hasStarted()) {
            return [
                translate(
                    'Binary Bot will not place any new trades. Any trades already placed (but not expired) will be completed by our system. Any unsaved changes will be lost.'
                ),
                translate('Note: Please see the Binary.com statement page for details of all confirmed transactions.'),
            ];
        }
        return [translate('Any unsaved changes will be lost.')];
    };

    const logout = () => {
        showDialog({
            title: translate('Are you sure?'),
            text: getAccountSwitchText(),
            className: 'logout-dialog',
        })
            .then(() => {
                blockly.stop();
                googleDrive.signOut();
                GTM.setVisitorId();
                removeTokens();
            })
            .catch(() => {});
    };

    const removeTokens = () => {
        logoutAllTokens().then(() => {
            updateTokenList();
            globalObserver.emit('ui.log.info', translate('Logged you out!'));
            clearRealityCheck();
            clearActiveTokens();
            window.location.reload();
        });
    };

    const clearActiveTokens = () => {
        setStorage(AppConstants.STORAGE_ACTIVE_TOKEN, '');
        setStorage('active_loginid', null);
        syncWithDerivApp();
    };

    $('.panelExitButton').click(function onClick() {
        $(this)
            .parent()
            .hide();
    });

    $('.draggable-dialog')
        .hide()
        .dialog({
            resizable: false,
            autoOpen: false,
            width: Math.min(document.body.offsetWidth, 770),
            height: Math.min(document.body.offsetHeight, 600),
            closeText: '',
            classes: { 'ui-dialog-titlebar-close': 'icon-close' },
        });

    $('#undo').click(() => {
        blockly.undo();
    });

    $('#redo').click(() => {
        blockly.redo();
    });

    $('#zoomIn').click(() => {
        blockly.zoomOnPlusMinus(true);
    });

    $('#zoomOut').click(() => {
        blockly.zoomOnPlusMinus(false);
    });

    $('#rearrange').click(() => {
        blockly.cleanUp();
    });

    $('#chartButton').click(() => {
        if (!chart) {
            chart = new Chart(api);
        }

        chart.open();
    });

    const exportContent = {};
    exportContent.summaryPanel = () => {
        globalObserver.emit('summary.export');
    };

    exportContent.logPanel = () => {
        globalObserver.emit('log.export');
    };

    const addExportButtonToPanel = panelId => {
        const buttonHtml =
            '<button class="icon-save" style="position:absolute;top:50%;margin:-10px 0 0 0;right:2em;padding:0.2em"></button>';
        const $button = $(buttonHtml);
        const panelSelector = `[aria-describedby="${panelId}"]`;
        if (!$(`${panelSelector} .icon-save`).length) {
            $button.insertBefore(`${panelSelector} .icon-close`);
            $(`${panelSelector} .icon-close`).blur();
            $($(`${panelSelector} .icon-save`)).click(() => {
                exportContent[panelId]();
            });
        }
    };

    const showSummary = () => {
        $('#summaryPanel')
            .dialog('option', 'minWidth', 770)
            .dialog('open');
        addExportButtonToPanel('summaryPanel');
    };

    $('#logButton').click(() => {
        $('#logPanel').dialog('open');
        addExportButtonToPanel('logPanel');
    });

    $('#showSummary').click(showSummary);

    $('#deriv__logout-btn, #logout, #toolbox-logout').click(() => {
        saveBeforeUnload();
        logout();
        hideRealityCheck();
    });

    globalObserver.register('ui.logout', () => {
        $('.barspinner').show();
        removeTokens();
        hideRealityCheck();
    });

    const submitRealityCheck = () => {
        const time = parseInt($('#realityDuration').val());
        if (time >= 10 && time <= 60) {
            hideRealityCheck();
            startRealityCheck(time, null, () => $('#stopButton').triggerHandler('click'));
        } else {
            $('#rc-err').show();
        }
    };

    $('#continue-trading').click(() => {
        submitRealityCheck();
    });

    $('#realityDuration').keypress(e => {
        const char = String.fromCharCode(e.which);
        if (e.keyCode === 13) {
            submitRealityCheck();
        }
        /* Unicode check is for firefox because it
         * trigger this event when backspace, arrow keys are pressed
         * in chrome it is not triggered
         */
        const unicodeStrings = /[\u0008|\u0000]/; // eslint-disable-line no-control-regex
        if (unicodeStrings.test(char)) return;

        if (!/([0-9])/.test(char)) {
            e.preventDefault();
        }
    });

    const startBot = limitations => {
        const elRunButtons = document.querySelectorAll('#runButton, #summaryRunButton');
        const elStopButtons = document.querySelectorAll('#stopButton, #summaryStopButton');

        elRunButtons.forEach(el => {
            const elRunButton = el;
            elRunButton.style.display = 'none';
            elRunButton.setAttributeNode(document.createAttribute('disabled'));
        });
        elStopButtons.forEach(el => {
            const elStopButton = el;
            elStopButton.style.display = 'inline-block';
        });

        showSummary();
        blockly.run(limitations);
    };

    $('#runButton').click(() => {
        // setTimeout is needed to ensure correct event sequence
        if (!checkForRequiredBlocks()) {
            setTimeout(() => $('#stopButton').triggerHandler('click'));
            return;
        }

        const token = $('.account-id')
            .first()
            .attr('value');
        const tokenObj = getToken(token);
        initRealityCheck(() => $('#stopButton').triggerHandler('click'));

        if (tokenObj && tokenObj.hasTradeLimitation) {
            const limits = new Limits(api);
            limits
                .getLimits()
                .then(startBot)
                .catch(() => {});
        } else {
            startBot();
        }
    });

    $('#stopButton')
        .click(e => stop(e))
        .hide();

    $('[aria-describedby="summaryPanel"]').on('click', '#summaryRunButton', () => {
        $('#runButton').trigger('click');
    });

    $('[aria-describedby="summaryPanel"]').on('click', '#summaryStopButton', () => {
        $('#stopButton').trigger('click');
    });

    $('#resetButton').click(() => {
        let dialogText;
        if (blockly.hasStarted()) {
            dialogText = [
                translate(
                    'Binary Bot will not place any new trades. Any trades already placed (but not expired) will be completed by our system. Any unsaved changes will be lost.'
                ),
                translate('Note: Please see the Binary.com statement page for details of all confirmed transactions.'),
            ];
        } else {
            dialogText = [translate('Any unsaved changes will be lost.')];
        }
        showDialog({
            title: translate('Are you sure?'),
            text: dialogText,
            className: 'reset-dialog',
        })
            .then(() => {
                blockly.stop();
                blockly.resetWorkspace();
                setTimeout(() => blockly.cleanUp(), 0);
            })
            .catch(() => {});
    });

    globalObserver.register('ui.switch_account', token => {
        showDialog({
            title: translate('Are you sure?'),
            text: getAccountSwitchText(),
            className: 'switch-account-dialog',
        })
            .then(() => {
                blockly.stop();
                $('.barspinner').show();
                GTM.setVisitorId();
                const activeToken = token;
                const tokenList = getTokenList();
                setStorage('tokenList', '');
                addTokenIfValid(activeToken, tokenList).then(() => {
                    setStorage(AppConstants.STORAGE_ACTIVE_TOKEN, activeToken);
                    window.location.reload();
                });
            })
            .catch(() => {});
    });

    $('#btn__login, #login, #toolbox-login')
        .bind('click.login', () => {
            saveBeforeUnload();
            document.location = getOAuthURL();
        })
        .text(translate('Log in'));

    $('#statement-reality-check').click(() => {
        document.location = `https://www.binary.com/${getLanguage()}/user/statementws.html#no-reality-check`;
    });
    $(document).keydown(e => {
        if (e.which === 189) {
            // Ctrl + -
            if (e.ctrlKey) {
                blockly.zoomOnPlusMinus(false);
                e.preventDefault();
            }
        } else if (e.which === 187) {
            // Ctrl + +
            if (e.ctrlKey) {
                blockly.zoomOnPlusMinus(true);
                e.preventDefault();
            }
        }
    });
};

const addEventHandlers = blockly => {
    const getRunButtonElements = () => document.querySelectorAll('#runButton, #summaryRunButton');
    const getStopButtonElements = () => document.querySelectorAll('#stopButton, #summaryStopButton');

    window.addEventListener('storage', e => {
        window.onbeforeunload = null;
        if (['activeToken', 'active_loginid'].includes(e.key) && e.newValue !== e.oldValue) {
            window.location.reload();
        }
        if (e.key === 'realityCheckTime') hideRealityCheck();
    });

    globalObserver.register('Error', error => {
        getRunButtonElements().forEach(el => {
            const elRunButton = el;
            elRunButton.removeAttribute('disabled');
        });

        if (error.error && error.error.error.code === 'InvalidToken') {
            removeAllTokens();
            updateTokenList();
            blockly.stop();
        }
    });

    globalObserver.register('bot.running', () => {
        getRunButtonElements().forEach(el => {
            const elRunButton = el;
            elRunButton.style.display = 'none';
            elRunButton.setAttributeNode(document.createAttribute('disabled'));
        });
        getStopButtonElements().forEach(el => {
            const elStopButton = el;
            elStopButton.style.display = 'inline-block';
            elStopButton.removeAttribute('disabled');
        });
    });

    globalObserver.register('bot.stop', () => {
        // Enable run button, this event is emitted after the interpreter
        // killed the API connection.
        getStopButtonElements().forEach(el => {
            const elStopButton = el;
            elStopButton.style.display = null;
            elStopButton.removeAttribute('disabled');
        });
        getRunButtonElements().forEach(el => {
            const elRunButton = el;
            elRunButton.style.display = null;
            elRunButton.removeAttribute('disabled');
        });
    });

    globalObserver.register('bot.info', info => {
        if ('profit' in info) {
            const token = $('.account-id')
                .first()
                .attr('value');
            const user = getToken(token);
            globalObserver.emit('log.revenue', {
                user,
                profit: info.profit,
                contract: info.contract,
            });
        }
    });
};

export default class View {
    constructor() {
        logHandler();
        renderReactComponents();
        this.initPromise = new Promise(resolve => {
            updateConfigCurrencies().then(() => {
                symbolPromise.then(() => {
                    updateTokenList();
                    this.blockly = new _Blockly();
                    this.blockly.initPromise.then(() => {
                        initRealityCheck(() => $('#stopButton').triggerHandler('click'));
                        applyToolboxPermissions();
                        setFileBrowser();
                        addBindings(this.blockly);
                        addEventHandlers(this.blockly);
                        resolve();
                    });
                });
            });
        });
    }
}

function initRealityCheck(stopCallback) {
    startRealityCheck(
        null,
        $('.account-id')
            .first()
            .attr('value'),
        stopCallback
    );
}
function renderReactComponents() {
    ReactDOM.render(
        <Provider store={store}>
            <Main clientInfo={clientInfo} />
        </Provider>,
        document.getElementById('main')
    );
}

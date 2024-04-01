import { getActiveLoginId, getClientAccounts, syncWithDerivApp, removeAllTokens } from '@storage';
import { translate } from '@i18n';
import config, { updateConfigCurrencies } from '@currency-config';
import { observer as globalObserver } from '@utilities/observer';
import google_drive_util from '@utilities/integrations/GoogleDrive';
import GTM from '@utilities/integrations/gtm';
import { logoutAllTokens } from '../common/appId';
import {
    saveBeforeUnload,
    getMissingBlocksTypes,
    getDisabledMandatoryBlocks,
    getUnattachedMandatoryPairs,
} from './utils';
import { load } from '.';
import Limits from '../components/Dialogs/Limits';
import { throttle } from '../utils';

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
            displayError(`'${blockLabels[blockType]}' ${translate('block should be added to the workspace')}.`)
        );
        return false;
    }

    if (disabledBlocksTypes.length) {
        disabledBlocksTypes.forEach(blockType =>
            displayError(`'${blockLabels[blockType]}' ${translate('block should be enabled')}.`)
        );
        return false;
    }

    if (unattachedPairs.length) {
        unattachedPairs.forEach(pair =>
            displayError(
                `'${blockLabels[pair.childBlock]}' ${translate('must be added inside:')} '${
                    blockLabels[pair.parentBlock]
                }'`
            )
        );
        return false;
    }

    return true;
};

export function applyToolboxPermissions() {
    const login_id = getActiveLoginId();
    const account_list = getClientAccounts();
    const fn = login_id && account_list?.[login_id]?.token ? 'show' : 'hide';
    $('#runButton')[fn]().prevAll('.toolbox-separator:first')[fn]();
}

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

const setElementActions = blockly => {
    setFileBrowser();
    addBindings(blockly);
    addEventHandlers(blockly);
};

export const showSummary = () => {
    globalObserver.emit('summary.show');
};

const addBindings = blockly => {
    const stop = e =>
        new Promise((resolve, reject) => {
            if (e) {
                e.preventDefault();
            }
            stopBlockly(blockly)
                .then(() => resolve())
                .catch(err => reject(err));
        });

    const removeTokens = () => {
        logoutAllTokens().then(() => {
            globalObserver.emit('ui.log.info', translate('Logged you out!'));
            syncWithDerivApp();

            // Todo: Need to remove this reload, and add logic to clear redux state.
            // Need to stop the barspinner once removed this
            window.location.reload();
        });
    };

    $('.panelExitButton').click(function onClick() {
        $(this).parent().hide();
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

    globalObserver.register('ui.logout', () => {
        saveBeforeUnload();
        $('.barspinner').show();
        stopBlockly(blockly);
        google_drive_util.logout();
        GTM.setVisitorId();
        removeTokens();
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

    $('#runButton').click(
        throttle(() => {
            const isStopping = globalObserver.getState('isStopping');
            if (isStopping) return;

            globalObserver.setState({ isStarting: true });

            let timer = globalObserver.getState('timer');

            if (timer) {
                clearInterval(timer);
            }

            let timer_counter = 1;
            if (window.sendRequestsStatistic) {
                // Log is sent every 10 seconds for 2 minutes
                timer = setInterval(() => {
                    window.sendRequestsStatistic();

                    performance.clearMeasures();
                    if (timer_counter === 12) {
                        clearInterval(timer);
                    } else {
                        timer_counter++;
                    }
                }, 10000);

                globalObserver.setState({ timer });
            }

            // setTimeout is needed to ensure correct event sequence
            if (!checkForRequiredBlocks()) {
                setTimeout(() => $('#stopButton').triggerHandler('click'));
                return;
            }

            const login_id = getActiveLoginId();
            const client_accounts = getClientAccounts();

            setTimeout(() => {
                if (login_id && client_accounts?.[login_id]?.hasTradeLimitation) {
                    const limits = new Limits();
                    limits
                        .getLimits()
                        .then(startBot)
                        .catch(() => {});
                } else {
                    startBot();
                }
            }, 0);
        }, 300)
    );

    $('#stopButton').click(
        throttle(async e => {
            globalObserver.setState({ isStopping: true });
            const isStarting = globalObserver.getState('isStarting');
            if (isStarting) {
                globalObserver.setState({ isStopping: false });
                return;
            }
            await stop(e);
        }, 300)
    );

    globalObserver.register('ui.switch_account', () => {
        stopBlockly(blockly);
        GTM.setVisitorId();
    });

    globalObserver.register('bot.reload', () => {
        blockly.initPromise.then(() => {
            updateConfigCurrencies().then(() => {
                blockly.resetAccount();
            });
        });
    });
};

const stopBlockly = async blockly => {
    const timer = globalObserver.getState('timer');

    if (timer) {
        clearInterval(timer);
    }
    performance.clearMeasures();

    return new Promise((resolve, reject) => {
        blockly
            .stop()
            .then(() => resolve())
            .catch(err => reject(err));
    });
};

const addEventHandlers = blockly => {
    const getRunButtonElements = () => document.querySelectorAll('#runButton, #summaryRunButton');
    const getStopButtonElements = () => document.querySelectorAll('#stopButton, #summaryStopButton');

    window.addEventListener('storage', e => {
        window.onbeforeunload = null;
        if (['active_loginid'].includes(e.key) && e.newValue !== e.oldValue) {
            window.location.reload();
        }
    });

    globalObserver.register('Error', async error => {
        globalObserver.setState({ isStarting: false });
        getRunButtonElements().forEach(el => {
            const elRunButton = el;
            elRunButton.removeAttribute('disabled');
        });
        if (error?.error?.code === 'InvalidToken') {
            removeAllTokens();
            await stopBlockly(blockly);
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
            const login_id = getActiveLoginId();
            const client_accounts = getClientAccounts();

            globalObserver.emit('log.revenue', {
                user: client_accounts?.[login_id] || {},
                profit: info.profit,
                contract: info.contract,
            });
        }
    });
};

const initialize = blockly =>
    new Promise(resolve => {
        updateConfigCurrencies().then(() => {
            applyToolboxPermissions();
            setElementActions(blockly);
            resolve();
        });
    });

export default initialize;

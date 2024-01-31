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

const exportContent = {
    'summary-panel': () => {
        globalObserver.emit('summary.export');
    },
    logPanel: () => {
        globalObserver.emit('log.export');
    },
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

export const showSummary = () => {
    $('#summary-panel').dialog('option', 'minWidth', 770).dialog('open');
    addExportButtonToPanel('summary-panel');
};

export const logButton = () => {
    $('#logPanel').dialog('open');
    addExportButtonToPanel('logPanel');
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
            // setTimeout is needed to ensure correct event sequence
            if (!checkForRequiredBlocks()) {
                setTimeout(() => $('#stopButton').triggerHandler('click'));
                return;
            }

            const login_id = getActiveLoginId();
            const client_accounts = getClientAccounts();

            if (login_id && client_accounts?.[login_id]?.hasTradeLimitation) {
                const limits = new Limits();
                limits
                    .getLimits()
                    .then(startBot)
                    .catch(() => {});
            } else {
                startBot();
            }
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

    $('[aria-describedby="summary-panel"]').on('click', '#summaryRunButton', () => {
        $('#runButton').trigger('click');
    });

    $('[aria-describedby="summary-panel"]').on('click', '#summaryStopButton', () => {
        $('#stopButton').trigger('click');
    });

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

const stopBlockly = async blockly =>
    new Promise((resolve, reject) => {
        blockly
            .stop()
            .then(() => resolve())
            .catch(err => reject(err));
    });

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

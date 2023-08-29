import React from 'react';
import Helmet from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TrackJS } from 'trackjs';
import { AppConstants } from '@constants';
import { parseQueryString, getRelatedDeriveOrigin, queryToObjectArray } from '@utils';
import { translate } from '@i18n';
import {
    convertForDerivStore,
    get as getStorage,
    getTokenList,
    isDone,
    removeAllTokens,
    set as setStorage,
    getLanguage,
    isLoggedIn,
} from '@storage';
import { addTokenIfValid } from '../../../../../common/appId';
import { observer as globalObserver } from '../../../../../common/utils/observer';
import _Blockly from '../../../blockly';
import LogTable from '../../../LogTable';
import TradeInfoPanel from '../../../TradeInfoPanel';
import api from '../../api';
import initialize, { applyToolboxPermissions } from '../../blockly-worksace';
import SidebarToggle from '../../components/SidebarToggle';
import { updateActiveAccount, updateActiveToken, updateIsLogged } from '../../store/client-slice';
import { setShouldReloadWorkspace, updateShowTour } from '../../store/ui-slice';
import BotUnavailableMessage from '../Error/bot-unavailable-message-page';
import ToolBox from '../ToolBox';

const Main = () => {
    const [blockly, setBlockly] = React.useState(null);
    const [is_workspace_rendered, setIsWorkspaceRendered] = React.useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const { should_reload_workspace } = useSelector(state => state.ui);
    const { account_type } = useSelector(state => state.client);

    React.useEffect(() => {
        if (should_reload_workspace) {
            // eslint-disable-next-line no-underscore-dangle
            const _blockly = new _Blockly();
            setBlockly(_blockly);
            init(_blockly);
            loginCheck()
                .then(() => initializeBlockly(_blockly))
                .then(() => setIsWorkspaceRendered(_blockly?.is_workspace_rendered));
            dispatch(setShouldReloadWorkspace(false));
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        if (should_reload_workspace && blockly) {
            globalObserver.emit('bot.reload');
            dispatch(setShouldReloadWorkspace(false));
            applyToolboxPermissions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [should_reload_workspace, account_type]);

    const init = () => {
        const local_storage_sync = document.getElementById('localstorage-sync');
        if (local_storage_sync) {
            local_storage_sync.src = `${getRelatedDeriveOrigin().origin}/localstorage-sync.html`;
        }

        const days_passed = Date.now() > (parseInt(getStorage('closedTourPopup')) || 0) + 24 * 60 * 60 * 1000;
        dispatch(updateShowTour(isDone('welcomeFinished') || days_passed));
    };

    // eslint-disable-next-line arrow-body-style
    const loginCheck = async () => {
        return new Promise(resolve => {
            const queryStr = parseQueryString();
            const tokenObjectList = queryToObjectArray(queryStr);

            if (!Array.isArray(getTokenList())) {
                removeAllTokens();
            }

            if (!getTokenList().length) {
                if (tokenObjectList.length) {
                    addTokenIfValid(tokenObjectList[0].token, tokenObjectList).then(() => {
                        const accounts = getTokenList();
                        if (accounts.length) {
                            setStorage(AppConstants.STORAGE_ACTIVE_TOKEN, accounts[0].token);
                            dispatch(updateActiveToken(accounts[0].token));
                            dispatch(updateActiveAccount(accounts[0].loginInfo));
                        }
                        dispatch(updateIsLogged(isLoggedIn()));
                        history.replace('/');
                        api.send({ balance: 1, account: 'all' }).catch(e => {
                            globalObserver.emit('Error', e);
                        });
                        applyToolboxPermissions();
                        resolve();
                    });
                }
                const active_account = getStorage('active_loginid') || '';
                let token_list = [];
                if (getStorage('client.accounts')?.length) {
                    token_list = JSON.parse(getStorage('client.accounts'));
                }
                if (active_account && token_list.length) {
                    const active_token = token_list.find(account => account.accountName === active_account).token;
                    setStorage('activeToken', active_token);
                    resolve();
                }
                setStorage('tokenList', JSON.stringify(token_list));
                setStorage('client.accounts', JSON.stringify(convertForDerivStore(token_list)));
            }
            resolve();
        });
    };

    const initializeBlockly = _blockly =>
        initialize(_blockly).then(() => {
            $('.show-on-load').show();
            $('.barspinner').hide();
            window.dispatchEvent(new Event('resize'));
            const userId = document.getElementById('active-account-name')?.value;
            if (userId) {
                TrackJS.configure({ userId });
            }
            return _blockly.initPromise;
        });

    return (
        <div className='main'>
            <Helmet
                htmlAttributes={{
                    lang: getLanguage(),
                }}
                title={translate('Bot trading |  Automated trading system – Deriv')}
                defer={false}
                meta={[
                    {
                        name: 'description',
                        content: translate(
                            'Automate your trades with Deriv’s bot trading platform, no coding needed. Trade now on forex, synthetic indices, commodities, stock indices, and more.'
                        ),
                    },
                ]}
            />
            <BotUnavailableMessage />
            <div id='bot-blockly'>
                {blockly && <ToolBox blockly={blockly} is_workspace_rendered={is_workspace_rendered} />}
                {/* Blockly workspace will be injected here */}
                <div id='blocklyArea'>
                    <div id='blocklyDiv' style={{ position: 'absolute' }}></div>
                    <SidebarToggle />
                </div>
                {blockly && <LogTable />}
                {blockly && <TradeInfoPanel />}
            </div>
        </div>
    );
};

export default Main;

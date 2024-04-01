import React from 'react';
import Helmet from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TrackJS } from 'trackjs';
import { getRelatedDerivOrigin, queryToObjectArray } from '@utils';
import { translate } from '@i18n';
import { getClientAccounts, isDone, getLanguage, getTourState, getActiveLoginId, syncWithDerivApp } from '@storage';
import SidebarToggle from '@components/common/SidebarToggle';
import ToolBox from '@components/ToolBox';
import useQuery from '@components/hooks/useQuery';
import { updateActiveAccount, updateIsLogged, setLoginId } from '@redux-store/client-slice';
import { setAccountSwitcherLoader, setShouldReloadWorkspace, updateShowTour } from '@redux-store/ui-slice';
import { observer as globalObserver } from '@utilities/observer';
import logHandler from '@utilities/logger';
import { loginAndSetTokens } from '../../common/appId';
import Blockly from '../../blockly';
import TradeInfoPanel from '../../botPage/view/TradeInfoPanel';
import initialize, { applyToolboxPermissions } from '../../blockly/blockly-worksace';
import BotUnavailableMessage from '../Error/bot-unavailable-message-page';
import MoveToDbotBanner from '../Banner/move-to-dbot-banner';
import Chart from '../Dialogs/Chart';
import GoogleDriveModal from '../Dialogs/IntegrationsDialog';
import TradingView from '../Dialogs/TradingView';
import LogTable from '../../botPage/view/log-table';
import FixedDbotBanner from '../Banner/fixed-dbot-banner';

const Main = () => {
    const [blockly, setBlockly] = React.useState(null);
    const [is_workspace_rendered, setIsWorkspaceRendered] = React.useState(false);
    const [show_chart, setShowChart] = React.useState(false);
    const [show_google_drive, setShowGoogleDrive] = React.useState(false);
    const [show_trading_view, setShowTradingView] = React.useState(false);
    const [show_log_table, setShowLogTable] = React.useState(false);
    const [show_summary, setShowSummary] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { should_reload_workspace } = useSelector(state => state.ui);
    const query_object = useQuery();

    const showSummary = () => setShowSummary(true);

    React.useEffect(() => {
        globalObserver.register('summary.show', showSummary);
        return () => {
            globalObserver.unregister('summary.show', showSummary);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        logHandler();
    }, [logHandler]);

    React.useEffect(() => {
        window.addEventListener('storage', event => {
            if (event.key === 'active_loginid') {
                if (event.newValue !== event.oldValue) {
                    window.location.reload();
                }
            }
        });

        const new_blockly = new Blockly();
        setBlockly(new_blockly);
        init();
        loginCheck()
            .then(() => initializeBlockly(new_blockly))
            .then(() => setIsWorkspaceRendered(new_blockly?.is_workspace_rendered));
        dispatch(setShouldReloadWorkspace(false));
    }, []);

    React.useEffect(() => {
        if (should_reload_workspace && blockly) {
            globalObserver.emit('bot.reload');
            dispatch(setShouldReloadWorkspace(false));
            applyToolboxPermissions();
        }
    }, [should_reload_workspace]);

    const init = () => {
        const local_storage_sync = document.getElementById('localstorage-sync');
        if (local_storage_sync) {
            local_storage_sync.src = `${getRelatedDerivOrigin().origin}/localstorage-sync.html`;
        }

        const days_passed = Date.now() > (getTourState() || 0) + 24 * 60 * 60 * 1000;

        dispatch(updateShowTour(isDone('welcomeFinished') || days_passed));
    };

    // eslint-disable-next-line arrow-body-style
    const loginCheck = async () => {
        return new Promise(resolve => {
            const token_list = queryToObjectArray(query_object) || [];
            if (token_list?.length && token_list[0]?.token) {
                navigate('/', { replace: true });
            } else {
                const client_accounts = getClientAccounts();
                Object.keys(client_accounts).forEach(accountName => {
                    token_list.push({
                        accountName,
                        cur: client_accounts[accountName].currency,
                        token: client_accounts[accountName].token,
                    });
                });
            }
            loginAndSetTokens(token_list)
                .then(({ account_info = {} }) => {
                    if (account_info?.loginid) {
                        dispatch(setLoginId(account_info?.loginid));
                        dispatch(updateIsLogged(true));
                        dispatch(updateActiveAccount(account_info));
                        applyToolboxPermissions();
                        syncWithDerivApp();
                    } else {
                        dispatch(updateIsLogged(false));
                    }
                })
                .catch(() => {
                    dispatch(updateIsLogged(false));
                })
                .finally(() => {
                    resolve();
                    dispatch(setAccountSwitcherLoader(false));
                });
        });
    };

    const initializeBlockly = _blockly =>
        initialize(_blockly).then(() => {
            $('.show-on-load').show();
            $('.barspinner').hide();
            window.dispatchEvent(new Event('resize'));
            const userId = getActiveLoginId();
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
            <FixedDbotBanner />
            <MoveToDbotBanner />
            <BotUnavailableMessage />
            <div id='bot-blockly'>
                {blockly && (
                    <>
                        <ToolBox
                            blockly={blockly}
                            is_workspace_rendered={is_workspace_rendered}
                            setShowChart={setShowChart}
                            setShowGoogleDrive={setShowGoogleDrive}
                            setShowTradingView={setShowTradingView}
                            setShowLogTable={setShowLogTable}
                            setShowSummary={setShowSummary}
                        />
                        {show_chart && <Chart setShowChart={setShowChart} />}
                        {show_google_drive && <GoogleDriveModal setShowGoogleDrive={setShowGoogleDrive} />}
                        {show_trading_view && <TradingView setShowTradingView={setShowTradingView} />}
                        {<LogTable setShowLogTable={setShowLogTable} show_log_table={show_log_table} />}
                        {<TradeInfoPanel setShowSummary={setShowSummary} show_summary={show_summary} />}
                    </>
                )}
                {/* Blockly workspace will be injected here */}
                <div id='blocklyArea'>
                    <div id='blocklyDiv' style={{ position: 'absolute' }}></div>
                    <SidebarToggle />
                </div>
            </div>
        </div>
    );
};

export default Main;

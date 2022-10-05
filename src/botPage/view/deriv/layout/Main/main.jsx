import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { TrackJS } from "trackjs";
import {
	get as getStorage,
	set as setStorage,
	getTokenList,
	isDone,
	convertForDerivStore,
	removeAllTokens,
} from "../../../../../common/utils/storageManager";
import { setShouldReloadWorkspace, updateShowTour } from "../../store/ui-slice";
import _Blockly from "../../../blockly";
import ToolBox from "../ToolBox";
import SidebarToggle from "../../components/SidebarToggle";
import LogTable from "../../../LogTable";
import TradeInfoPanel from "../../../TradeInfoPanel";
import { isLoggedIn, getRelatedDeriveOrigin } from "../../utils";
import { updateActiveAccount, updateActiveToken, updateIsLogged } from "../../store/client-slice";
import { addTokenIfValid, AppConstants, queryToObjectArray } from "../../../../../common/appId";
import { parseQueryString } from "../../../../../common/utils/tools";
import initialize, { applyToolboxPermissions } from "../../blockly-worksace";
import { observer as globalObserver } from "../../../../../common/utils/observer";
import BotUnavailableMessage from "../Error/bot-unavailable-message-page.jsx";
import api from "../../api";
import Helmet from "react-helmet";
import { getLanguage } from '../../../../../common/lang';
import { translate } from '../../../../../common/utils/tools';
import DataCollection from '../../../../bot/data-collection';

const Main = () => {
	const [blockly, setBlockly] = React.useState(null);
	const dispatch = useDispatch();
	const history = useHistory();
	const { should_reload_workspace } = useSelector(state => state.ui);
	// const data_collection = new DataCollection();
	// console.log('data_collection', data_collection);


	React.useEffect(() => {
		if (should_reload_workspace) {
			// eslint-disable-next-line no-underscore-dangle
			const _blockly = new _Blockly();
			setBlockly(_blockly);
			init(_blockly);
			loginCheck().then(() => {
				initializeBlockly(_blockly);
			})
			.then(()=> {
				console.log('0', Blockly.mainWorkspace?.rendered)
			})
			// }).then(setTimeout(()=> console.log('0', Blockly.mainWorkspace), 3000))
			dispatch(setShouldReloadWorkspace(false));
		}
	},[]);

	React.useEffect(() => {
		if (should_reload_workspace && blockly) {
			globalObserver.emit("bot.reload")
			dispatch(setShouldReloadWorkspace(false));
			applyToolboxPermissions();
		}
	}, [should_reload_workspace]);

	const init = () => {
		const local_storage_sync = document.getElementById("localstorage-sync");
		if (local_storage_sync) {
			local_storage_sync.src = `${getRelatedDeriveOrigin().origin}/localstorage-sync.html`
		}

		const days_passed =
			Date.now() >
			(parseInt(getStorage("closedTourPopup")) || 0) + 24 * 60 * 60 * 1000;
		dispatch(updateShowTour(isDone("welcomeFinished") || days_passed));
	}

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
						api.send({ balance: 1, account: 'all' }).catch((e) => {
							globalObserver.emit('Error', e);
						})
						applyToolboxPermissions();
						resolve();
					});
				}
				const active_account = getStorage("active_loginid") || "";
				let token_list = [];
				if (getStorage("client.accounts")?.length) {
					token_list = JSON.parse(getStorage("client.accounts"));
				}
				if (active_account && token_list.length) {
					const active_token = token_list.find(account => account.accountName === active_account).token;
					setStorage("activeToken", active_token);
					resolve();
				}
				setStorage("tokenList", JSON.stringify(token_list));
				setStorage("client.accounts", JSON.stringify(convertForDerivStore(token_list)));
			}
			resolve();
		});
	}

	const initializeBlockly = (_blockly) => {
		initialize(_blockly)
			.then(() => {
				$(".show-on-load").show();
				$(".barspinner").hide();
				window.dispatchEvent(new Event("resize"));
				TrackJS.configure({
					userId: document.getElementById("active-account-name")?.value,
				});
				console.log('2 Blockly.mainWorkspace', Blockly.mainWorkspace.rendered);
			})
			.then(()=>{
				console.log('3 Blockly.mainWorkspace', Blockly.mainWorkspace.rendered);
			})
	}
// 	const workspace_ref = React.useRef();
// 	  document.addEventListener('readystatechange', () => {
//     if (document.readyState === 'complete') {
//         const has_workspace = !!document.querySelector("#blocklyDiv")
// 		workspace_ref.current = has_workspace;
//         console.log('has_workspace', has_workspace, 'workspace_ref.current', workspace_ref.current);
//     }
// });


	return (
		<div className="main">
			<Helmet
				htmlAttributes={{
					lang: getLanguage(),
				}}
				title={translate('Bot trading |  Automated trading system – Deriv')}
				defer={false}
				meta={[
					{
						name: 'description',
						content: translate('Automate your trades with Deriv’s bot trading platform, no coding needed. Trade now on forex, synthetic indices, commodities, stock indices, and more.'),
					},
				]}
        	/>
			<BotUnavailableMessage />
			<div id="bot-blockly">
				{/* {blockly && <ToolBox blockly={blockly} hasWorkspace={!!document.querySelector(".blocklyWorkspace")} />} */}
				{blockly && <ToolBox blockly={blockly} />}
				{/* {blockly && <ToolBox blockly={blockly} hasWorkspace={workspace_ref.current} />} */}
				{/* Blockly workspace will be injected here */}
				<div id="blocklyArea">
					<div id="blocklyDiv" style={{ position: 'absolute' }}></div>
					<SidebarToggle />
				</div>
				{blockly && <LogTable />}
				{blockly && <TradeInfoPanel />}
			</div>
		</div>
	)
}

export default Main;

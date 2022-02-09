import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "jquery-ui/ui/widgets/dialog";
import _Blockly, { checkForRequiredBlocks } from "./blockly";
import Chart from "./Dialogs/Chart";
import Limits from "./Dialogs/Limits";
import IntegrationsDialog from "./Dialogs/IntegrationsDialog";
import TradingView from "./Dialogs/TradingView";
import logHandler from "./logger";
import LogTable from "./LogTable";
import { symbolPromise } from "./shared";
import TradeInfoPanel from "./TradeInfoPanel";
import { updateConfigCurrencies } from "../common/const";
import { AppConstants, addTokenIfValid, generateDerivApiInstance } from "../../common/appId";
import google_drive_util from "../../common/integrations/GoogleDrive";
import { observer as globalObserver } from "../../common/utils/observer";
import { getTokenList, removeAllTokens, set as setStorage, getToken } from "../../common/utils/storageManager";
import GTM from "../../common/gtm";
import { saveBeforeUnload } from "./blockly/utils";

// Deriv components
import Main from "./deriv/layout/Main";
import store from "./deriv/store";
import { updateTokenList, removeTokens } from "./deriv/utils";

let chart;
export const api = generateDerivApiInstance();

const tradingView = new TradingView();

const integrationsDialog = new IntegrationsDialog();

export default class View {
  constructor() {
    this.initPromise = new Promise(resolve => {
      updateConfigCurrencies(api).then(() => {
        symbolPromise.then(() => {
          updateTokenList();
          this.blockly = new _Blockly();
          this.blockly.initPromise.then(() => {
            renderReactComponents(this.blockly);
            logHandler();
            this.setElementActions();
            resolve();
          });
        });
      });
    });
  }

  setElementActions() {
    this.addBindings();
    this.addEventHandlers();
  }
  addBindings() {
    const stop = e => {
      if (e) {
        e.preventDefault();
      }
      this.stop();
    };

    $(".panelExitButton").click(function onClick() {
      $(this)
        .parent()
        .hide();
    });

    $(".draggable-dialog")
      .hide()
      .dialog({
        resizable: false,
        autoOpen: false,
        width: Math.min(document.body.offsetWidth, 770),
        height: Math.min(document.body.offsetHeight, 600),
        closeText: "",
        classes: { "ui-dialog-titlebar-close": "icon-close" },
      });

    $("#integrations").click(() => integrationsDialog.open());

    $("#chartButton").click(() => {
      if (!chart) {
        chart = new Chart(api);
      }

      chart.open();
    });

    $("#tradingViewButton").click(() => {
      tradingView.open();
    });

    const exportContent = {};
    exportContent.summaryPanel = () => {
      globalObserver.emit("summary.export");
    };

    exportContent.logPanel = () => {
      globalObserver.emit("log.export");
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
      $("#summaryPanel")
        .dialog("option", "minWidth", 770)
        .dialog("open");
      addExportButtonToPanel("summaryPanel");
    };

    $("#logButton").click(() => {
      $("#logPanel").dialog("open");
      addExportButtonToPanel("logPanel");
    });

    $("#showSummary").click(showSummary);

    globalObserver.register("ui.logout", () => {
      saveBeforeUnload();
      $(".barspinner").show();
      this.stop();
      google_drive_util.logout();
      GTM.setVisitorId();
      removeTokens();
    });

    const startBot = limitations => {
      const elRunButtons = document.querySelectorAll("#runButton, #summaryRunButton");
      const elStopButtons = document.querySelectorAll("#stopButton, #summaryStopButton");

      elRunButtons.forEach(el => {
        const elRunButton = el;
        elRunButton.style.display = "none";
        elRunButton.setAttributeNode(document.createAttribute("disabled"));
      });
      elStopButtons.forEach(el => {
        const elStopButton = el;
        elStopButton.style.display = "inline-block";
      });

      showSummary();
      this.blockly.run(limitations);
    };

    $("#runButton").click(() => {
      // setTimeout is needed to ensure correct event sequence
      if (!checkForRequiredBlocks()) {
        setTimeout(() => $("#stopButton").triggerHandler("click"));
        return;
      }

      const token = document.getElementById("active-token").value;
      const tokenObj = getToken(token);

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

    $("#stopButton")
      .click(e => stop(e))
      .hide();

    $('[aria-describedby="summaryPanel"]').on("click", "#summaryRunButton", () => {
      $("#runButton").trigger("click");
    });

    $('[aria-describedby="summaryPanel"]').on("click", "#summaryStopButton", () => {
      $("#stopButton").trigger("click");
    });

    globalObserver.register("ui.switch_account", token => {
      this.stop();
      $(".barspinner").show();
      GTM.setVisitorId();
      const activeToken = token;
      const tokenList = getTokenList();
      setStorage("tokenList", "");
      addTokenIfValid(activeToken, tokenList).then(() => {
        setStorage(AppConstants.STORAGE_ACTIVE_TOKEN, activeToken);
        window.location.reload();
      });
    });
  }
  stop() {
    this.blockly.stop();
  }
  addEventHandlers() {
    const getRunButtonElements = () => document.querySelectorAll("#runButton, #summaryRunButton");
    const getStopButtonElements = () => document.querySelectorAll("#stopButton, #summaryStopButton");

    window.addEventListener("storage", e => {
      window.onbeforeunload = null;
      if (["activeToken", "active_loginid"].includes(e.key) && e.newValue !== e.oldValue) {
        window.location.reload();
      }
    });

    globalObserver.register("Error", error => {
      getRunButtonElements().forEach(el => {
        const elRunButton = el;
        elRunButton.removeAttribute("disabled");
      });
      if (error?.error?.code === "InvalidToken") {
        removeAllTokens();
        updateTokenList();
        this.stop();
      }
    });

    globalObserver.register("bot.running", () => {
      getRunButtonElements().forEach(el => {
        const elRunButton = el;
        elRunButton.style.display = "none";
        elRunButton.setAttributeNode(document.createAttribute("disabled"));
      });
      getStopButtonElements().forEach(el => {
        const elStopButton = el;
        elStopButton.style.display = "inline-block";
        elStopButton.removeAttribute("disabled");
      });
    });

    globalObserver.register("bot.stop", () => {
      // Enable run button, this event is emitted after the interpreter
      // killed the API connection.
      getStopButtonElements().forEach(el => {
        const elStopButton = el;
        elStopButton.style.display = null;
        elStopButton.removeAttribute("disabled");
      });
      getRunButtonElements().forEach(el => {
        const elRunButton = el;
        elRunButton.style.display = null;
        elRunButton.removeAttribute("disabled");
      });
    });

    globalObserver.register("bot.info", info => {
      if ("profit" in info) {
        const token = document.getElementById("active-token").value;
        const user = getToken(token);
        globalObserver.emit("log.revenue", {
          user,
          profit: info.profit,
          contract: info.contract,
        });
      }
    });
  }
}

function renderReactComponents(blockly) {
  ReactDOM.render(
    <Provider store={store}>
      <Main api={api} blockly={blockly} />
    </Provider>,
    document.getElementById("main")
  );
  ReactDOM.render(
    <Provider store={store}>
      <TradeInfoPanel />
    </Provider>,
    document.getElementById("summaryPanel")
  );
  ReactDOM.render(
    <Provider store={store}>
      <LogTable />
    </Provider>,
    document.getElementById("logTable")
  );
}

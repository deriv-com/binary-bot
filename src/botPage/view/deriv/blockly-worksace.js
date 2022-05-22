import config, { updateConfigCurrencies } from "../../../botPage/common/const";
import logHandler from "../../view/logger";
import { updateTokenList } from "./utils";
import {
  set as setStorage,
  syncWithDerivApp,
  getToken,
  removeAllTokens,
} from "../../../common/utils/storageManager";
import { observer as globalObserver } from "../../../common/utils/observer";
import { translate } from "../../../common/i18n";
import { logoutAllTokens, AppConstants } from "../../../common/appId";
import IntegrationsDialog from "../Dialogs/IntegrationsDialog";
import Chart from "../Dialogs/Chart";
import TradingView from "../Dialogs/TradingView";
import {
  getMissingBlocksTypes,
  getDisabledMandatoryBlocks,
  getUnattachedMandatoryPairs,
} from "../blockly/utils";
import GTM from "../../../common/gtm";
import { load } from "../../view/blockly";
import api from "./api";

const integrationsDialog = new IntegrationsDialog();
const tradingView = new TradingView();
let chart;

const addEvent = (id, fn, event = "click", options = false) => {
  const dom = document.getElementById(id);
  if (dom) {
    dom.addEventListener(event, fn, options);
  }
};

const checkForRequiredBlocks = () => {
  const displayError = (errorMessage) => {
    const error = new Error(errorMessage);
    globalObserver.emit("Error", error);
  };

  const blockLabels = { ...config.blockLabels };
  const missingBlocksTypes = getMissingBlocksTypes();
  const disabledBlocksTypes = getDisabledMandatoryBlocks().map(
    (block) => block.type
  );
  const unattachedPairs = getUnattachedMandatoryPairs();

  if (missingBlocksTypes.length) {
    missingBlocksTypes.forEach((blockType) =>
      displayError(
        `"${blockLabels[blockType]}" ${translate(
          "block should be added to the workspace"
        )}.`
      )
    );
    return false;
  }

  if (disabledBlocksTypes.length) {
    disabledBlocksTypes.forEach((blockType) =>
      displayError(
        `"${blockLabels[blockType]}" ${translate("block should be enabled")}.`
      )
    );
    return false;
  }

  if (unattachedPairs.length) {
    unattachedPairs.forEach((pair) =>
      displayError(
        `"${blockLabels[pair.childBlock]}" ${translate(
          "must be added inside:"
        )} "${blockLabels[pair.parentBlock]}"`
      )
    );
    return false;
  }

  return true;
};

const setFileBrowser = () => {
  const readFile = (f, dropEvent = {}) => {
    const reader = new FileReader();
    reader.onload = (e) => load(e.target.result, dropEvent);
    reader.readAsText(f);
  };

  const handleFileSelect = (e) => {
    let files;
    let dropEvent;
    if (e.type === "drop") {
      e.stopPropagation();
      e.preventDefault();
      ({ files } = e.dataTransfer);
      dropEvent = e;
    } else {
      ({ files } = e.target);
    }
    files = Array.from(files);
    files.forEach((file) => {
      if (file.type.match("text/xml")) {
        readFile(file, dropEvent);
      } else {
        globalObserver.emit(
          "ui.log.info",
          `${translate("File is not supported:")} ${file.name}`
        );
      }
    });
    document.getElementById("files").value = "";
  };

  const handleDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy"; // eslint-disable-line no-param-reassign
  };

  const dropZone = document.body;

  dropZone.addEventListener("dragover", handleDragOver, false);
  dropZone.addEventListener("drop", handleFileSelect, false);

  document
    .getElementById("files")
    .addEventListener("change", handleFileSelect, false);
};

const setElementActions = (blockly) => {
  setFileBrowser();
  addBindings(blockly);
  addEventHandlers();
};

const clearActiveTokens = () => {
  setStorage(AppConstants.STORAGE_ACTIVE_TOKEN, "");
  setStorage("active_loginid", null);
  syncWithDerivApp();
};

export const removeTokens = () => {
  logoutAllTokens().then(() => {
    updateTokenList();
    globalObserver.emit("ui.log.info", translate("Logged you out!"));
    clearActiveTokens();
    // Todo: Need to remove this reload, and add logic to clear redux state.
    // Need to stop the barspinner once removed this
    window.location.reload();
  });
};

const addBindings = (blockly) => {
  globalObserver.register("blockly.stop",()=>{blockly.stop()});

  $(".panelExitButton").click(function onClick() {
    $(this).parent().hide();
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

  addEvent("integrations", () => {
    integrationsDialog.open();
  });
  addEvent("chartButton", () => {
    if (!chart) {
      chart = new Chart(api);
    }

    chart.open();
  });
  addEvent("tradingViewButton", () => tradingView.open());

  const showSummary = () => {
    $("#summaryPanel").dialog("option", "minWidth", 770).dialog("open");
  };
  addEvent("logButton", () => {
    $("#logPanel").dialog("open");
  });

  const startBot = (limitations) => {
    const elRunButtons = document.querySelectorAll(
      "#runButton, #summaryRunButton"
    );
    const elStopButtons = document.querySelectorAll(
      "#stopButton, #summaryStopButton"
    );

    elRunButtons.forEach((el) => {
      const elRunButton = el;
      elRunButton.style.display = "none";
      elRunButton.setAttributeNode(document.createAttribute("disabled"));
    });
    elStopButtons.forEach((el) => {
      const elStopButton = el;
      elStopButton.style.display = "inline-block";
    });

    showSummary();
    blockly.run(limitations);
  };

  globalObserver.register("blockly.start",() => {
    // setTimeout is needed to ensure correct event sequence
    if (!checkForRequiredBlocks()) {
      setTimeout(() => globalObserver.emit("blockly.stop"));
      return;
    }
    startBot();
  });

  globalObserver.register("ui.switch_account", () => {
    globalObserver.emit("blockly.stop")
    GTM.setVisitorId();
  });

  globalObserver.register("bot.reload", () => {
    blockly.initPromise.then(() => {
      updateConfigCurrencies().then(() => {
        blockly.resetAccount();
      });
    });
  });
};

const addEventHandlers = () => {
  const getRunButtonElements = () =>
    document.querySelectorAll("#runButton, #summaryRunButton");
  const getStopButtonElements = () =>
    document.querySelectorAll("#stopButton, #summaryStopButton");

  window.addEventListener("storage", (e) => {
    window.onbeforeunload = null;
    if (
      ["activeToken", "active_loginid"].includes(e.key) &&
      e.newValue !== e.oldValue
    ) {
      window.location.reload();
    }
  });

  globalObserver.register("Error", (error) => {
    getRunButtonElements().forEach((el) => {
      const elRunButton = el;
      elRunButton.removeAttribute("disabled");
    });
    if (error?.error?.code === "InvalidToken") {
      removeAllTokens();
      updateTokenList();
      globalObserver.emit("blockly.stop")
    }
  });

  globalObserver.register("bot.running", () => {
    getRunButtonElements().forEach((el) => {
      const elRunButton = el;
      elRunButton.style.display = "none";
      elRunButton.setAttributeNode(document.createAttribute("disabled"));
    });
    getStopButtonElements().forEach((el) => {
      const elStopButton = el;
      elStopButton.style.display = "inline-block";
      elStopButton.removeAttribute("disabled");
    });
  });

  globalObserver.register("bot.stop", () => {
    // Enable run button, this event is emitted after the interpreter
    // killed the API connection.
    getStopButtonElements().forEach((el) => {
      const elStopButton = el;
      elStopButton.style.display = null;
      elStopButton.removeAttribute("disabled");
    });
    getRunButtonElements().forEach((el) => {
      const elRunButton = el;
      elRunButton.style.display = null;
      elRunButton.removeAttribute("disabled");
    });
  });

  globalObserver.register("bot.info", (info) => {
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
};

const initialize = (blockly) =>
  new Promise((resolve) => {
    updateConfigCurrencies().then(() => {
      updateTokenList();
      logHandler();
      setElementActions(blockly);
      resolve();
    });
  });

export default initialize;

import React from "react";
import { translate } from "../../../common/i18n";
import { observer as globalObserver } from "../../../common/utils/observer";

const RunButton = () => (
  <React.Fragment>
    <button
      title="Run the bot"
      id="summaryRunButton"
      className="toolbox-button icon-run"
      onClick={() => globalObserver.emit("blockly.start")}
    />
    <button
      title={translate("Stop the bot")}
      id="summaryStopButton"
      onClick={() => {
        globalObserver.emit("blockly.stop");
      }}
      className="toolbox-button icon-stop"
      style={{ display: "none" }}
    />
  </React.Fragment>
);

export default RunButton;

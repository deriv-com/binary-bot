import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Load from "./components/load";
import Save from "./components/save";
import Reset from "./components/reset";
import Modal from "../../components/modal";
import { translate } from "../../../../../common/i18n";
import {setIsBotRunning} from '../../store/ui-slice';
import { observer as globalObserver } from '../../../../../common/utils/observer';
import { useDispatch } from "react-redux";
import { load } from "../../../blockly";

const setFileBrowser = () => {
  const readFile = (f, dropEvent = {}) => {
    const reader = new FileReader();
    reader.onload = e => load(e.target.result, dropEvent);
    reader.readAsText(f);
  };

  const handleFileSelect = e => {
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
    files.forEach(file => {
      if (file.type.match("text/xml")) {
        readFile(file, dropEvent);
      } else {
        globalObserver.emit("ui.log.info", `${translate("File is not supported:")} ${file.name}`);
      }
    });
    $("#files").val("");
  };

  const handleDragOver = e => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy"; // eslint-disable-line no-param-reassign
  };

  const dropZone = document.body;

  dropZone.addEventListener("dragover", handleDragOver, false);
  dropZone.addEventListener("drop", handleFileSelect, false);

  $("#files").on("change", handleFileSelect);

  $("#open_btn")
    .on("click", () => {
      $.FileDialog({
        // eslint-disable-line new-cap
        accept: ".xml",
        cancelButton: "Close",
        dragMessage: "Drop files here",
        dropheight: 400,
        errorMessage: "An error occured while loading file",
        multiple: false,
        okButton: "OK",
        readAs: "DataURL",
        removeMessage: "Remove&nbsp;file",
        title: "Load file",
      });
    })
    .on("files.bs.filedialog", ev => {
      handleFileSelect(ev.files);
    })
    .on("cancel.bs.filedialog", ev => {
      handleFileSelect(ev);
    });
}

const ShowModal = ({ modal, onClose, class_name }) => {
  if (!modal) return;
  const { component: Component, props, title } = modal;
  return (
    <Modal onClose={onClose} title={title} class_name={class_name}>
      <Component {...props} />
    </Modal>
  );
};

const ToolBox = ({ blockly }) => {
  const [should_show_modal, setShowModal] = React.useState(false);
  const [selected_modal, updateSelectedModal] = React.useState("");

  const dispatch = useDispatch();
  const { is_gd_ready } = useSelector(state => state.ui);
  const { is_gd_logged_in, is_logged } = useSelector(state => state.client);

  React.useEffect(() => {
    setFileBrowser();
    globalObserver.register('bot.running', () => dispatch(setIsBotRunning(true)));
    globalObserver.register('bot.stop', () => dispatch(setIsBotRunning(false)));
    
    const Keys = Object.freeze({ "zoomIn": 187, "zoomOut": 189 })
    document.body.addEventListener("keydown", (e) => {
      if (e.which === Keys.zoomOut && e.ctrlKey) {
        // Ctrl + -
        e.preventDefault();
        blockly.zoomOnPlusMinus(false);
        return;
      }
      if (e.which === Keys.zoomIn && e.ctrlKey) {
        // Ctrl + +
        e.preventDefault();
        blockly.zoomOnPlusMinus(true);
        return;
      }
    });
  }, []);

  const onCloseModal = () => {
    setShowModal(false);
    updateSelectedModal("");
  };
  const onShowModal = (modal) => {
    setShowModal(true);
    updateSelectedModal(modal);
  };
  const MODALS = {
    load: {
      component: Load,
      title: translate("Load Blocks"),
      props: {
        closeDialog: onCloseModal,
        is_gd_logged_in,
      },
    },
    save: {
      component: Save,
      title: translate("Save Blocks"),
      props: {
        closeDialog: onCloseModal,
        is_gd_logged_in,
        blockly,
      },
    },
    reset: {
      component: Reset,
      title: translate("Are you sure?"),
      props: {
        onCloseModal,
        blockly,
      },
    },
  };
  return (
    <div id="toolbox">
      <button
        id="resetButton"
        className="toolbox-button icon-reset"
        onClick={() => {
          onShowModal("reset");
        }}
      />
      <button
        id="load-xml"
        className="toolbox-button icon-browse"
        onClick={() => {
          onShowModal("load");
        }}
      />
      <button
        id="save-xml"
        className="toolbox-button icon-save"
        onClick={() => {
          onShowModal("save");
        }}
      />
      {is_gd_ready && (
        <button
          id="integrations"
          className="toolbox-button icon-integrations"
        />
      )}

      <span className="toolbox-separator" />
      <button
        id="undo"
        className="toolbox-button icon-undo"
        onClick={() => blockly.undo()}
      />
      <button
        id="redo"
        className="toolbox-button icon-redo"
        onClick={() => blockly.redo()}
      />

      <span className="toolbox-separator" />
      <button
        id="zoomIn"
        className="toolbox-button icon-zoom-in"
        onClick={() => blockly.zoomOnPlusMinus(true)}
      />
      <button
        id="zoomOut"
        className="toolbox-button icon-zoom-out"
        onClick={() => blockly.zoomOnPlusMinus(false)}
      />
      <button
        id="rearrange"
        className="toolbox-button icon-sort"
        onClick={() => blockly.cleanUp()}
      />
      {/* Needs Refactor ClientInfo Structure */}
      {is_logged && (
      <>
        <span className="toolbox-separator" />
        <button id="showSummary" className="toolbox-button icon-summary" />
        <button id="runButton" className="toolbox-button icon-run" />
        <button id="stopButton" className="toolbox-button icon-stop" />
        <button id="logButton" className="toolbox-button icon-info" />
      </>
      )}

      <span className="toolbox-separator" />
      {/* Needs resizeable modal */}
      <button
        id="chartButton"
        className="toolbox-button icon-chart-line"
      />
      <button
        id="tradingViewButton"
        className="toolbox-button icon-trading-view"
      />
      {should_show_modal && (
        <ShowModal
          modal={MODALS[selected_modal]}
          onClose={onCloseModal}
          class_name={selected_modal}
        />
      )}
    </div>
  );
};

ToolBox.propTypes = {
  blockly: PropTypes.object.isRequired,
};

export default ToolBox;

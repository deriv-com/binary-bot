import React from 'react';
import TradeInfoPanel from '../../../TradeInfoPanel';
import LogTable from '../../../LogTable';
import {api} from '../../../View';

const ToolBox = ()=>{
    return(
        <div id="toolbox" className="actions_menu show-on-load">
        <button data-i18n-title="Reset the blocks to their initial state" id="resetButton" className="toolbox-button icon-reset"/>
        <button data-i18n-title="Load new blocks (xml file)" id="load-xml" className="toolbox-button icon-browse"/>
        <button data-i18n-title="Save the existing blocks (xml file)" id="save-xml" className="toolbox-button icon-save"/>
        <button data-i18n-title="Connect Binary Bot to your Google Drive to easily save and re-use your blocks" id="integrations" className="toolbox-button icon-integrations invisible"/>

        <span className="toolbox-separator"/>
        <button data-i18n-title="Undo the changes (Ctrl+Z)" id="undo" className="toolbox-button icon-undo"/>
        <button data-i18n-title="Redo the changes (Ctrl+Shift+Z)" id="redo" className="toolbox-button icon-redo"/>

        <span className="toolbox-separator"/>
        <button data-i18n-title="Zoom In (Ctrl + +)" id="zoomIn" className="toolbox-button icon-zoom-in"/>
        <button data-i18n-title="Zoom Out (Ctrl + -)" id="zoomOut" className="toolbox-button icon-zoom-out"/>
        <button data-i18n-title="Rearrange Vertically" id="rearrange" className="toolbox-button icon-sort"/>

        <span className="toolbox-separator"/>
        <button data-i18n-title="Show/hide the summary pop-up" id="showSummary" className="toolbox-button icon-summary"/>
        <button data-i18n-title="Run the bot" id="runButton" className="toolbox-button icon-run"/>
        <button data-i18n-title="Stop the bot" id="stopButton" className="toolbox-button icon-stop"/>
        <button data-i18n-title="Show log" id="logButton" className="toolbox-button icon-info"/>

        <span className="toolbox-separator"/>
        <button data-i18n-title="Show chart" id="chartButton" className="toolbox-button icon-chart-line"/>
        <button data-i18n-title="Show Trading View" id="tradingViewButton" className="toolbox-button icon-trading-view"/>

        {/* needs remove this part after update clientInfo */}

        <div id="toolbox-account" className="right-header">
            <button id="toolbox-login" data-i18n-text="Log in"/>
            <div id="toolbox-account-list">
                <a href="javascript:;">
                    <ul id="toolbox-main-account" className="nav-menu">
                        <li className="account-type"></li>
                        <li className="account-id"></li>
                        <li className="topMenuBalance"></li>
                        <li className="nav-caret"></li>
                    </ul>
                </a>
            </div>
        </div>

        {/* end of remove part */}
        <div className="toolbox-components">
        <span id="summaryPanel" className="draggable-dialog" data-i18n-title="Summary">
            <TradeInfoPanel/>
        </span>
        <span id="logPanel" className="draggable-dialog" data-i18n-title="Log">
            <div id="logTable" className="logTable-scroll">
                <LogTable />
            </div>
        </span>
        </div>
    </div>
    )
}

export default ToolBox
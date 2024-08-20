// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3bwqd4
import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.total_losses = {
    init: function init() {
        this.appendDummyInput().appendField(translate('No. of Losing Trades'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the number of losing trades'));
    },
    onchange: function onchange(ev) {
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        if (ev.type === Blockly.Events.MOVE) {
            const inputStatement = this.getRootInputTargetBlock();

            if (inputStatement === 'INITIALIZATION') {
                this.unplug(true);
            }
        }
    },
};
Blockly.JavaScript.total_losses = () => ['Bot.getTotalLosses()', Blockly.JavaScript.ORDER_ATOMIC];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/total_losses.js
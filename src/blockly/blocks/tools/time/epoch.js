// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3bwqd4
import {
    translate
} from '../../../../i18n';
import theme from '../../../theme';

Blockly.Blocks.epoch = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Seconds Since Epoch'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the epoch time (seconds since epoch)'));
    },
    onchange,
};
Blockly.JavaScript.epoch = () => ['Bot.getTime()', Blockly.JavaScript.ORDER_ATOMIC];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/time/epoch.js
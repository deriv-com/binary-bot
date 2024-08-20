// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import {
    mainScope
} from '../../relationChecker';
import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.last_digit = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Last Digit'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the last digit of the latest tick'));
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, 'Tick Value');
    },
};
Blockly.JavaScript.last_digit = () => ['Bot.getLastDigit()', Blockly.JavaScript.ORDER_ATOMIC];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/digits/last_digit.js
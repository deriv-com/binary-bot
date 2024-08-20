// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import {
    mainScope
} from '../../relationChecker';
import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.lastDigitList = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Last Digit List'));
        this.setOutput(true, 'Array');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the list of last digit values'));
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, 'Last Digit List');
    },
};
Blockly.JavaScript.lastDigitList = () => ['Bot.getLastDigitList()', Blockly.JavaScript.ORDER_ATOMIC];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/digits/lastDigitList.js
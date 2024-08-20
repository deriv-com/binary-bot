// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.get_decimals = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Last tick decimals'));
        this.setOutput(true, 'String');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the decimals from the latest tick in string format'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.indicatorsColor;
            a.svgPathDark_.style.display = 'none';
        })
    },
};
Blockly.JavaScript.get_decimals = () => ['Bot.getDecimals()', Blockly.JavaScript.ORDER_ATOMIC];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/digits/get_decimals.js
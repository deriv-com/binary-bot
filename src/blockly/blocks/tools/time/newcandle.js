// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3bwqd4
import {
    translate
} from '../../../../i18n';
import config from '../../../../botPage/common/const';
import theme from '../../../theme';

Blockly.Blocks.is_new_candle = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Is New Candle'))
            .appendField(new Blockly.FieldDropdown(config.candleIntervals.slice(1)), 'CANDLEINTERVAL_LIST');
        this.setOutput(true, 'Boolean');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns if the actual candle is a new candle based on the time frame selected'));
    },
    onchange,
};
Blockly.JavaScript.is_new_candle = block => {
    const candleIntervalValue = block.getFieldValue('CANDLEINTERVAL_LIST');
    return [`Bot.isNewCandle(${candleIntervalValue})`, Blockly.JavaScript.ORDER_ATOMIC];
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/time/newcandle.js
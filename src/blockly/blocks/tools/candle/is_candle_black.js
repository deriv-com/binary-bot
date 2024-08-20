// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#szwuog
import {
    translate
} from '../../../../i18n';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

Blockly.Blocks.is_candle_black = {
    init: function init() {
        this.appendValueInput('OHLCOBJ').setCheck('Candle').appendField(translate('is candle black?'));
        this.setInputsInline(false);
        this.setOutput(true, 'Boolean');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Checks if the given candle is black, returns true if close is less than open in the given candle.'));
    },
};

Blockly.JavaScript.is_candle_black = block => {
    const ohlcObj = expectValue(block, 'OHLCOBJ');
    return [`Bot.isCandleBlack(${ohlcObj})`, Blockly.JavaScript.ORDER_ATOMIC];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/candle/is_candle_black.js
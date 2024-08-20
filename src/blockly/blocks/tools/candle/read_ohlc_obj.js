// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#szwuog
import config from '../../../../botPage/common/const';
import {
    translate
} from '../../../../i18n';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

Blockly.Blocks.read_ohlc_obj = {
    init: function init() {
        this.appendValueInput('OHLCOBJ')
            .setCheck('Candle')
            .appendField(translate('Read'))
            .appendField(new Blockly.FieldDropdown(config.ohlcFields), 'OHLCFIELD_LIST')
            .appendField(translate('value in candle'));
        this.setInputsInline(false);
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Read a field in a candle (read from the Candles list)'));
    },
};

Blockly.JavaScript.read_ohlc_obj = block => {
    const ohlcField = block.getFieldValue('OHLCFIELD_LIST');
    const ohlcObj = expectValue(block, 'OHLCOBJ');
    return [`Bot.candleField(${ohlcObj}, '${ohlcField}')`, Blockly.JavaScript.ORDER_ATOMIC];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/candle/read_ohlc_obj.js
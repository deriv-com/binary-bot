// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import config from '../../../../botPage/common/const';
import {
    translate
} from '../../../../i18n';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

Blockly.Blocks.ohlc_values_in_list = {
    init: function init() {
        this.appendValueInput('OHLCLIST')
            .appendField(translate('Make a list of'))
            .appendField(new Blockly.FieldDropdown(config.ohlcFields), 'OHLCFIELD_LIST')
            .appendField(translate('values from candles list'));
        this.setOutput(true, 'Array');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns a list of the selected candle values'));
    },
};

Blockly.JavaScript.ohlc_values_in_list = block => {
    const ohlcList = expectValue(block, 'OHLCLIST');
    const ohlcField = block.getFieldValue('OHLCFIELD_LIST');
    return [`Bot.candleValues(${ohlcList}, '${ohlcField}')`, Blockly.JavaScript.ORDER_ATOMIC];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/candle/ohlc_values_in_list.js
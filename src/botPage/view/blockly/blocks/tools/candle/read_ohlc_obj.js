// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#szwuog
import { translate } from '@i18n';
import config from '../../../../../common/const';
import { expectValue } from '../../shared';

Blockly.Blocks.read_ohlc_obj = {
    init: function init() {
        this.appendValueInput('OHLCOBJ')
            .setCheck('Candle')
            .appendField(translate('Read'))
            .appendField(new Blockly.FieldDropdown(config.ohlcFields), 'OHLCFIELD_LIST')
            .appendField(translate('value in candle'));
        this.setInputsInline(false);
        this.setOutput(true, 'Number');
        this.setColour('#dedede');
        this.setTooltip(translate('Read a field in a candle (read from the Candles list)'));
        this.setHelpUrl('https://github.com/binary-com/binary-bot/wiki');
    },
};

Blockly.JavaScript.read_ohlc_obj = block => {
    const ohlcField = block.getFieldValue('OHLCFIELD_LIST');
    const ohlcObj = expectValue(block, 'OHLCOBJ');
    return [`Bot.candleField(${ohlcObj}, '${ohlcField}')`, Blockly.JavaScript.ORDER_ATOMIC];
};

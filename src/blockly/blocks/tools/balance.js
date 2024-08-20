// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#kqvz7z
import {
    translate
} from '../../../i18n';
import config from '../../../botPage/common/const';
import theme from '../../theme';

Blockly.Blocks.balance = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Balance:'))
            .appendField(new Blockly.FieldDropdown(config.lists.BALANCE_TYPE), 'BALANCE_TYPE');
        this.setOutput(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Get balance number or string'));
    },
};
Blockly.JavaScript.balance = block => {
    const balanceType = block.getFieldValue('BALANCE_TYPE');
    return [`Bot.getBalance('${balanceType}')`, Blockly.JavaScript.ORDER_ATOMIC];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/balance.js
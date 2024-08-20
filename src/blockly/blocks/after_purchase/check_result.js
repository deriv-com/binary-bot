import { translate } from '../../../common/i18n';
import config from '../../../botPage/common/const';
import { insideAfterPurchase } from '../../relationChecker';
import theme from '../../theme';

Blockly.Blocks.contract_check_result = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Result is'))
            .appendField(new Blockly.FieldDropdown(config.lists.CHECK_RESULT), 'CHECK_RESULT');
        this.setOutput(true, 'Boolean');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('True if the result matches the selection'));
    },
    onchange: function onchange(ev) {
        insideAfterPurchase(this, ev, 'After');
    },
};
Blockly.JavaScript.contract_check_result = block => {
    const checkWith = block.getFieldValue('CHECK_RESULT');
    const code = Bot[BinaryBotPrivateVirtualSettings.ongoing && BinaryBotPrivateVirtualSettings.active && Bot.isVirtualValid() ? 'isResultVirtual' : 'isResult']('${checkWith}');
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/after_purchase/check_result.js
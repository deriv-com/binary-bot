import { translate } from '../../../common/i18n';
import config from '../../../botPage/common/const';
import { insideAfterPurchase } from '../../relationChecker';
import theme from '../../theme';

Blockly.Blocks.read_details = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Contract Detail:'))
            .appendField(new Blockly.FieldDropdown(config.lists.DETAILS), 'DETAIL_INDEX');
        this.setOutput(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Reads a selected option from contract details list'));
    },
    onchange: function onchange(ev) {
        insideAfterPurchase(this, ev, 'Read Contract Details');
    },
};
Blockly.JavaScript.read_details = block => {
    const detailIndex = block.getFieldValue('DETAIL_INDEX');
    const code = Bot[BinaryBotPrivateVirtualSettings.ongoing && BinaryBotPrivateVirtualSettings.active && Bot.isVirtualValid() ? 'readDetailsVirtual' : 'readDetails']('${detailIndex}');
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/after_purchase/read_details.js
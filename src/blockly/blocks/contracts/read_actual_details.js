// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#u8i287
import {
    translate
} from '../../../i18n';
// import { insideAfterPurchase } from '../../relationChecker';
import config from '../../../botPage/common/const';
import theme from '../../theme';

Blockly.Blocks.read_actual_details = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Actual Contract Details'))
            .appendField(new Blockly.FieldDropdown(config.lists.ACTUAL_DETAILS), 'DETAIL_INDEX');
        this.setOutput(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Reads a selected option from the actual contract details list'));
    },
    onchange: function onchange() {
        // insideAfterPurchase(this, ev, 'Read Contract Details');
    },
};
Blockly.JavaScript.read_actual_details = block => {
    const detailIndex = block.getFieldValue('DETAIL_INDEX');
    const code = `Bot.readActualDetails('${detailIndex}')`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/contracts/read_actual_details.js
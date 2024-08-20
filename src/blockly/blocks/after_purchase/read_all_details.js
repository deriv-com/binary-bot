// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#u8i287
import {
    translate
} from '../../../common/i18n';
import {
    insideAfterPurchase
} from '../../relationChecker';
import theme from '../../theme';

Blockly.Blocks.read_all_details = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Get All Contract Details'))
        this.setOutput(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Reads all contract details and return as a list: Statement, Ask Price, Payout, Profit, Contract Type, Entry Spot, Entry Value, Exit Spot, Exit Value, Barrier, Result, Entry Value String, Exit Value String'));
    },
    onchange: function onchange(ev) {
        insideAfterPurchase(this, ev, 'Read All Contract Details');
    },
};
Blockly.JavaScript.read_all_details = () => {
    const code = 'Bot[BinaryBotPrivateVirtualSettings.ongoing && BinaryBotPrivateVirtualSettings.active && Bot.isVirtualValid() ? \'readAllDetailsVirtual\' : \'readAllDetails\']()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/after_purchase/read_all_details.js
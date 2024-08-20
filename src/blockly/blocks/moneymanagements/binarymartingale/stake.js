// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import {
    mainScope
} from '../../../relationChecker';
import {
    translate
} from '../../../../i18n';
import theme from '../../../theme';

Blockly.Blocks.binarymartingale_stake = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Binary Martingale Stake'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the actual stake calculated using the Binary Martingale money management'));
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, 'Stake');
    },
};
Blockly.JavaScript.binarymartingale_stake = () => ['Bot.binarymartingaleStake()'];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/binarymartingale/stake.js
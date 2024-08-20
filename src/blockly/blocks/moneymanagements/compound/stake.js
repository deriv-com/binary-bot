// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import {
    mainScope
} from '../../../relationChecker';
import {
    translate
} from '../../../../i18n';
import theme from '../../../theme';

Blockly.Blocks.compound_stake = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Compound Stake'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the actual stake calculated based on the Compound money management'));
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, 'Stake');
    },
};
Blockly.JavaScript.compound_stake = () => ['Bot.compoundStake()'];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/compound/stake.js
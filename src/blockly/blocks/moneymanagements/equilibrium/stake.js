// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import {
    mainScope
} from '../../../relationChecker';
import {
    translate
} from '../../../../i18n';
import theme from '../../../theme';

Blockly.Blocks.equilibrium_stake = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Equilibrium Stake'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the actual stake calculated based on the Equilibrium money management'));
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, 'Stake');
    },
};
Blockly.JavaScript.equilibrium_stake = () => ['Bot.equilibriumStake()'];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/equilibrium/stake.js
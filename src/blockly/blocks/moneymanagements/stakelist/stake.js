// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import {
    mainScope
} from '../../../relationChecker';
import {
    translate
} from '../../../../i18n';
import theme from '../../../theme';

Blockly.Blocks.stake_list_stake = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Stake List Stake'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the actual stake calculated using the Stake List money management'));
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, 'Stake');
    },
};
Blockly.JavaScript.stake_list_stake = () => ['Bot.stakeListStake()'];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/stakelist/stake.js
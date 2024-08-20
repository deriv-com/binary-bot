import { translate } from '../../../i18n';
import { mainScope } from '../../relationChecker';

Blockly.Blocks.last_digit = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Last Digit'));
        this.setOutput(true, 'Number');
        this.setColour('#162d41');                                            // last digit block colour <<<<<//
        this.setTooltip(translate('Returns the last digit of the latest tick'));
        this.setHelpUrl('https://github.com/binary-com/binary-bot/wiki');
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, 'Tick Value');
    },
};
Blockly.JavaScript.last_digit = () => ['Bot.getLastDigit()', Blockly.JavaScript.ORDER_ATOMIC];

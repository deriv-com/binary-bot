import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.account_email = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Account Email'))
        this.setOutput(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the connected account e-mail'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        })
    },
};
Blockly.JavaScript.account_email = () => ['Bot.getAccountEmail()', Blockly.JavaScript.ORDER_NONE];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/account_details/account_email.js
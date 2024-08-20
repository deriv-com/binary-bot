import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.account_name = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Account Holder Name'))
        this.setOutput(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the connected account holder name'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        })
    },
};
Blockly.JavaScript.account_name = () => ['Bot.getAccountName()', Blockly.JavaScript.ORDER_NONE];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/account_details/account_name.js
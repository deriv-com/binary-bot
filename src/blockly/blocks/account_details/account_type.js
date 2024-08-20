import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.account_type = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Account Type'))
        this.setOutput(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the connected account type'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        })
    },
};
Blockly.JavaScript.account_type = () => ['Bot.getAccountType()', Blockly.JavaScript.ORDER_NONE];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/account_details/account_type.js
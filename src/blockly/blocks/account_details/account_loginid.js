import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.account_loginid = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Account Id'))
        this.setOutput(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the connected account id'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        })
    },
};
Blockly.JavaScript.account_loginid = () => ['Bot.getAccountLoginid()', Blockly.JavaScript.ORDER_NONE];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/account_details/account_loginid.js
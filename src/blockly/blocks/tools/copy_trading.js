// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#pmhydb
import {
    translate
} from '../../../i18n';
import {
    insideTrade
} from '../../relationChecker';
import config from '../../../botPage/common/const';
import {
    expectValue
} from '../shared';
import theme from '../../theme';

Blockly.Blocks.copy_trading = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Copy Trading'));
        this.appendValueInput('TOKENS')
            .setCheck(null)
            .appendField(translate('List of Tokens'))
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Use a list of tokens (strings) to send the copies to the token\'s accounts. Insert this block at \'Define your trade contract\''));
    },
    onchange: function onchange(ev) {
        insideTrade(this, ev, 'Definitions');
        this.childBlocks_.map(a => {
            if (a.isShadow_) {
                a.svgPath_.style.fill = theme.underBlockColor;
                a.svgPathDark_.style.display = 'none';
                a.svgGroup_.children[a.type === 'text' ? 4 : 3].children[0].style.fill = theme.shadowDefault;
            }
        });
    },
};
Blockly.JavaScript.copy_trading = block => {
    const tokens = expectValue(block, 'TOKENS');
    const code = `Bot.getCopyTradingTokens(${tokens});`;
    return code;
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/copy_trading.js
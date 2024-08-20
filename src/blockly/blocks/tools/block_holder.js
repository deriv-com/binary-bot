// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#i7qkfj
import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.block_holder = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Blocks inside are ignored'), 'titleWarn');
        this.appendStatementInput('USELESS_STACK').setCheck(null);
        this.setColour(theme.warnColor);
        this.setTooltip(translate('Put your blocks in here to prevent them from being removed'));
    },
    onchange: function onchange() {
        Blockly.utils.addClass(this.getField('titleWarn').textElement_, 'title-warn-block');
    },
};
Blockly.JavaScript.block_holder = () => '';



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/block_holder.js
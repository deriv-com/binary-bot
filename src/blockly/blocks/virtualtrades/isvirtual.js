import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.is_virtual = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Is Virtual Trade'))
        this.setOutput(true, 'Boolean');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('True if the active trade is a virtual trade. When used inside the After Purchase block, it will detect the latest trade.'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        })
    },
};

Blockly.JavaScript.is_virtual = () => ['BinaryBotPrivateVirtualSettings.ongoing && BinaryBotPrivateVirtualSettings.active && Bot.isVirtualValid()'];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/virtualtrades/isvirtual.js
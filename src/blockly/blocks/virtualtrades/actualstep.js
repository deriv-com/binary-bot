import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.actual_virtual_step = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Actual Virtual Step Count'))
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Return the actual virtual step'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        })
    },
};

Blockly.JavaScript.actual_virtual_step = () => ['BinaryBotPrivateVirtualSettings.steps + 1'];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/virtualtrades/actualstep.js
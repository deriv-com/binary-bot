import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.max_virtual_steps = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Max Virtual Steps'))
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Return the max virtual steps'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        })
    },
};

Blockly.JavaScript.max_virtual_steps = () => ['BinaryBotPrivateVirtualSettings.maxSteps'];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/virtualtrades/maxsteps.js
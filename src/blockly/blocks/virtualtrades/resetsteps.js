import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.reset_steps = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Reset Virtual Steps'))
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('It will change the virtual steps count to 0'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        });
        for (let index = 0; index < this.svgGroup_.children.length; index++) {
            const a = this.svgGroup_.children[index];
            if (a.tagName === 'g' && (a.classList.length === 0)) {
                a.children[3].children[0].style.fill = theme.indicatorColorAccent;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyEditableText') {
                a.children[0].style.fill = theme.underBlockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyDraggable') {
                a.children[1].style.fill = theme.subBlockColor;
            }
        }
    },
};

Blockly.JavaScript.reset_steps = () => 'BinaryBotPrivateVirtualSettings.steps = 0;';



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/virtualtrades/resetsteps.js
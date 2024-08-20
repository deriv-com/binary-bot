import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.round_decimals = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Round'))
        this.appendValueInput('VALUE').setCheck('Number');
        this.appendDummyInput().appendField(translate('to'));
        this.appendValueInput('DECIMALS').setCheck('Number');
        this.appendDummyInput().appendField(translate('decimals'));
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Return the input value rounded to the amount of decimals specified'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        });
        for (let index = 0; index < this.svgGroup_.children.length; index++) {
            const a = this.svgGroup_.children[index];
            if (a.tagName === 'g' && (a.classList.length === 0)) {
                a.children[3].children[0].style.fill = theme.shadowDefault;
                a.children[1].style.fill = theme.underBlockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyEditableText') {
                a.children[0].style.fill = theme.underBlockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyDraggable') {
                a.children[1].style.fill = theme.subBlockColor;
            }
        }
    },
};
Blockly.JavaScript.round_decimals = block => {
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '5.2235';
    const decimals = Blockly.JavaScript.valueToCode(block, 'DECIMALS', Blockly.JavaScript.ORDER_ATOMIC) || '2';
    return [`Bot.roundDecimals(${value}, ${decimals})`, Blockly.JavaScript.ORDER_NONE];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/math/round_decimals.js
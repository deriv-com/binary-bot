// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.evenoddamount = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Get the amount of')).appendField(new Blockly.FieldDropdown([
            [translate('even'), 'Even'],
            [translate('odd'), 'Odd']
        ]), 'EVENORODD');
        this.appendValueInput('AMOUNT').setCheck('Number').appendField(translate('numbers in the last'));
        this.appendDummyInput().appendField(translate('digits'));
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the amount of even or odd digits in the selected amount'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.indicatorsColor;
            a.svgPathDark_.style.display = 'none';
        })
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
Blockly.JavaScript.evenoddamount = block => {
    const type = block.getFieldValue('EVENORODD');
    const amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    return [`Bot.getEvenOddAmount({type: '${type}', amount: ${amount}})`, Blockly.JavaScript.ORDER_ATOMIC];
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/digits/evenoddamount.js
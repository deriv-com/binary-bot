// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
// import { mainScope } from '../../relationChecker';
import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.are_the_last_digits_the_same = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Are the last'));
        this.appendValueInput('AMOUNT').setCheck('Number');
        this.setOutput(true, 'Boolean');
        this.appendDummyInput().appendField(translate('digits'));
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                [translate('the same'), 'same'],
                [translate('equal to 0'), '0'],
                [translate('equal to 1'), '1'],
                [translate('equal to 2'), '2'],
                [translate('equal to 3'), '3'],
                [translate('equal to 4'), '4'],
                [translate('equal to 5'), '5'],
                [translate('equal to 6'), '6'],
                [translate('equal to 7'), '7'],
                [translate('equal to 8'), '8'],
                [translate('equal to 9'), '9']
            ]), 'DIGIT');
        this.setInputsInline(true);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns if the last amount of digits are the same or equal to the selected digit'));
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
Blockly.JavaScript.are_the_last_digits_the_same = block => {
    const amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC) || '3';
    const digit = block.getFieldValue('DIGIT');
    return [`Bot.areTheLastDigitsTheSame({amount: ${amount}, digit: '${digit}'})`, Blockly.JavaScript.ORDER_ATOMIC];
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/digits/are_the_last_digits_the_same.js
// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
// import { mainScope } from '../../relationChecker';
import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.digitpercentage = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Get digits percentage of the digit'));
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['0', '0'],
                ['1', '1'],
                ['2', '2'],
                ['3', '3'],
                ['4', '4'],
                ['5', '5'],
                ['6', '6'],
                ['7', '7'],
                ['8', '8'],
                ['9', '9']
            ]), 'DIGIT');
        this.appendValueInput('AMOUNT').setCheck('Number').appendField(translate('in the last'));
        this.appendDummyInput().appendField(translate('digits'));
        this.setInputsInline(true);
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the percent of the chosen digit in the selected amount of digits'));
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
Blockly.JavaScript.digitpercentage = block => {
    const digit = block.getFieldValue('DIGIT');
    const amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC) || '10';

    return [`Bot.getDigitsPercentage({digit: ${digit}, amount: ${amount}})`, Blockly.JavaScript.ORDER_ATOMIC];
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/digits/digitpercentage.js
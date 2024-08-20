// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#2jo335
// import { mainScope } from '../../relationChecker';
import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.most_frequent_digit = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Most frequent digit in the last'));
        this.appendValueInput('AMOUNT').setCheck('Number');
        this.setOutput(true, 'Number');
        this.appendDummyInput().appendField(translate('digits'));
        this.setInputsInline(true);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the most frequent digit in the chosen amount of the last digits'));
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
Blockly.JavaScript.most_frequent_digit = block => {
    const amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    return [`Bot.getMostFrequentDigit({amount: ${amount}})`, Blockly.JavaScript.ORDER_ATOMIC];
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/digits/most_frequent_digit.js
import {
    translate
} from '../../../../i18n';
import theme from '../../../theme';

Blockly.Blocks.last_n_ticks_same = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Are the latest'))
        this.appendValueInput('AMOUNT').setCheck('Number');
        this.setOutput(true, 'Boolean');
        this.appendDummyInput().appendField(translate('ticks in the same direction'));
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('True if the latest ticks are in the same direction'));
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
                a.children[1].style.fill = theme.blockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyEditableText') {
                a.children[0].style.fill = theme.underBlockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyDraggable') {
                a.children[1].style.fill = theme.subBlockColor;
            }
        }
    },
};

Blockly.JavaScript.last_n_ticks_same = block => {
    const amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC) || '2';
    return [`Bot.latestTicksSameDirection({ amount: ${amount} })`, Blockly.JavaScript.ORDER_ATOMIC];
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/patterns/last_n_ticks_same.js
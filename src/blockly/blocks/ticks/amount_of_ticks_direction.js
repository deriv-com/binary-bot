import {
    translate
} from '../../../i18n';
import {
    mainScope
} from '../../relationChecker';
import config from '../../../botPage/common/const';
import theme from '../../theme';

Blockly.Blocks.amount_of_ticks_direction = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Amount of ticks in direction'))
        this.appendDummyInput().appendField(new Blockly.FieldDropdown(config.lists.CHECK_DIRECTION.slice(0, 2)), 'CHECK_DIRECTION')
        this.appendDummyInput().appendField(translate('in the last'))
        this.appendValueInput('AMOUNT').setCheck('Number');
        this.appendDummyInput().appendField(translate('ticks'))
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the amount of ticks in the selected direction in the selected amount of ticks'));
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
Blockly.JavaScript.amount_of_ticks_direction = block => {
    const checkWith = block.getFieldValue('CHECK_DIRECTION');
    const amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    return [`Bot.amountOfTicksDirection({direction: '${checkWith}', amount:${amount} })`, Blockly.JavaScript.ORDER_ATOMIC];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/ticks/amount_of_ticks_direction.js
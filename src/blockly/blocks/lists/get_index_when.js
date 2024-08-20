import {
    translate
} from '../../../i18n';
import theme from '../../theme';
import {
    expectValue
} from '../shared';

Blockly.Blocks.get_index_when = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Get the index when a value from'))
        this.appendValueInput('INPUT').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT);
        this.appendDummyInput().appendField(translate('is'));
        this.appendDummyInput().appendField(new Blockly.FieldDropdown([
            ['=', 'eq'],
            ['≠', 'ne'],
            ['>', 'gt'],
            ['<', 'lt'],
            ['‏≥', 'gte'],
            ['‏≤', 'lte']
        ]), 'CONDITION');
        this.appendDummyInput().appendField(translate('to'));
        this.appendValueInput('VALUE').setCheck('Number');
        this.setOutput(true, 'Number');
        this.setInputsInline(true);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Return the index of the value that meets the condition. It will return -1 if it doesn\'t finds any, with 1 being the most recent index'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        });
        for (let index = 0; index < this.svgGroup_.children.length; index++) {
            const a = this.svgGroup_.children[index];
            if (a.tagName === 'g' && a.classList.length === 0) {
                a.children[3].children[0].style.fill = theme.indicatorColorAccent;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyEditableText') {
                a.children[0].style.fill = theme.underBlockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyDraggable') {
                a.children[1].style.fill = theme.subBlockColor;
            }
        }
    },
};
Blockly.JavaScript.get_index_when = block => {
    const input = expectValue(block, 'INPUT');
    const condition = block.getFieldValue('CONDITION');
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return [`Bot.getIndexWhen({values: ${input}, condition: '${condition}', value: ${value}})`, Blockly.JavaScript.ORDER_ATOMIC];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/lists/get_index_when.js
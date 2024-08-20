// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3qghes
import {
    translate
} from '../../../../i18n';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

Blockly.Blocks.cross = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Cross'))
            .appendField(new Blockly.FieldDropdown([
                [translate('Over'), 'over'],
                [translate('Under'), 'under'],
                [translate('Any'), 'any']
            ]), 'CROSSTYPE');
        this.appendValueInput('INPUT1').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT).appendField(translate('Input List 1'));
        this.appendValueInput('INPUT2').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT).appendField(translate('Input List 2'));
        this.appendValueInput('INDEX').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(translate('Index'));
        this.setOutput(true, 'Boolean');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Check if the Source List 1 crossed under/over Source List 2. Using index 1 will check the most recent value of each list'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
            return a;
        });
        for (let index = 0; index < this.svgGroup_.children.length; index++) {
            const a = this.svgGroup_.children[index];
            if (a.tagName === 'g' && (a.classList.length === 0)) {
                a.children[3].children[0].style.fill = theme.indicatorColorAccent;
                a.children[1].style.fill = theme.blockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyEditableText') {
                a.children[0].style.fill = theme.subBlockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyDraggable') {
                a.children[1].style.fill = theme.subBlockColor;
            }
        }
    },
};

Blockly.JavaScript.cross = block => {
    const index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '1';
    const input1 = expectValue(block, 'INPUT1');
    const input2 = expectValue(block, 'INPUT2');
    const type = block.getFieldValue('CROSSTYPE');
    return [`Bot.checkCross({ index:${index}, input1:${input1}, input2:${input2}, type:"${type}"})`, Blockly.JavaScript.ORDER_NONE];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/helpers/cross.js
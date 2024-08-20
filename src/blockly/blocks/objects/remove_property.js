import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.remove_property = {
    init: function init() {
        this.appendDummyInput().appendField(translate('In the object'));
        this.appendValueInput('VAR').setCheck('Object');
        this.appendDummyInput().appendField(translate('remove the property'))
        this.appendValueInput('PROPERTY').setCheck('String');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(true);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Remove the property of an object'));
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
Blockly.JavaScript.remove_property = block => {
    const key = Blockly.JavaScript.valueToCode(block, 'PROPERTY', Blockly.JavaScript.ORDER_ATOMIC) || 'new_key';
    const object = Blockly.JavaScript.valueToCode(block, 'VAR', Blockly.JavaScript.ORDER_ATOMIC) || 'new_object';
    return `delete ${object}[${key}];`;
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/objects/remove_property.js
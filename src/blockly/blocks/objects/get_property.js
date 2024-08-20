import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.get_property = {
    init: function init() {
        this.appendDummyInput().appendField(translate('In the object'));
        this.appendValueInput('VAR');
        this.appendDummyInput().appendField(translate('get the value of'));
        this.appendValueInput('PROPERTY');
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Get a property from an object'));
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

Blockly.JavaScript.get_property = block => {
    const property = Blockly.JavaScript.valueToCode(block, 'PROPERTY', Blockly.JavaScript.ORDER_ATOMIC) || 'prop';
    const object = Blockly.JavaScript.valueToCode(block, 'VAR', Blockly.JavaScript.ORDER_ATOMIC) || 'new_object';
    const code = `${object}[${property}]`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
}




// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/objects/get_property.js
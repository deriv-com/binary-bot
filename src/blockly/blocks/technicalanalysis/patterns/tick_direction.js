import {
    translate
} from '../../../../i18n';
import theme from '../../../theme';
import config from '../../../../botPage/common/const';
import candleInterval from '../../ticks/candleInterval';

Blockly.Blocks.tick_direction = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Tick Direction is'))
            .appendField(new Blockly.FieldDropdown(config.tickDirection), 'DIRECTION')
        this.appendValueInput('INDEX').setCheck('Number').appendField(translate('Index'));
        candleInterval(this);
        this.setOutput(true, 'Boolean');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('True if the tick is in the desired direction at the chosen index'));
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

Blockly.JavaScript.tick_direction = block => [`Bot.tickDirection({ direction: '${block.getFieldValue('DIRECTION')}', index: ${Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '1'} })`, Blockly.JavaScript.ORDER_ATOMIC];


// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/patterns/tick_direction.js
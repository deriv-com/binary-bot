// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3qghes
import {
    translate
} from '../../../../i18n';
import config from '../../../../botPage/common/const';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

Blockly.Blocks.bb = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Bollinger Bands (BB)'))
            .appendField(new Blockly.FieldDropdown(config.bbResult), 'BBRESULT_LIST')
            .appendField(new Blockly.FieldDropdown(config.returnList), 'RETURNBB');
        this.appendValueInput('INPUT').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Input List')  }:`);
        this.appendValueInput('PERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Period')  }:`);
        this.appendValueInput('MULTIPLIER').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Std. Dev. Multiplier')  }:`);
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Calculates Bollinger Bands (BB) from a list with a period'));
        if (this.isInFlyout) {
            this.setInputsInline(true);
        } else {
            this.setInputsInline(false);
        }
    },
    onchange: function onchange(block) {
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
        this.setOutput(true, this.getFieldValue('RETURNBB') === 'latest' ? 'Number' : 'Array');
    },
};

Blockly.JavaScript.bb = block => {
    const bbResult = block.getFieldValue('BBRESULT_LIST') || 'upper';
    const values = expectValue(block, 'INPUT');
    const period = Blockly.JavaScript.valueToCode(block, 'PERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '20';
    const stdDev = Blockly.JavaScript.valueToCode(block, 'MULTIPLIER', Blockly.JavaScript.ORDER_ATOMIC) || '2';
    const returnType = block.getFieldValue('RETURNBB');
    return [`Bot.bb({values: ${values}, period: ${period}, stdDev: ${stdDev}}, '${bbResult}', '${returnType}')`, Blockly.JavaScript.ORDER_NONE];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/indicators/bb.js
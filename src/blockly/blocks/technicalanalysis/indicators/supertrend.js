// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3qghes
import {
    translate
} from '../../../../i18n';
import config from '../../../../botPage/common/const';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

Blockly.Blocks.supertrend = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Supertrend'))
            .appendField(new Blockly.FieldDropdown(config.supertrendFields), 'SUPERTRENDFIELDS_LIST')
            .appendField(new Blockly.FieldDropdown(config.returnList), 'RETURNSUPERTREND');
        this.appendValueInput('INPUT').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Candle List')  }:`);
        this.appendValueInput('PERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Period')  }:`);
        this.appendValueInput('FACTOR').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Factor')  }:`);
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Calculates the Supertrend from a list of candles with a period'));
        if (this.isInFlyout) {
            this.setInputsInline(true);
        } else {
            this.setInputsInline(false);
        }
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.indicatorsColor;
            a.svgPathDark_.style.display = 'none';
        })
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
        this.setOutput(true, this.getFieldValue('RETURNSUPERTREND') === 'latest' ? 'Number' : 'Array');
    },
};

Blockly.JavaScript.supertrend = block => {
    const field = block.getFieldValue('SUPERTRENDFIELDS_LIST');
    const input = expectValue(block, 'INPUT');
    const period = Blockly.JavaScript.valueToCode(block, 'PERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    const factor = Blockly.JavaScript.valueToCode(block, 'FACTOR', Blockly.JavaScript.ORDER_ATOMIC) || '3';
    const returnType = block.getFieldValue('RETURNSUPERTREND');
    return [`Bot.supertrend({ period: ${period}, factor: ${factor}}, ${input}, '${field}', '${returnType}')`, Blockly.JavaScript.ORDER_NONE];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/indicators/supertrend.js
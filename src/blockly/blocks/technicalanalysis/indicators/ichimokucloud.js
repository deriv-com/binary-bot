// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3qghes
import {
    translate
} from '../../../../i18n';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';
import config from '../../../../botPage/common/const';

const mod = 'ichimokucloud';
Blockly.Blocks[mod] = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Ichimoku Cloud'))
            .appendField(new Blockly.FieldDropdown([
                [translate('Conversion'), 'conversion'],
                [translate('Base'), 'base'],
                [translate('Span A'), 'spanA'],
                [translate('Span B'), 'spanB']
            ]), `${mod.toUpperCase()}_LIST`)
            .appendField(new Blockly.FieldDropdown(config.returnList), `RETURN${  mod.toUpperCase()}`);
        this.appendValueInput('INPUT').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Candle List')  }:`);
        this.appendValueInput('CONVERSIONPERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Conversion Period')  }:`);
        this.appendValueInput('BASEPERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Base Period')  }:`);
        this.appendValueInput('SPANPERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Span Period')  }:`);
        this.appendValueInput('DISPLACEMENT').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Displacement')  }:`);
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Calculates the Ichimoku Cloud from a list of candles with some periods'));
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
            return true;
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
        this.setOutput(true, this.getFieldValue(`RETURN${  mod.toUpperCase()}`) === 'latest' ? 'Number' : 'Array');
    },
};

Blockly.JavaScript[mod] = block => {
    const input = expectValue(block, 'INPUT');
    const field = block.getFieldValue('ICHIMOKUCLOUD_LIST');
    const conversionPeriod = Blockly.JavaScript.valueToCode(block, 'CONVERSIONPERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '9';
    const basePeriod = Blockly.JavaScript.valueToCode(block, 'BASEPERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '26';
    const spanPeriod = Blockly.JavaScript.valueToCode(block, 'SPANPERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '52';
    const displacement = Blockly.JavaScript.valueToCode(block, 'DISPLACEMENT', Blockly.JavaScript.ORDER_ATOMIC) || '26';
    const returnType = block.getFieldValue(`RETURN${mod.toUpperCase()}`);
    return [`Bot.${mod}({conversionPeriod: ${conversionPeriod},basePeriod: ${basePeriod},spanPeriod: ${spanPeriod},spanPeriod:${displacement}},${input},'${field}', '${returnType}')`, Blockly.JavaScript.ORDER_NONE];
};


// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/indicators/ichimokucloud.js
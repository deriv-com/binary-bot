// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3qghes
import {
    translate
} from '../../../../i18n';
import config from '../../../../botPage/common/const';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

const mod = 'stochasticrsi';

Blockly.Blocks[mod] = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Stochastic RSI (StochasticRSI)'))
            .appendField(new Blockly.FieldDropdown(config.stochFields), 'STOCHASTICFIELDS_LIST')
            .appendField(new Blockly.FieldDropdown(config.returnList), `RETURN${mod.toUpperCase()}`);
        this.appendValueInput('INPUT').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Input List')  }:`);
        this.appendValueInput('RSIPERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('RSI Period')  }:`);
        this.appendValueInput('STOCHPERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Stochastic Period')  }:`);
        this.appendValueInput('KPERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('K Period')  }:`);
        this.appendValueInput('DPERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('D Period')  }:`);
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Calculates the Stochastic RSI (StochasticRSI) from a list with a period and a signal period'));
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
        this.setOutput(true, this.getFieldValue(`RETURN${  mod.toUpperCase()}`) === 'latest' ? 'Number' : 'Array');
    },
};

Blockly.JavaScript[mod] = block => {
    const field = block.getFieldValue('STOCHASTICFIELDS_LIST');
    const values = expectValue(block, 'INPUT');
    const rsiPeriod = Blockly.JavaScript.valueToCode(block, 'RSIPERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '14';
    const stochasticPeriod = Blockly.JavaScript.valueToCode(block, 'STOCHPERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '14';
    const kPeriod = Blockly.JavaScript.valueToCode(block, 'KPERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '3';
    const dPeriod = Blockly.JavaScript.valueToCode(block, 'DPERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '3';
    const returnType = block.getFieldValue(`RETURN${mod.toUpperCase()}`);
    return [`Bot.${mod}({values:${values}, rsiPeriod:${rsiPeriod}, stochasticPeriod:${stochasticPeriod}, kPeriod:${kPeriod}, dPeriod:${dPeriod}}, '${field}', '${returnType}')`, Blockly.JavaScript.ORDER_NONE];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/indicators/stochasticrsi.js
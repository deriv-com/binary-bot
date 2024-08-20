// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3qghes
import {
    translate
} from '../../../../i18n';
import config from '../../../../botPage/common/const';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

const mod = 'stochastic';

Blockly.Blocks[mod] = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Stochastic (Stoch)'))
            .appendField(new Blockly.FieldDropdown(config.stochFields), 'STOCHASTICFIELDS_LIST')
            .appendField(new Blockly.FieldDropdown(config.returnList), `RETURN${mod.toUpperCase()}`);
        this.appendValueInput('INPUT').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Candle List')  }:`);
        this.appendValueInput('PERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Period')  }:`);
        this.appendValueInput('PERIODSIGNAL').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Signal Period')  }:`);
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Calculates the Stochastic (Stoch) from a list of candles with a period and a signal period'));
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
    const input = expectValue(block, 'INPUT');
    const period = Blockly.JavaScript.valueToCode(block, 'PERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '14';
    const signalPeriod = Blockly.JavaScript.valueToCode(block, 'SIGNALPERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '3';
    const returnType = block.getFieldValue(`RETURN${mod.toUpperCase()}`);
    return [`Bot.${mod}({period:${period}, signalPeriod:${signalPeriod}}, ${input}, '${field}', '${returnType}')`, Blockly.JavaScript.ORDER_NONE];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/indicators/stochastic.js
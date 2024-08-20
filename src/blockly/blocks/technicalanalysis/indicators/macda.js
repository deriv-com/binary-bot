// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3qghes
import {
    translate
} from '../../../../i18n';
import config from '../../../../botPage/common/const';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

Blockly.Blocks.macda = {
    init: function init() {
        this.appendDummyInput().appendField(translate('MACD')).appendField(new Blockly.FieldDropdown(config.macdFields), 'MACDFIELDS_LIST').appendField(new Blockly.FieldDropdown(config.returnList), 'RETURNMACD');
        this.appendValueInput('INPUT').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Input List')  }:`);
        this.appendValueInput('FAST_EMA_PERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Fast MA Period')  }:`);
        this.appendValueInput('SLOW_EMA_PERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Slow MA Period')  }:`);
        this.appendValueInput('SIGNAL_EMA_PERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Signal MA Period')  }:`);
        this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Use SMA for Oscillator')}`).appendField(new Blockly.FieldCheckbox('false'), 'SIMPLE_MA_OSCILLATOR');
        this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Use SMA for Signal')}`).appendField(new Blockly.FieldCheckbox('false'), 'SIMPLE_MA_SIGNAL');
        this.setOutput(true, 'Array');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Calculates Moving Average Convergence Divergence (MACD) list from a list'));
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
            if (a.tagName === 'g' && (a.classList.length === 0)) {
                a.children[3].children[0].style.fill = theme.indicatorColorAccent;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyEditableText') {
                a.children[0].style.fill = theme.underBlockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyDraggable') {
                a.children[1].style.fill = theme.subBlockColor;
            }
        }
        this.setOutput(true, this.getFieldValue('RETURNMACD') === 'latest' ? 'Number' : 'Array');
    },
};

Blockly.JavaScript.macda = block => {
    const macdField = block.getFieldValue('MACDFIELDS_LIST');
    const values = expectValue(block, 'INPUT');
    const fastEmaPeriod = Blockly.JavaScript.valueToCode(block, 'FAST_EMA_PERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '12';
    const slowEmaPeriod = Blockly.JavaScript.valueToCode(block, 'SLOW_EMA_PERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '26';
    const signalEmaPeriod = Blockly.JavaScript.valueToCode(block, 'SIGNAL_EMA_PERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '9';
    const SimpleMAOscillator = Blockly.JavaScript.valueToCode(block, 'SIMPLE_MA_OSCILLATOR', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    const SimpleMASignal = Blockly.JavaScript.valueToCode(block, 'SIMPLE_MA_SIGNAL', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    const returnType = block.getFieldValue('RETURNMACD');
    return [`Bot.macd({values:${values},fastPeriod:${fastEmaPeriod},slowPeriod:${slowEmaPeriod},signalPeriod:${signalEmaPeriod},SimpleMAOscillator:${SimpleMAOscillator},SimpleMASignal:${SimpleMASignal}},'${macdField}','${returnType}')`, Blockly.JavaScript.ORDER_NONE];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/indicators/macda.js
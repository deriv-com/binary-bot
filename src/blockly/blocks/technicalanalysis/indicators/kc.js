// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3qghes
import {
    translate
} from '../../../../i18n';
import config from '../../../../botPage/common/const';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

Blockly.Blocks.kc = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Keltner Channels (KC)')).appendField(new Blockly.FieldDropdown(config.bbResult), 'BBRESULT_LIST').appendField(new Blockly.FieldDropdown(config.returnList), 'RETURNKC');
        this.appendValueInput('INPUT').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Input Candles')  }:`);
        this.appendValueInput('ATRPERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('ATR Period')  }:`);
        this.appendValueInput('MULTIPLIER').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Multiplier')  }:`);
        this.appendValueInput('MAPERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('MA Period')  }:`);
        this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Use SMA')}`).appendField(new Blockly.FieldCheckbox('false'), 'USESMA');
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Calculates Keltner Channels (KC) from a list of candles with a period'));
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
        this.setOutput(true, this.getFieldValue('RETURNKC') === 'latest' ? 'Number' : 'Array');
    },
};

Blockly.JavaScript.kc = block => {
    const kcResult = block.getFieldValue('BBRESULT_LIST') || 'upper';
    const candles = expectValue(block, 'INPUT');
    const atrPeriod = Blockly.JavaScript.valueToCode(block, 'ATRPERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    const multiplier = Blockly.JavaScript.valueToCode(block, 'MULTIPLIER', Blockly.JavaScript.ORDER_ATOMIC) || '1';
    const maPeriod = Blockly.JavaScript.valueToCode(block, 'MAPERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '20';
    const useSMA = Blockly.JavaScript.valueToCode(block, 'USESMA', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    const returnType = block.getFieldValue('RETURNKC');
    return [`Bot.kc({maPeriod: ${maPeriod}, useSMA: ${useSMA}, multiplier: ${multiplier}, atrPeriod: ${atrPeriod}}, ${candles}, '${kcResult}', '${returnType}')`, Blockly.JavaScript.ORDER_NONE];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/indicators/kc.js
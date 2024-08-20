// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3qghes
import {
    translate
} from '../../../../i18n';
import config from '../../../../botPage/common/const';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

const mod = 'kst';

Blockly.Blocks[mod] = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Know Sure Thing (KST)'))
            .appendField(new Blockly.FieldDropdown(config.kstFields), 'KSTFIELDS_LIST')
            .appendField(new Blockly.FieldDropdown(config.returnList), `RETURN${  mod.toUpperCase()}`);
        this.appendValueInput('INPUT').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Input List')  }:`);
        this.appendValueInput('ROCPERIOD1').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('ROC Period 1')  }:`);
        this.appendValueInput('ROCPERIOD2').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('ROC Period 2')  }:`);
        this.appendValueInput('ROCPERIOD3').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('ROC Period 3')  }:`);
        this.appendValueInput('ROCPERIOD4').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('ROC Period 4')  }:`);
        this.appendValueInput('SMAPERIOD1').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('SMA Period 1')  }:`);
        this.appendValueInput('SMAPERIOD2').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('SMA Period 2')  }:`);
        this.appendValueInput('SMAPERIOD3').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('SMA Period 3')  }:`);
        this.appendValueInput('SMAPERIOD4').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('SMA Period 4')  }:`);
        this.appendValueInput('SIGNALPERIOD').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Signal Period')  }:`);
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Calculates the Know Sure Thing (KST) from an input list with several periods'));
        this.setHelpUrl('https://github.com/binary-com/binary-bot/wiki');
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
    const field = block.getFieldValue('KSTFIELDS_LIST');
    const input = expectValue(block, 'INPUT');
    const rocperiod1 = Blockly.JavaScript.valueToCode(block, 'ROCPERIOD1', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    const rocperiod2 = Blockly.JavaScript.valueToCode(block, 'ROCPERIOD2', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    const rocperiod3 = Blockly.JavaScript.valueToCode(block, 'ROCPERIOD3', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    const rocperiod4 = Blockly.JavaScript.valueToCode(block, 'ROCPERIOD4', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    const smaperiod1 = Blockly.JavaScript.valueToCode(block, 'ROCPERIOD1', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    const smaperiod2 = Blockly.JavaScript.valueToCode(block, 'ROCPERIOD2', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    const smaperiod3 = Blockly.JavaScript.valueToCode(block, 'ROCPERIOD3', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    const smaperiod4 = Blockly.JavaScript.valueToCode(block, 'ROCPERIOD4', Blockly.JavaScript.ORDER_ATOMIC) || '10';
    const signalperiod = Blockly.JavaScript.valueToCode(block, 'SIGNALPERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '10';

    const returnType = block.getFieldValue(`RETURN${mod.toUpperCase()}`);
    return [`Bot.${mod}({values: ${input}, ROCPer1: ${rocperiod1}, ROCPer2:${rocperiod2}, ROCPer3:${rocperiod3}, ROCPer4: ${rocperiod4}, SMAROCPer1: ${smaperiod1}, SMAROCPer2: ${smaperiod2}, SMAROCPer3:${smaperiod3}, SMAROCPer4:${smaperiod4}, signalPeriod:${signalperiod}}, '${field}', '${returnType}')`, Blockly.JavaScript.ORDER_NONE];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/indicators/kst.js
import {
    translate
} from '../../../../i18n';
import {
    insideTrade
} from '../../../relationChecker';
import theme from '../../../theme';

Blockly.Blocks.smartmartingale_tradedefinitions = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Smart Martingale Run Once at Start'));
        this.appendValueInput('INITIAL').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Initial Stake')  }:`);
        this.appendValueInput('FACTOR').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Factor')  }:`);
        this.appendValueInput('MAXSTEPS').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Max Steps')  }:`);
        this.appendValueInput('STARTAFTER').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Start Applying Factor After')  }:`);
        this.appendValueInput('RESET').setCheck('Boolean').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('At Max Steps Reset Stake')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('Setup block of the Smart Martingale money management'));
    },
    onchange: function onchange(ev) {
        insideTrade(this, ev, translate('Trade Options'));
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
    },
};
Blockly.JavaScript.smartmartingale_tradedefinitions = block => {
    const initial = Blockly.JavaScript.valueToCode(block, 'INITIAL', Blockly.JavaScript.ORDER_ATOMIC) || '0.35';
    const factor = Blockly.JavaScript.valueToCode(block, 'FACTOR', Blockly.JavaScript.ORDER_ATOMIC) || '2.1';
    const maxsteps = Blockly.JavaScript.valueToCode(block, 'MAXSTEPS', Blockly.JavaScript.ORDER_ATOMIC) || '12';
    const startafter = Blockly.JavaScript.valueToCode(block, 'STARTAFTER', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const reset = Blockly.JavaScript.valueToCode(block, 'RESET', Blockly.JavaScript.ORDER_ATOMIC) || false;
    return `Bot.smartmartingaleTradeDefinitions({initial:${initial}, factor:${factor}, maxSteps:${maxsteps}, startAfter:${startafter}, reset:${reset}});`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/smartmartingale/tradedefinitions.js
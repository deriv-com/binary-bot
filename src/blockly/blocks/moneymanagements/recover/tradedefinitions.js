import {
    translate
} from '../../../../i18n';
import {
    insideTrade
} from '../../../relationChecker';
import theme from '../../../theme';

Blockly.Blocks.recover_tradedefinitions = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Recover Run Once at Start'));
        this.appendValueInput('INITIAL').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Initial Stake')  }:`);
        this.appendValueInput('PROFIT').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Add % Profitto Calculation')  }:`);
        this.appendValueInput('STARTAFTER').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Start Applying After')  }:`);
        this.appendValueInput('MAXSTEPS').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Max Steps')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('Setup block of the Recover money management'));
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
Blockly.JavaScript.recover_tradedefinitions = block => {
    const initial = Blockly.JavaScript.valueToCode(block, 'INITIAL', Blockly.JavaScript.ORDER_ATOMIC) || '0.35';
    const profit = Blockly.JavaScript.valueToCode(block, 'PROFIT', Blockly.JavaScript.ORDER_ATOMIC) || '1';
    const startafter = Blockly.JavaScript.valueToCode(block, 'STARTAFTER', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const maxsteps = Blockly.JavaScript.valueToCode(block, 'MAXSTEPS', Blockly.JavaScript.ORDER_ATOMIC) || '20';
    return `Bot.recoverTradeDefinitions({initial: ${initial}, profit:${profit}, startAfter:${startafter}, maxSteps:${maxsteps}});`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/recover/tradedefinitions.js
import {
    translate
} from '../../../../i18n';
import {
    insideTrade
} from '../../../relationChecker';
import theme from '../../../theme';

Blockly.Blocks.profitcompound_tradedefinitions = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Profit Compound Run Once at Start'));
        this.appendValueInput('INITIAL').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Initial Stake')  }:`);
        this.appendValueInput('PERCENTAGE').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Percentage of the profit to be applied')  }:`);
        this.appendValueInput('MAXSTEPS').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Max times applying profit before reset')  }:`);
        this.appendValueInput('RESTART').setCheck('Boolean').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Reset the applied profit count on loss')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('Setup block of the Profit Compound money management'));
    },
    onchange: function onchange(ev) {
        insideTrade(this, ev, translate('Trade Options'));
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.indicatorsColor;
            a.svgPathDark_.style.display = 'none';
        });
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
Blockly.JavaScript.profitcompound_tradedefinitions = block => {
    const initial = Blockly.JavaScript.valueToCode(block, 'INITIAL', Blockly.JavaScript.ORDER_ATOMIC) || '0.35';
    const percentage = Blockly.JavaScript.valueToCode(block, 'PERCENTAGE', Blockly.JavaScript.ORDER_ATOMIC) || '100';
    const maxsteps = Blockly.JavaScript.valueToCode(block, 'MAXSTEPS', Blockly.JavaScript.ORDER_ATOMIC) || '5';
    const restart = Blockly.JavaScript.valueToCode(block, 'RESTART', Blockly.JavaScript.ORDER_ATOMIC) || 'true';
    return `Bot.profitCompoundTradeDefinitions({initial:${initial}, percentage:${percentage}, maxSteps:${maxsteps}, restartOnLoss:${restart}});`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/profitcompound/tradedefinitions.js
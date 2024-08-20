import {
    translate
} from '../../../../i18n';
import {
    insideTrade
} from '../../../relationChecker';
import theme from '../../../theme';

Blockly.Blocks.masaniello_tradedefinitions = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Masaniello Run Once at Start'));
        this.appendValueInput('STAKE').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Initial Stake')  }:`);
        this.appendValueInput('TRADES').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Max Number of Trades')  }:`);
        this.appendValueInput('BALANCE').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Initial Balance')  }:`);
        this.appendValueInput('PAYOUT').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Payout Percentage')  }:`);
        this.appendValueInput('WINRATE').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Target Winrate %')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('Setup block of the Masaniello money management'));
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
Blockly.JavaScript.masaniello_tradedefinitions = block => {
    const factor = Blockly.JavaScript.valueToCode(block, 'TRADES', Blockly.JavaScript.ORDER_ATOMIC) || '30';
    const stake = Blockly.JavaScript.valueToCode(block, 'STAKE', Blockly.JavaScript.ORDER_ATOMIC) || '0.35';
    const balance = Blockly.JavaScript.valueToCode(block, 'BALANCE', Blockly.JavaScript.ORDER_ATOMIC) || '100';
    const winrate = Blockly.JavaScript.valueToCode(block, 'WINRATE', Blockly.JavaScript.ORDER_ATOMIC) || '100';
    const payout = (Blockly.JavaScript.valueToCode(block, 'PAYOUT', Blockly.JavaScript.ORDER_ATOMIC) / 100);
    return `Bot.masanielloTradeDefinitions({stake: ${stake}, maxTrades:${factor}, initialBalance: ${balance}, payout: ${payout}, winrate: ${winrate}})`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/masaniello/tradedefinitions.js
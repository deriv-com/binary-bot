import {
    translate
} from '../../../i18n';
import {
    insideTrade
} from '../../relationChecker';
import theme from '../../theme';

Blockly.Blocks.risk_tradedefinitions = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Risk Management Run Once at Start'));
        this.appendValueInput('TAKEPROFIT').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Take Profit')  }:`);
        this.appendValueInput('STOPLOSS').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Stop Loss')  }:`);
        this.appendValueInput('MAXSTEPS').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Max Losses In a Row')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        // this.setInputsInline(true);
        this.setTooltip(translate('Setup block of the risk management'));
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
Blockly.JavaScript.risk_tradedefinitions = block => {
    const takeprofit = Blockly.JavaScript.valueToCode(block, 'TAKEPROFIT', Blockly.JavaScript.ORDER_ATOMIC) || '3';
    const stoploss = Blockly.JavaScript.valueToCode(block, 'STOPLOSS', Blockly.JavaScript.ORDER_ATOMIC) || '50';
    const maxsteps = Blockly.JavaScript.valueToCode(block, 'MAXSTEPS', Blockly.JavaScript.ORDER_ATOMIC) || '12';
    return `Bot.riskTradeDefinitions({takeprofit:${takeprofit}, stoploss:${stoploss}, maxsteps:${maxsteps}});`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/riskmanagement/tradedefinitions.js
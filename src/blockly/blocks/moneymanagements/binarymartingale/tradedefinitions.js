import {
    translate
} from '../../../../i18n';
import {
    insideTrade
} from '../../../relationChecker';
import theme from '../../../theme';

Blockly.Blocks.binarymartingale_tradedefinitions = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Binary Martingale Run Once at Start'));
        this.appendValueInput('INITIAL').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Initial Stake')  }:`);
        this.appendValueInput('FACTOR').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Factor')  }:`);
        this.appendValueInput('USECUMULATIVE').setCheck('Boolean').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Use Cumulative')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('Setup block of the Binary Martingale money management'));
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
Blockly.JavaScript.binarymartingale_tradedefinitions = block => {
    const initial = Blockly.JavaScript.valueToCode(block, 'INITIAL', Blockly.JavaScript.ORDER_ATOMIC) || '0.35';
    const factor = Blockly.JavaScript.valueToCode(block, 'FACTOR', Blockly.JavaScript.ORDER_ATOMIC) || '2.1';
    const useCumulative = Blockly.JavaScript.valueToCode(block, 'USECUMULATIVE', Blockly.JavaScript.ORDER_ATOMIC) || false;
    return `Bot.binarymartingaleTradeDefinitions({initial:${initial}, factor:${factor}, useCumulative:${useCumulative}});`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/binarymartingale/tradedefinitions.js
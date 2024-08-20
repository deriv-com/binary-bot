import {
    translate
} from '../../../../i18n';
import {
    insideTrade
} from '../../../relationChecker';
import theme from '../../../theme';

Blockly.Blocks.stake_list_tradedefinitions = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Stake List Run Once at Start'));
        this.appendValueInput('FACTORS').setCheck('Array').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Stake List')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('Setup block of the Stake List money management'));
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
Blockly.JavaScript.stake_list_tradedefinitions = block => {
    const factors = Blockly.JavaScript.valueToCode(block, 'FACTORS', Blockly.JavaScript.ORDER_ATOMIC) || ['1', '2', '3', '4'];
    return `
Bot.stakeListTradeDefinitions({factors:${factors}});`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/stakelist/tradedefinitions.js
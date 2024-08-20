import {
    translate
} from '../../../../i18n';
import {
    insideTrade
} from '../../../relationChecker';
import theme from '../../../theme';

Blockly.Blocks.compound_tradedefinitions = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Compound Run Once at Start'));
        this.appendValueInput('BASE').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Base Balance')  }:`);
        this.appendValueInput('PERCENTAGE').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Percentage')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('Setup block of the Compound money management'));
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
Blockly.JavaScript.compound_tradedefinitions = block => {
    const base = Blockly.JavaScript.valueToCode(block, 'BASE', Blockly.JavaScript.ORDER_ATOMIC) || '0.35';
    const percentage = Blockly.JavaScript.valueToCode(block, 'PERCENTAGE', Blockly.JavaScript.ORDER_ATOMIC) || '2.1';
    return `Bot.compoundTradeDefinitions({base:${base}, percentage:${percentage}});`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/compound/tradedefinitions.js
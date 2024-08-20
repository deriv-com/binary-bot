import {
    translate
} from '../../../i18n';
import {
    insideAfterPurchase
} from '../../relationChecker';
import {
    expectValue
} from '../shared';
import theme from '../../theme';

Blockly.Blocks.risk_afterpurchase = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Risk Management After Purchase'));
        this.appendValueInput('PROFIT').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Contract Profit')  }:`);
        this.setColour(theme.subBlockColor);
        this.setOutput(true, 'Boolean');
        this.setTooltip(translate('After Purchase block of the risk management'));
    },
    onchange: function onchange(ev) {
        insideAfterPurchase(this, ev, 'Risk Management After Purchase');
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.indicatorsColor;
            a.svgPathDark_.style.display = 'none';
        })
        for (let index = 0; index < this.svgGroup_.children.length; index++) {
            const a = this.svgGroup_.children[index];
            if (a.tagName === 'g' && a.classList.length === 0) {
                a.children[1].style.fill = theme.blockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyDraggable') {
                a.children[1].style.fill = theme.subBlockColor;
            }
        }
    },
};
Blockly.JavaScript.risk_afterpurchase = block => {
    const result = expectValue(block, 'PROFIT');
    return [`Bot.riskAfterPurchase(${result})`, Blockly.JavaScript.ORDER_ATOMIC];
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/riskmanagement/afterpurchase.js
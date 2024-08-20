import {
    translate
} from '../../../../i18n';
import {
    insideAfterPurchase
} from '../../../relationChecker';
import {
    expectValue
} from '../../shared';
import theme from '../../../theme';

Blockly.Blocks.compound_afterpurchase = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Compound After Purchase'));
        this.appendValueInput('PROFIT').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Contract Profit')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('After Purchase block of the Compound money management'));
    },
    onchange: function onchange(ev) {
        insideAfterPurchase(this, ev, 'Compound After Purchase');
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
Blockly.JavaScript.compound_afterpurchase = block => {
    const profit = expectValue(block, 'PROFIT');
    return `Bot.compoundAfterPurchase(${profit});`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/compound/afterpurchase.js
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

Blockly.Blocks.binarymartingale_afterpurchase = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Binary Martingale After Purchase'));
        this.appendValueInput('RESULT').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Contract Result')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('After Purchase block of the Binary Martingale money management'));
    },
    onchange: function onchange(ev) {
        insideAfterPurchase(this, ev, 'Binary Martingale After Purchase');
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
Blockly.JavaScript.binarymartingale_afterpurchase = block => {
    const result = expectValue(block, 'RESULT');
    return `Bot.binarymartingaleAfterPurchase(${result});`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/binarymartingale/afterpurchase.js
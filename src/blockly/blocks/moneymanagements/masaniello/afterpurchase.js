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

Blockly.Blocks.masaniello_afterpurchase = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Masaniello After Purchase'));
        this.appendValueInput('RESULT').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('All Contract Details')  }:`);
        this.setColour(theme.subBlockColor);
        this.setOutput(true, 'Boolean');
        this.setTooltip(translate('After Purchase block of the Masaniello money management'));
    },
    onchange: function onchange(ev) {
        insideAfterPurchase(this, ev, 'Masaniello After Purchase');
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
Blockly.JavaScript.masaniello_afterpurchase = block => {
    const result = expectValue(block, 'RESULT');
    return [`Bot.masanielloAfterPurchase(${result})`, Blockly.JavaScript.ORDER_ATOMIC];
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/masaniello/afterpurchase.js
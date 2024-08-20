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

Blockly.Blocks.oscarsgrind_afterpurchase = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Oscar\'s Grind After Purchase'));
        this.appendValueInput('DETAILS').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('All Contract Details')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('After Purchase block of the Oscar\'s Grind money management'));
    },
    onchange: function onchange(ev) {
        insideAfterPurchase(this, ev, 'Oscar\'s Grind After Purchase');
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

Blockly.JavaScript.oscarsgrind_afterpurchase = block => {
    const details = expectValue(block, 'DETAILS');
    return `Bot.oscarsgrindAfterPurchase(${details});`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/oscarsgrind/afterpurchase.js
import {
    translate
} from '../../../../i18n';
import {
    insideTrade
} from '../../../relationChecker';
import theme from '../../../theme';

Blockly.Blocks.oscarsgrind_tradedefinitions = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Oscar\'s Grind Run Once at Start'));
        this.appendValueInput('WAGER').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Wager')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('Setup block of the Oscar\'s Grind money management'));
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

Blockly.JavaScript.oscarsgrind_tradedefinitions = block => {
    const wager = Blockly.JavaScript.valueToCode(block, 'WAGER', Blockly.JavaScript.ORDER_ATOMIC) || '0.35';
    return `Bot.oscarsgrindTradeDefinitions({wager:${wager}});`;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/moneymanagements/oscarsgrind/tradedefinitions.js
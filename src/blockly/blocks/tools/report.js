// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#xkasg4
import {
    translate
} from '../../../i18n';
import {
    expectValue
} from '../shared';
import {
    insideAfterPurchase
} from '../../relationChecker';
import theme from '../../theme';

Blockly.Blocks.report = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Report'));
        this.appendValueInput('PROFIT').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Contract Profit')  }:`);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Show some statistics from the running. Lowest and Highest stake, winning and losing streaks, time running, runs, win rate'));
    },
    onchange: function onchange(ev) {
        insideAfterPurchase(this, ev, 'Report');
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
Blockly.JavaScript.report = block => `Bot.report(${expectValue(block, 'PROFIT')});`;



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/report.js
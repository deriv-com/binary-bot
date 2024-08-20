// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3qghes
import {
    translate
} from '../../../../i18n';
import theme from '../../../theme';

Blockly.Blocks.candle_body = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Candle Body'));
        this.appendValueInput('INDEX').setCheck('Number').appendField(translate('Index'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Calculate the body of the candle'));
        this.setInputsInline(true);
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        });
        for (let index = 0; index < this.svgGroup_.children.length; index++) {
            const a = this.svgGroup_.children[index];
            if (a.tagName === 'g' && (a.classList.length === 0)) {
                a.children[3].children[0].style.fill = theme.indicatorColorAccent;
                a.children[1].style.fill = theme.blockColor;
            }
        }
    },
};

Blockly.JavaScript.candle_body = block => {
    const index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '1';
    return [`Bot.getCandleBody({index:${index}})`, Blockly.JavaScript.ORDER_NONE];
};




// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/helpers/candle_body.js
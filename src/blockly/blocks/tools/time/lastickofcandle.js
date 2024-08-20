// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3bwqd4
import {
    translate
} from '../../../../i18n';
import config from '../../../../botPage/common/const';
import theme from '../../../theme';

Blockly.Blocks.is_last_tick_of_candle = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Are'));
        this.appendValueInput('SECONDS').setCheck('Number');
        this.appendDummyInput()
            .appendField(translate('seconds or less left on the candle'))
            .appendField(new Blockly.FieldDropdown(config.candleIntervals.slice(1)), 'CANDLEINTERVAL_LIST');
        this.setOutput(true, 'Boolean');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns if the actual seconds left of the candle are lower than the input'));
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
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyEditableText') {
                a.children[0].style.fill = theme.underBlockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyDraggable') {
                a.children[1].style.fill = theme.subBlockColor;
            }
        }
    },
};

Blockly.JavaScript.is_last_tick_of_candle = block => {
    const candleIntervalValue = block.getFieldValue('CANDLEINTERVAL_LIST');
    const seconds = Blockly.JavaScript.valueToCode(block, 'SECONDS', Blockly.JavaScript.ORDER_ATOMIC);
    return [`Bot.isLastTickOfCandle(${candleIntervalValue}, ${seconds})`, Blockly.JavaScript.ORDER_ATOMIC];
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/time/lastickofcandle.js
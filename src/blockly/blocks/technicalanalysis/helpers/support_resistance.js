// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3qghes
import {
    translate
} from '../../../../i18n';
import config from '../../../../botPage/common/const';
import theme from '../../../theme';
import candleInterval, {
    getGranularity
} from '../../ticks/candleInterval';

Blockly.Blocks.support_resistance = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Get'))
            .appendField(new Blockly.FieldDropdown(config.srFields), 'SRFIELDS_LIST')
            .appendField(translate('from the last'));
        this.appendValueInput('PERIOD').setCheck('Number');
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(config.sourceFields), 'SOURCEFILEDS_LIST')
            .appendField(translate('starting at'));
        this.appendValueInput('INDEX').setCheck('Number').appendField(translate('Index'));
        candleInterval(this);
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Get support level based on the amount of candles/ticks, the period, and the time interval.'));
        this.setInputsInline(true);
    },
    onchange: function onchange() {
        this.childBlocks_.forEach(block => {
            block.svgPath_.style.fill = theme.shadowDefault;
            block.svgPathDark_.style.display = 'none';
        });

        Array.from(this.svgGroup_.children).forEach(child => {
            if (child.tagName === 'g' && !child.classList.length) {
                child.children[3].children[0].style.fill = theme.indicatorColorAccent;
                child.children[1].style.fill = theme.blockColor;
            }
        });
        // this.childBlocks_.map(a => {a.svgPath_.style.fill = theme.shadowDefault;a.svgPathDark_.style.display = 'none';});
        // for (let index = 0; index < this.svgGroup_.children.length; index++) {
        //     const a = this.svgGroup_.children[index];
        //     if(a.tagName === 'g' && (a.classList.length === 0)) {
        //         a.children[3].children[0].style.fill = theme.indicatorColorAccent;
        //         a.children[1].style.fill = theme.blockColor;
        //     }
        // }
    },
};

Blockly.JavaScript.support_resistance = block => {
    const index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '1';
    const period = Blockly.JavaScript.valueToCode(block, 'PERIOD', Blockly.JavaScript.ORDER_ATOMIC) || '1';
    const field = block.getFieldValue('SRFIELDS_LIST');
    const source = block.getFieldValue('SOURCEFILEDS_LIST');
    const granularity = getGranularity(block);
    return [`Bot.getSupportResistance({index: ${index}, field: '${field}', source: '${source}', period: ${period}, granularity: ${granularity}})`, Blockly.JavaScript.ORDER_NONE];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/helpers/support_resistance.js
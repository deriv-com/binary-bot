import {
    translate
} from '../../../../i18n';
import {
    mainScope
} from '../../../relationChecker';
import theme from '../../../theme';
import candleInterval, {
    getGranularity
} from '../../ticks/candleInterval';

Blockly.Blocks.bearish_fractal = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Is Bearish Fractal'));
        candleInterval(this);
        this.setOutput(true, 'Boolean');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('True if the candle pattern ending in the actual candle is a bearish fractal'));
    },
    onchange: function onchange(ev) {
        this.childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
        });
        mainScope(this, ev, 'Bearish Fractal');
    },
};

Blockly.JavaScript.bearish_fractal = block => [`Bot.isBearishFractal({ granularity: ${getGranularity(block)} })`, Blockly.JavaScript.ORDER_ATOMIC];



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/technicalanalysis/patterns/bearish_fractal.js
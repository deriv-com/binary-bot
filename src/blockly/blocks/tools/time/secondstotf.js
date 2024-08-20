// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3bwqd4
import {
    translate
} from '../../../../i18n';
import config from '../../../../botPage/common/const';
import theme from '../../../theme';

Blockly.Blocks.seconds_to_tf = {
    init: function init() {
        this.appendDummyInput()
            .appendField(translate('Seconds to end'))
            .appendField(new Blockly.FieldDropdown(config.candleIntervals.slice(1)), 'CANDLEINTERVAL_LIST')
            .appendField(translate('candle'));
        this.setOutput(true, 'Number');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Returns the seconds left to reach the end of the candle in the chosen timeframe. Select the seconds duration type. In case the duration is below 15 seconds, it will use 15 seconds instead'));
    },
    onchange,
};
Blockly.JavaScript.seconds_to_tf = block => {
    const candleIntervalValue = block.getFieldValue('CANDLEINTERVAL_LIST');
    return [`Bot.secondsToTf(${candleIntervalValue})`, Blockly.JavaScript.ORDER_ATOMIC];
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/time/secondstotf.js
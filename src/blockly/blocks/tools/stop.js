// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#xkasg4
import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.stop_the_bot = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Stop the bot'));
        this.setPreviousStatement(true, 'StopTheBot');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Stop the bot from running'));
    },
    onchange: function onchange(ev) {},
};
Blockly.JavaScript.stop_the_bot = () => `
Bot.stopTheBot();`;



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/stop.js
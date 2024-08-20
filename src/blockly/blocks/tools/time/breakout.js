// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#pbvgpo
import {
    translate
} from '../../../../i18n';
// import { getPurchaseChoices } from '../shared';
import theme from '../../../theme';

Blockly.Blocks.breakout = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Break out'), 'titleWarn')
        this.setPreviousStatement(true, null);
        this.setColour(theme.warnColor);
        this.setTooltip(translate('Break out of a loop'));
    },
    onchange: function onchange() {
        // insideBeforePurchase(this, ev, 'Purchase');
        Blockly.utils.addClass(this.getField('titleWarn').textElement_, 'title-warn-block');
    },
};
Blockly.JavaScript.breakout = block => {
    const code = 'break;';
    return code;
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/time/breakout.js
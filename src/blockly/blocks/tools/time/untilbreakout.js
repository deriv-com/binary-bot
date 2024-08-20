// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#wupwb4
import {
    translate
} from '../../../../i18n';
import {
    disable
} from '../../../utils';

Blockly.Blocks.untilbreakout = {
    init: function init() {
        this.appendDummyInput().appendField(translate('This block is called on every tick'), 'titleWarn');
        this.appendStatementInput('TICKANALYSIS_STACK').setCheck(null);
        this.appendStatementInput('TIMERSTACK').setCheck(null);
        this.appendValueInput('SECONDS').setCheck(null).appendField(translate('Run Every'));
        this.appendDummyInput().appendField(translate('Second(s)'));
        this.setInputsInline(true);
        this.setColour('#fef1cf');
        this.setTooltip(translate('Run the blocks inside every n seconds'));
    },
    onchange: function onchange() {
        disable(
            this,
            translate('Run every seconds block has been deprecated. Please contact us if you have a valid use case.')
        );
    },
};

Blockly.JavaScript.untilbreakout = () => '';



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/time/untilbreakout.js
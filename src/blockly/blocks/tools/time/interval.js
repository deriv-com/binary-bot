// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#wupwb4
import {
    translate
} from '../../../../i18n';
import theme from '../../../theme';

Blockly.Blocks.interval = {
    init: function init() {
        this.appendDummyInput().appendField(translate('This block will keep looping until breakout'), 'titleWarn');
        this.appendStatementInput('TICKANALYSIS_STACK').setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(theme.warnColor);
        this.setTooltip(translate('Run the blocks inside until it breaks out'));
    },
    onchange: function onchange() {
        Blockly.utils.addClass(this.getField('titleWarn').textElement_, 'title-warn-block');
    },
};

Blockly.JavaScript.interval = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'TICKANALYSIS_STACK');
    return `
        while(true) {
            ${stack}
            sleep(2);
        }
    `
};




// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/time/interval.js
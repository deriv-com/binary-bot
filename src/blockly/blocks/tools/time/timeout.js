// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#wupwb4
import {
    translate
} from '../../../../i18n';
import {
    mainScope
} from '../../../relationChecker';
import theme from '../../../theme';

Blockly.Blocks.timeout = {
    init: function init() {
        this.appendStatementInput('TIMEOUTSTACK').setCheck(null);
        this.appendValueInput('SECONDS').setCheck(null).appendField(translate('Run After'), 'titleWarn');
        this.appendDummyInput().appendField(translate('Second(s)'), 'titleWarn1');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setColour(theme.warnColor);
        this.setTooltip(translate('Run the blocks inside after n seconds'));
    },
    onchange: function onchange(ev) {
        mainScope(this, ev, translate('Run After n Seconds'));
        Blockly.utils.addClass(this.getField('titleWarn').textElement_, 'title-warn-block');
        Blockly.utils.addClass(this.getField('titleWarn1').textElement_, 'title-warn-block');
        this.childBlocks_.map(a => {
            if (a.isShadow_) {
                a.svgPath_.style.fill = theme.underBlockColor;
                a.svgPathDark_.style.display = 'none';
                if (a.type === 'text') {
                    a.svgGroup_.children[4].children[0].style.fill = theme.shadowDefault;
                } else {
                    a.svgGroup_.children[3].children[0].style.fill = theme.shadowDefault;
                }
            }
        });
    },
};

Blockly.JavaScript.timeout = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'TIMEOUTSTACK');
    const seconds = Blockly.JavaScript.valueToCode(block, 'SECONDS', Blockly.JavaScript.ORDER_ATOMIC);

    return `
    sleep(${seconds});
    ${stack}
  `;
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/time/timeout.js
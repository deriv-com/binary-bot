// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#wupwb4
import {
    translate
} from '../../../../i18n';
import theme from '../../../theme';

Blockly.Blocks.sleep = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Sleep until'), 'titleWarn');
        this.appendValueInput('VALIDATION').setCheck('Array');
        this.appendDummyInput().appendField(translate('then call with index'), 'titleWarn1');
        this.appendValueInput('RETURN').setCheck('procedures_callreturn');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(true);
        this.setColour(theme.warnColor);
        this.setTooltip(translate('The bot will wait until one of the conditions is true and then call '));
    },
    onchange: function onchange() {
        Blockly.utils.addClass(this.getField('titleWarn').textElement_, 'title-warn-block');
        Blockly.utils.addClass(this.getField('titleWarn1').textElement_, 'title-warn-block');
        this.childBlocks_.map(a => {
            a.svgPathDark_.style.display = 'none';
            if (a.isShadow_) {
                a.svgPath_.style.fill = theme.underBlockColor;
                if (a.type === 'text') {
                    a.svgGroup_.children[4].children[0].style.fill = theme.shadowDefault;
                } else {
                    a.svgGroup_.children[3].children[0].style.fill = theme.shadowDefault;
                }
            }
        });
    },
};

Blockly.JavaScript.sleep = block => {
    const re = Blockly.JavaScript.valueToCode(block, 'RETURN', Blockly.JavaScript.ORDER_ATOMIC);
    const validation = Blockly.JavaScript.valueToCode(block, 'VALIDATION', Blockly.JavaScript.ORDER_ATOMIC);
    return `
var keepLoop = true;
while(keepLoop) {
    sleep(2);
    //console.log(${validation}.length);
    for(i = 0; i < ${validation}.length; i++) {
        if(${validation}[i]) {
            keepLoop = false;
            ${re.split('(')[1]}(i);
            break; 
        }
    }
}
`
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/time/sleep.js
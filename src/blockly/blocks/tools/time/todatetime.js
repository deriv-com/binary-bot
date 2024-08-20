import {
    translate
} from '../../../../i18n';
import theme from '../../../theme';

Blockly.Blocks.todatetime = {
    init: function init() {
        this.appendDummyInput();
        this.appendValueInput('TIMESTAMP').appendField(translate('To Date/Time'));
        this.setInputsInline(true);
        this.setOutput(true, 'String');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Converts a number of seconds since Epoch into a string representing date and time. Example: 1546347825 will be converted to 2019-01-01 21:03:45.'));
    },
    onchange: function onchange() {
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

Blockly.JavaScript.todatetime = block => {
    const timestamp = Blockly.JavaScript.valueToCode(block, 'TIMESTAMP', Blockly.JavaScript.ORDER_ATOMIC);
    // eslint-disable-next-line no-underscore-dangle
    const functionName = Blockly.JavaScript.provideFunction_('timestampToDateString', [
        // eslint-disable-next-line no-underscore-dangle
        `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(timestamp) {
            return Bot.toDateTime(timestamp);
        }`,
    ]);

    const code = `${functionName}(${timestamp})`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/time/todatetime.js
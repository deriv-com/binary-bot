// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#pmhydb
import {
    translate
} from '../../../i18n';
import config from '../../../botPage/common/const';
import {
    expectValue
} from '../shared';
import theme from '../../theme';

Blockly.Blocks.notify = {
    init: function init() {
        this.appendValueInput('MESSAGE')
            .setCheck(null)
            .appendField(translate('Notify'))
            .appendField(new Blockly.FieldDropdown(config.lists.NOTIFICATION_TYPE), 'NOTIFICATION_TYPE')
            .appendField(`${translate('with sound')}:`)
            .appendField(new Blockly.FieldDropdown(config.lists.NOTIFICATION_SOUND), 'NOTIFICATION_SOUND');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Creates notification'));
    },
    onchange: function onchange() {
        this.childBlocks_.map(a => {
            if (a.isShadow_) {
                a.svgPath_.style.fill = theme.underBlockColor;
                a.svgPathDark_.style.display = 'none';
                a.svgGroup_.children[a.type === 'text' ? 4 : 3].children[0].style.fill = theme.shadowDefault;
            }
        });
    },
};
Blockly.JavaScript.notify = block => {
    const notificationType = block.getFieldValue('NOTIFICATION_TYPE');
    const sound = block.getFieldValue('NOTIFICATION_SOUND');
    const message = expectValue(block, 'MESSAGE');
    const code = `Bot.notify({ className: '${notificationType}', message: ${message}, sound: '${sound}'});
`;
    return code;
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/notify.js
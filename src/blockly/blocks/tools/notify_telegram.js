import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.Blocks.notify_telegram = {
    init() {
        this.jsonInit({
            message0: translate('Notify Telegram %1 Access Token: %2 Chat ID: %3 Message: %4'),
            args0: [{
                    type: 'input_dummy',
                },
                {
                    type: 'input_value',
                    name: 'TELEGRAM_ACCESS_TOKEN',
                },
                {
                    type: 'input_value',
                    name: 'TELEGRAM_CHAT_ID',
                },
                {
                    type: 'input_value',
                    name: 'TELEGRAM_MESSAGE',
                },
            ],
            colour: theme.subBlockColor,
            inputsInline: true,
            previousStatement: null,
            nextStatement: null,
            tooltip: translate('Sends a message to Telegram'),
        });
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

Blockly.JavaScript.notify_telegram = block => {
    const accessToken =
        Blockly.JavaScript.valueToCode(block, 'TELEGRAM_ACCESS_TOKEN', Blockly.JavaScript.ORDER_ATOMIC) || '';
    const chatId = Blockly.JavaScript.valueToCode(block, 'TELEGRAM_CHAT_ID', Blockly.JavaScript.ORDER_ATOMIC) || '';
    const message = Blockly.JavaScript.valueToCode(block, 'TELEGRAM_MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || '';

    if (!accessToken || !chatId || !message) {
        return '';
    }

    const code = `Bot.notifyTelegram(${accessToken}, ${chatId}, ${message});\n`;
    return code;
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/tools/notify_telegram.js
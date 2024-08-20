import { translate } from '../../../common/i18n';
import { insideAfterPurchase } from '../../relationChecker';
import theme from '../../theme';

Blockly.Blocks.trade_again = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Trade Again'));
        this.setPreviousStatement(true, 'TradeAgain');
        this.setColour(theme.subBlockColor);
        this.setTooltip(translate('Runs the trade block again'));
        this.setHelpUrl('https://github.com/binary-com/binary-bot/wiki');
    },
    onchange: function onchange(ev) {
        insideAfterPurchase(this, ev, 'Trade Again');
    },
};
Blockly.JavaScript.trade_again = () => `
if(BinaryBotPrivateVirtualSettings.active && Bot.isVirtualValid()){
    if(BinaryBotPrivateVirtualSettings.ongoing) {
        if ((BinaryBotPrivateVirtualSettings.countOnLoss && Bot.isResultVirtual('win')) || (!BinaryBotPrivateVirtualSettings.countOnLoss && Bot.isResultVirtual('loss')) && BinaryBotPrivateVirtualSettings.reset) {
            BinaryBotPrivateVirtualSettings.steps = 0;
        } else {
            BinaryBotPrivateVirtualSettings.steps += 1;
            if (BinaryBotPrivateVirtualSettings.steps >= BinaryBotPrivateVirtualSettings.maxSteps) {
                BinaryBotPrivateVirtualSettings.steps = 0;
                BinaryBotPrivateVirtualSettings.ongoing = false;
                Bot.setVirtualOngoing(false);
            }
        }
    } else {
        BinaryBotPrivateVirtualSettings.realSteps++;
        if(
            BinaryBotPrivateVirtualSettings.realSteps >= BinaryBotPrivateVirtualSettings.minTradesOnReal &&
            BinaryBotPrivateVirtualSettings.realSteps < BinaryBotPrivateVirtualSettings.maxTradesOnReal
            ) {
                if(
                    (Bot.isResult('win') && BinaryBotPrivateVirtualSettings.goBack) ||
                    (Bot.isResult('lost') && !BinaryBotPrivateVirtualSettings.goBack)
                ) {
                    BinaryBotPrivateVirtualSettings.ongoing = true;
                    BinaryBotPrivateVirtualSettings.realSteps = 0;
                    Bot.setVirtualOngoing(true);
                }
            } else if(BinaryBotPrivateVirtualSettings.realSteps >= BinaryBotPrivateVirtualSettings.maxTradesOnReal) {
                BinaryBotPrivateVirtualSettings.ongoing = true;
                BinaryBotPrivateVirtualSettings.realSteps = 0;
                Bot.setVirtualOngoing(true);
            }
    }
    if (BinaryBotPrivateVirtualSettings.changeToVirtual) {
        BinaryBotPrivateVirtualSettings.changeToVirtual = false;
        BinaryBotPrivateVirtualSettings.ongoing = true;
        Bot.setVirtualOngoing(true);
    }

    if (BinaryBotPrivateVirtualSettings.changeToReal) {
        BinaryBotPrivateVirtualSettings.changeToReal = false;
        BinaryBotPrivateVirtualSettings.ongoing = false;
        Bot.setVirtualOngoing(false);
    }
}
console.log(BinaryBotPrivateVirtualSettings);
return true;`;



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/after_purchase/trade_again.js
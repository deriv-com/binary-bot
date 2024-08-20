import { translate } from '../../../common/i18n';
import './check_result';
import './read_details';
import './trade_again';
import './read_all_details';
import { configMainBlock, setBlockTextColor } from '../../utils';
import theme from '../../theme';

Blockly.Blocks.after_purchase = {
    init: function init() {
        this.appendDummyInput()
            // .appendField(new Blockly.FieldImage('', 0, 0, 'F'))
            .appendField(`${translate('After Purchase')  }                              `, 'TITLE');
        this.appendStatementInput('AFTERPURCHASE_STACK').setCheck('TradeAgain');
        this.setColour(theme.blockColor);
        this.setTooltip(
            translate('Get the previous trade information and result, then trade again (Runs on trade finish)')
        );
    },
    onchange: function onchange(ev) {
        if (ev.type === 'create') {
            setBlockTextColor(this);
        }
        configMainBlock(ev, 'after_purchase');
        this.getField('TITLE').textElement_.removeAttribute('style');
        // this.getField('TITLE').textElement_.style.fill = '#f0b90a !important';
        Blockly.utils.addClass(this.getField('TITLE').textElement_, 'top-block-title');
    },
};
Blockly.JavaScript.after_purchase = block => {
    const stack = Blockly.JavaScript.statementToCode(block, 'AFTERPURCHASE_STACK');
    const code = `
BinaryBotPrivateAfterPurchase = function BinaryBotPrivateAfterPurchase(){
    // if(!BinaryBotPrivateVirtualSettings.ongoing) {
    //     if(Bot.isResult('win')) {
    //         BinaryBotPrivateVirtualSettings.ongoing = true;
    //         Bot.setVirtualOngoing(true);
    //     }
    // }
    
    ${stack}
    return false;
};`;
    return code;
};



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/after_purchase/index.js
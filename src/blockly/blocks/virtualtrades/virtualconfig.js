import {
    translate
} from '../../../i18n';
import theme from '../../theme';
import {
    insideTrade
} from '../../relationChecker';

Blockly.Blocks.virtual_config = {
    init: function init() {
        this.appendDummyInput().appendField(translate('Virtual Trades Settings'));
        this.appendValueInput('STATUS').setCheck('Boolean').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Status')  }:`);
        this.appendValueInput('TOKEN').setCheck('String').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Demo Account Token')  }:`);
        this.appendValueInput('MAXSTEPS').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Max Steps')  }:`);
        this.appendValueInput('STEPSCOUNT').setCheck('Boolean').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Count steps on loss')  }:`);
        this.appendValueInput('RESETTYPE').setCheck('Boolean').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Reset steps')  }:`);
        this.appendValueInput('MINREAL').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Min. Trades on Real')  }:`);
        this.appendValueInput('MAXREAL').setCheck('Number').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Max. Trades on Real')  }:`);
        this.appendValueInput('BACKREAL').setCheck('Boolean').setAlign(Blockly.ALIGN_RIGHT).appendField(`${translate('Go Back to Virtual on Win')  }:`);
        this.setColour(theme.subBlockColor);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(translate('Set all the virtual trades configuration'));
    },
    onchange: function onchange(ev) {
        insideTrade(this, ev, translate('Trade Options'));
        const {
            childBlocks_,
            svgGroup_: {
                children
            }
        } = this;
        childBlocks_.map(a => {
            a.svgPath_.style.fill = theme.shadowDefault;
            a.svgPathDark_.style.display = 'none';
            return a
        });
        for (let index = 0; index < children.length; index++) {
            const a = children[index];
            if (a.tagName === 'g' && (a.classList.length === 0)) {
                a.children[3].children[0].style.fill = theme.indicatorColorAccent;
                a.children[1].style.fill = theme.blockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyEditableText') {
                a.children[0].style.fill = theme.underBlockColor;
            } else if (a.tagName === 'g' && a.classList[0] === 'blocklyDraggable') {
                a.children[1].style.fill = theme.subBlockColor;
            }
        }
    },
};

Blockly.JavaScript.virtual_config = block => {
    const status = Blockly.JavaScript.valueToCode(block, 'STATUS', Blockly.JavaScript.ORDER_ATOMIC);
    const token = Blockly.JavaScript.valueToCode(block, 'TOKEN', Blockly.JavaScript.ORDER_ATOMIC);
    const maxSteps = Blockly.JavaScript.valueToCode(block, 'MAXSTEPS', Blockly.JavaScript.ORDER_ATOMIC);
    const stepsCount = Blockly.JavaScript.valueToCode(block, 'STEPSCOUNT', Blockly.JavaScript.ORDER_ATOMIC);
    const resetType = Blockly.JavaScript.valueToCode(block, 'RESETTYPE', Blockly.JavaScript.ORDER_ATOMIC);
    const minReal = Blockly.JavaScript.valueToCode(block, 'MINREAL', Blockly.JavaScript.ORDER_ATOMIC);
    const maxReal = Blockly.JavaScript.valueToCode(block, 'MAXREAL', Blockly.JavaScript.ORDER_ATOMIC);
    const backReal = Blockly.JavaScript.valueToCode(block, 'BACKREAL', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `
BinaryBotPrivateVirtualSettings = {
    token: ${token},
    ongoing: true,
    valid: true,
    changeToVirtual: false,
    changeToReal: false,
    steps: 0,
    realSteps:0, 
    countOnLoss: ${stepsCount},
    minTradesOnReal: ${minReal},
    maxTradesOnReal: ${maxReal},
    goBack: ${backReal},
    active: ${status},
    maxSteps: ${maxSteps},
    reset: ${resetType}
};`;

    return code;
}



// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/virtualtrades/virtualconfig.js
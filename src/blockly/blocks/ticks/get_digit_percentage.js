import { translate } from '@i18n';
import { mainScope } from '../../relationChecker';

Blockly.Blocks['get_digit_percentage'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(translate('Get digit\'s percentage of the digit'))
        .appendField(new Blockly.FieldDropdown(
            Array.from({ length: 10 }, (_, i) => [i.toString(), i.toString()])),
            'DIGIT')
        .appendField(translate('in the last'))
        .appendField(new Blockly.FieldNumber(100, 1), 'DIGITS_COUNT')
        .appendField(translate('digits'));
    this.setOutput(true, 'Number');
    this.setColour('#162d41'); // Choose an appropriate color for your block
    this.setTooltip(translate('Returns the percentage of a specific digit in the last digits list'));
    this.setHelpUrl('https://github.com/binary-com/binary-bot/wiki');
  }
};

Blockly.JavaScript['get_digit_percentage'] = function(block) {
  const dropdown_digit = block.getFieldValue('DIGIT');
  const number_digits_count = block.getFieldValue('DIGITS_COUNT');

  const code = `(() => {
    const lastDigits = Bot.getLastDigitList();
    const lastDigitsToConsider = lastDigits.slice(-${number_digits_count});
    const countOfDigit = lastDigitsToConsider.filter(digit => digit === '${dropdown_digit}').length;
    const percentage = (countOfDigit / lastDigitsToConsider.length) * 100;
    return percentage;
  })()`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

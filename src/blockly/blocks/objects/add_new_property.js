import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.JavaScript.object_property = block => {
    const prop = block.getFieldValue('PROPERTY');
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `"${  prop  }" : ${  value  },\n`;
    return code;
}

Blockly.defineBlocksWithJsonArray([{
    'type': 'object_property',
    'message0': `${translate('Property')} %1 ${translate('with the value')} %2`,
    'args0': [{
            'type': 'field_input',
            'name': 'PROPERTY',
            'text': 'prop',
        },
        {
            'type': 'input_value',
            'name': 'VALUE',
        },
    ],
    tooltip: translate('Add a new property with a value to an object'),
    'previousStatement': null,
    'nextStatement': null,
    'colour': theme.subBlockColor,
}]);


// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/objects/add_new_property.js
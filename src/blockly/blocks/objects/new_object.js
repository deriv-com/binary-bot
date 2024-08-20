import {
    translate
} from '../../../i18n';
import theme from '../../theme';

Blockly.JavaScript.new_object = block => {
    const properties = Blockly.JavaScript.statementToCode(block, 'PROPERTIES');
    const code = `{\n${  properties  }}`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

Blockly.defineBlocksWithJsonArray([{
    'type': 'new_object',
    'message0': `${translate('Create new object with')}: %1 %2`,
    'args0': [{
            'type': 'input_dummy',
        },
        {
            'type': 'input_statement',
            'name': 'PROPERTIES',
        },
    ],
    tooltip: translate('Creates a new object and assign to a variable'),
    'output': null,
    'colour': theme.subBlockColor,
}]);


// WEBPACK FOOTER //
// ./src/botPage/view/blockly/blocks/objects/new_object.js
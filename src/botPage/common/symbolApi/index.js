import ActiveSymbols from './activeSymbols';
import config from '../../common/const';
import { getObjectValue } from '../../../common/utils/tools';
import { getTokenList, removeAllTokens } from '../../../common/utils/storageManager';
import { observer as globalObserver } from '../../../common/utils/observer';

let parsed_asset_index;

const parseAssetIndex = asset_index => {
    const parsed = {};

    asset_index.forEach(symbol => {
        parsed[symbol[0].toLowerCase()] = {};

        symbol[2].forEach(category => {
            [, , parsed[symbol[0].toLowerCase()][category[0].toLowerCase()]] = category;
        });
    });
    return parsed;
};

const getAllowedConditionsOrCategoriesForSymbol = symbol => {
    let conditions = [];
    const categories = [];
    const index = parsed_asset_index[symbol.toLowerCase()];
    if (index) {
        Object.keys(config.conditionsCategory).forEach(conditionName => {
            if (conditionName in index) {
                conditions = conditions.concat(config.conditionsCategory[conditionName]);
                categories.push(conditionName);
            }
        });
    }
    return { conditions, categories };
};

const getCategoryForCondition = condition =>
    Object.keys(config.conditionsCategory).find(
        category => config.conditionsCategory[category].indexOf(condition.toLowerCase()) >= 0
    );

export default class _Symbol {
    constructor(api) {
        this.api = api;
        this.initPromise = new Promise(resolve => {
            const getActiveSymbolsLogic = () => {
                this.api
                    .send({ active_symbols: 'brief' })
                    .then(r => {
                        this.activeSymbols = new ActiveSymbols(r.active_symbols);
                        this.api
                            .send({ asset_index: 1 })
                            .then(({ asset_index }) => {
                                parsed_asset_index = parseAssetIndex(asset_index);
                                resolve();
                            })
                            .catch(error => {
                                globalObserver.emit('Error', error);
                            });
                    })
                    .catch(error => {
                        globalObserver.emit('Error', error);
                    });
            };
            // Authorize the WS connection when possible for accurate offered Symbols & AssetIndex
            const token_list = getTokenList();
            if (token_list.length) {
                this.api
                    .authorize(token_list[0].token)
                    .then(() => getActiveSymbolsLogic())
                    .catch(e => {
                        globalObserver.emit('Error', e);
                        removeAllTokens();
                        getActiveSymbolsLogic();
                    });
            } else {
                getActiveSymbolsLogic();
            }
        });
    }

    /* eslint-disable class-methods-use-this */
    getLimitation(symbol, condition) {
        const category = getCategoryForCondition(condition);
        return {
            minDuration: parsed_asset_index[symbol.toLowerCase()][category],
        };
    }

    isConditionAllowedInSymbol(symbol, condition) {
        const { conditions } = getAllowedConditionsOrCategoriesForSymbol(symbol);
        return conditions.includes(condition);
    }

    getConditionName(condition) {
        const [con1, con2] = config.opposites[condition.toUpperCase()];
        return `${getObjectValue(con1)}/${getObjectValue(con2)}`;
    }

    getCategoryNameForCondition(condition) {
        return config.conditionsCategoryName[getCategoryForCondition(condition)];
    }

    getAllowedCategories(symbol) {
        return getAllowedConditionsOrCategoriesForSymbol(symbol).categories;
    }

    getAllowedCategoryNames(symbol) {
        const { categories } = getAllowedConditionsOrCategoriesForSymbol(symbol);
        return categories.map(el => config.conditionsCategoryName[el]);
    }
    /* eslint-enable */
}

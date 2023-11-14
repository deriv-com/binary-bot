import { api_base } from '@api-base';
import { removeAllTokens, getClientAccounts, getActiveLoginId } from '@storage';
import { observer as globalObserver } from '@utilities/observer';
import config from '@currency-config';
import { getObjectValue } from '@utils';
import ActiveSymbols from './activeSymbols';

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
    const index = parsed_asset_index?.[symbol.toLowerCase()];
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

function parameterExists(url, params_to_check) {
    const queryString = url.split('?')[1];

    if (!queryString) {
        return false;
    }

    const urlParameters = queryString.split('&');

    for (let i = 0; i < params_to_check.length; i++) {
        for (let j = 0; j < urlParameters.length; j++) {
            const [paramName] = urlParameters[j].split('=');
            if (paramName === params_to_check[i]) {
                return true;
            }
        }
    }

    return false;
}

export default class _Symbol {
    constructor() {
        this.initPromise = new Promise(resolve => {
            const getActiveSymbolsLogic = async () => {
                this.activeSymbols = new ActiveSymbols(api_base.active_symbols);
                try {
                    const { asset_index } = await api_base.api.send({ asset_index: 1 });
                    parsed_asset_index = parseAssetIndex(asset_index);
                    resolve();
                } catch (error) {
                    globalObserver.emit('Error', error);
                }
            };

            // Authorize the WS connection when possible for accurate offered Symbols & AssetIndex
            const accounts = getClientAccounts();
            const loginid = getActiveLoginId();
            const initialize = (account_token = accounts?.[loginid]?.token) => {
                api_base
                    .authorize(account_token)
                    .then(() => getActiveSymbolsLogic())
                    .catch(e => {
                        globalObserver.emit('Error', e);
                        removeAllTokens();
                        getActiveSymbolsLogic();
                    });
            };

            const initializeOnLogout = () => {
                api_base.getActiveSymbols();
                getActiveSymbolsLogic();
            };

            if (loginid && accounts && accounts?.[loginid]?.token) {
                initialize();
            } else {
                const url = window.location.href;
                const params_to_check = ['l', 'lang'];
                const check_param_exists = parameterExists(url, params_to_check);
                const urlObject = new URL(url);
                const queryParams = urlObject.searchParams;
                const tokens_from_url = Array.from(queryParams.values());

                if (check_param_exists && tokens_from_url.length > 1) {
                    // Used when we have a token in the query param
                    // and the query params are token or lang
                    console.log(tokens_from_url);
                    initialize(tokens_from_url[1]);
                } else {
                    // Used when the user logs out
                    initializeOnLogout();
                }
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

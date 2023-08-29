import { get as getStorage, getTokenList, isLoggedIn } from '@storage';
import api from '../botPage/view/deriv/api';

const eu_countries = [
    'it',
    'de',
    'fr',
    'lu',
    'gr',
    'mf',
    'es',
    'sk',
    'lt',
    'nl',
    'at',
    'bg',
    'si',
    'cy',
    'be',
    'ro',
    'hr',
    'pt',
    'pl',
    'lv',
    'ee',
    'cz',
    'fi',
    'hu',
    'dk',
    'se',
    'ie',
    'im',
    'gb',
    'mt',
];
// TODO: [duplicate_code] - Move this to shared package
// check if client is from EU
export const isEu = country => eu_countries.includes(country);

/**
 *
 * @param {*} token_list list of the tokens from the local storage
 * @returns
 */
export const isEuByAccount = (token_list = []) => {
    const [active_token = {}] = token_list;
    const { loginInfo = {} } = active_token;
    return eu_countries.includes(loginInfo.country);
};
/* eslint-disable camelcase */
export const isEuLandingCompany = landing_company => /^(maltainvest|malta|iom)$/.test(landing_company);

export const hasEuAccount = token_list =>
    token_list.some(token_obj => isEuLandingCompany(token_obj.loginInfo.landing_company_name));

export const isEuCountry = async () => {
    const { website_status } = await api.send({ website_status: 1 });
    const { clients_country } = website_status;
    const { landing_company } = await api.send({ landing_company: clients_country });
    const { financial_company, gaming_company } = landing_company;

    const eu_excluded_regexp = /^mt$/;
    const financial_shortcode = financial_company ? financial_company.shortcode : false;
    const gaming_shortcode = gaming_company ? gaming_company.shortcode : false;

    if (financial_shortcode || gaming_shortcode) {
        return isEuLandingCompany(financial_shortcode) || isEuLandingCompany(gaming_shortcode);
    }

    return eu_excluded_regexp.test(clients_country);
};
/* eslint-enable */

const isEmptyObject = obj => {
    let is_empty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) is_empty = false;
        });
    }
    return is_empty;
};

const isLowRisk = (financial_company, gaming_company, token_list) => {
    const upgradable_companies = token_list.map(data => {
        const {
            loginInfo: { upgradeable_landing_companies },
        } = data;
        return upgradeable_landing_companies;
    });
    const financial_shortcode = financial_company?.shortcode;
    const gaming_shortcode = gaming_company?.shortcode;
    const low_risk_landing_company = financial_shortcode === 'maltainvest' && gaming_shortcode === 'svg';
    return (
        low_risk_landing_company ||
        (upgradable_companies[0]?.includes('svg') && upgradable_companies[0]?.includes('maltainvest'))
    );
};

const isHighRisk = (financial_company, gaming_company, risk_classification) => {
    const restricted_countries =
        financial_company?.shortcode === 'svg' ||
        (gaming_company?.shortcode === 'svg' && financial_company?.shortcode !== 'maltainvest');

    const high_risk_landing_company = financial_company?.shortcode === 'svg' && gaming_company?.shortcode === 'svg';
    return risk_classification === 'high' || high_risk_landing_company || restricted_countries;
};

export const isMultiplier = landing_company_list => {
    const multiplier_account = landing_company_list?.financial_company?.legal_allowed_contract_categories;
    const is_multiplier = multiplier_account?.includes('multiplier');
    return {
        is_multiplier: multiplier_account.length === 1 && is_multiplier,
        country_code: landing_company_list.id,
    };
};

export const checkSwitcherType = async () => {
    if (!isLoggedIn()) return null;
    const token_list = await getTokenList();
    const is_eu = isEuByAccount(token_list);
    const client_accounts = JSON.parse(getStorage('client.accounts'));
    const client_country_code = token_list[0]?.loginInfo?.country || localStorage.getItem('client.country');
    if (!client_country_code) return null;
    const { landing_company } = await api.send({
        landing_company: client_country_code,
    });

    const { is_multiplier, country_code } = await isMultiplier(landing_company);

    const { financial_company, gaming_company } = landing_company;
    const account_status = await api.send({ get_account_status: 1 });

    const {
        get_account_status: { risk_classification },
    } = account_status;

    let is_low_risk = isLowRisk(financial_company, gaming_company, token_list);
    let is_high_risk = isHighRisk(financial_company, gaming_company, risk_classification);

    if (isEmptyObject(client_accounts || token_list)) return false;

    const low_risk_no_account = is_low_risk && Object.keys(client_accounts).length === 1;

    const high_risk_no_account = is_high_risk && Object.keys(client_accounts).length === 1;

    const is_high_risk_or_eu = is_eu && is_high_risk;

    if (low_risk_no_account) {
        is_low_risk = false;
    }
    if (high_risk_no_account) {
        is_high_risk = false;
    }

    if (is_low_risk) {
        is_high_risk = false;
    }
    if (is_high_risk) {
        is_low_risk = false;
    }

    return {
        low_risk: is_low_risk,
        high_risk: !!is_high_risk,
        low_risk_without_account: low_risk_no_account,
        high_risk_without_account: high_risk_no_account,
        high_risk_or_eu: is_high_risk_or_eu,
        is_multiplier: !!is_multiplier,
        country_code: country_code || token_list[0]?.loginInfo.country,
    };
};

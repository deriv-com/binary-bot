/* eslint-disable import/prefer-default-export */
import { generateDerivApiInstance } from "./appId";

/* eslint-disable camelcase */
export const isEuLandingCompany = landing_company => /^(maltainvest|malta|iom)$/.test(landing_company);

export const hasEuAccount = token_list =>
  token_list.some(token_obj => isEuLandingCompany(token_obj.loginInfo.landing_company_name));

export const isEuCountry = async (api = generateDerivApiInstance()) => {
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

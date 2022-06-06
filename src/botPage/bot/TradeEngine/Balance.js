import { roundBalance } from "../../common/tools";
import { info } from "../broadcast";
import { observer as globalObserver } from "../../../common/utils/observer";
import api from "../../view/deriv/api";

export const getBalance = (type) => {
  const balance = globalObserver.getState("balance");
  const balance_str = `${balance}`;
  return type === "STR" ? balance_str : Number(balance);
}

export const observeBalance = (accountInfo) => {
  api.onMessage().subscribe(({ data }) => {
    if (data?.error?.code) {
      return;
    }
    if (data?.msg_type === "balance") {
      const { currency, balance } = data.balance;
      const rounded_balance = roundBalance({ currency, balance });
      const balance_str = `${rounded_balance} ${currency}`;

      globalObserver.setState({ balance, currency });
      info({ accountID: accountInfo?.loginid, balance: balance_str });
    }
  });
}

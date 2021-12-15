import { expectCandle, expectCandles } from '../sanitize';

const getCandleInterface = () => ({
    isCandleBlack: candle => expectCandle(candle) && candle.close < candle.open,
    candleValues: (ohlc, field) => expectCandles(ohlc).map(o => o[field]),
    candleField: (candle, field) => expectCandle(candle)[field],
});

export default getCandleInterface;

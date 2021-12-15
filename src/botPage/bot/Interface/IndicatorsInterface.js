import sma, { simpleMovingAverageArray as smaa } from '@binary-com/binary-indicators/lib/simpleMovingAverage';
import ema, { exponentialMovingAverageArray as emaa } from '@binary-com/binary-indicators/lib/exponentialMovingAverage';
import bb, { bollingerBandsArray as bba } from '@binary-com/binary-indicators/lib/bollingerBands';
import rsi, { relativeStrengthIndexArray as rsia } from '@binary-com/binary-indicators/lib/relativeStrengthIndex';
import macda from '@binary-com/binary-indicators/lib/macd';

const decorate = (f, getPipSize, input, config, ...args) => {
    const pipSize = getPipSize();
    return f(input, { pipSize, ...config }, ...args);
};

const getIndicatorsInterface = tradeEngine => {
    const { getPipSize } = tradeEngine;
    return {
        sma: (input, periods) => decorate(sma, getPipSize, input, { periods }),
        smaa: (input, periods) => decorate(smaa, getPipSize, input, { periods }),
        ema: (input, periods) => decorate(ema, getPipSize, input, { periods }),
        emaa: (input, periods) => decorate(emaa, getPipSize, input, { periods }),
        rsi: (input, periods) => decorate(rsi, getPipSize, input, { periods }),
        rsia: (input, periods) => decorate(rsia, getPipSize, input, { periods }),
        bb: (input, config, field) => decorate(bb, getPipSize, input, config)[field],
        bba: (input, config, field) => decorate(bba, getPipSize, input, config).map(r => r[field]),
        macda: (input, config, field) => decorate(macda, getPipSize, input, config).map(r => r[field]),
    };
};

export default getIndicatorsInterface;

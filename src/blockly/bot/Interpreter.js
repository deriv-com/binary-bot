import JSInterpreter from 'js-interpreter';
import { observer as globalObserver } from '@utilities/observer';
import { createScope } from './CliTools';
import Interface from './Interface';
import { clone } from '../../botPage/common/clone';
import { api_base } from '../../api-base';

/* eslint-disable func-names, no-underscore-dangle */
JSInterpreter.prototype.takeStateSnapshot = function () {
    const newStateStack = clone(this.stateStack, undefined, undefined, undefined, true);
    return newStateStack;
};

JSInterpreter.prototype.restoreStateSnapshot = function (snapshot) {
    this.stateStack = clone(snapshot, undefined, undefined, undefined, true);
    this.globalObject = this.stateStack[0]?.scope?.object;
    this.initFunc_(this, this.globalObject);
};
/* eslint-enable */

const unrecoverable_errors = [
    'InsufficientBalance',
    'CustomLimitsReached',
    'InvalidCurrency',
    'ContractBuyValidationError',
    'NotDefaultCurrency',
    'PleaseAuthenticate',
    'FinancialAssessmentRequired',
    'PositiveIntegerExpected',
    'OptionError',
    'IncorrectPayoutDecimals',
    'IncorrectStakeDecimals',
    'NoMFProfessionalClient',
    'AuthorizationRequired',
    'InvalidToken',
    'DailyLossLimitExceeded',
    'ClientUnwelcome',
    'PriceMoved',
];

const botInitialized = bot => bot?.tradeEngine?.options;
const botStarted = bot => botInitialized(bot) && bot.tradeEngine.tradeOptions;
const shouldRestartOnError = (bot, error_name = '') =>
    !unrecoverable_errors.includes(error_name) && botInitialized(bot) && bot.tradeEngine.options.shouldRestartOnError;

const shouldStopOnError = (bot, error_name = '') => {
    const stop_errors = [
        'SellNotAvailableCustom',
        'CustomInvalidProposal',
        'ContractCreationFailure',
        'OfferingsValidationError',
        'InputValidationFailed',
    ];
    return stop_errors.includes(error_name) && botInitialized(bot);
};

const timeMachineEnabled = bot => botInitialized(bot) && bot.tradeEngine.options.timeMachineEnabled;

export default class Interpreter {
    constructor() {
        this.init();
    }

    init() {
        this.$scope = createScope();
        this.bot = new Interface(this.$scope);
        this.stopped = false;
        this.$scope.observer.register('REVERT', watchName =>
            this.revert(watchName === 'before' ? this.beforeState : this.duringState)
        );

        api_base.api.onClose().subscribe(() => {
            const reRunBot = e => {
                if (e.id === 'contract.sold') {
                    // TODO check for trage again block and run it
                    this.revert(this.startState);
                    globalObserver.unregister('contract.status', reRunBot);
                }
            };
            api_base.init().then(() => {
                globalObserver.register('contract.status', reRunBot);

                this.$scope.observer.emit('Error', { error: { code: 'DisconnectError', message: '' } });
            });
        });
    }

    run = code => {
        const initFunc = (interpreter, scope) => {
            const botInterface = this.bot.getInterface('Bot');
            const ticksInterface = this.bot.getTicksInterface();
            const { alert, prompt, sleep, console: customConsole } = this.bot.getInterface();

            interpreter.setProperty(scope, 'console', interpreter.nativeToPseudo(customConsole));
            interpreter.setProperty(scope, 'alert', interpreter.nativeToPseudo(alert));
            interpreter.setProperty(scope, 'prompt', interpreter.nativeToPseudo(prompt));
            interpreter.setProperty(
                scope,
                'getPurchaseReference',
                interpreter.nativeToPseudo(botInterface.getPurchaseReference)
            );

            const pseudoBotInterface = interpreter.nativeToPseudo(botInterface);

            Object.entries(ticksInterface).forEach(([name, f]) => {
                interpreter.setProperty(pseudoBotInterface, name, this.createAsync(interpreter, f));
            });

            interpreter.setProperty(
                pseudoBotInterface,
                'start',
                interpreter.nativeToPseudo((...args) => {
                    const { start } = botInterface;
                    if (shouldRestartOnError(this.bot)) {
                        this.startState = interpreter.takeStateSnapshot();
                    }
                    start(...args);
                })
            );

            interpreter.setProperty(
                pseudoBotInterface,
                'purchase',
                this.createAsync(interpreter, botInterface.purchase)
            );
            interpreter.setProperty(
                pseudoBotInterface,
                'sellAtMarket',
                this.createAsync(interpreter, botInterface.sellAtMarket)
            );
            interpreter.setProperty(scope, 'Bot', pseudoBotInterface);

            interpreter.setProperty(
                scope,
                'watch',
                this.createAsync(interpreter, watchName => {
                    const { watch } = this.bot.getInterface();

                    if (timeMachineEnabled(this.bot)) {
                        const snapshot = this.interpreter.takeStateSnapshot();
                        if (watchName === 'before') {
                            this.beforeState = snapshot;
                        } else {
                            this.duringState = snapshot;
                        }
                    }

                    return watch(watchName);
                })
            );

            interpreter.setProperty(scope, 'sleep', this.createAsync(interpreter, sleep));
        };

        return new Promise((resolve, reject) => {
            const onError = async e => {
                if (this.stopped) {
                    return;
                }

                if (shouldStopOnError(this.bot, e.name)) {
                    globalObserver.emit('ui.log.error', e.message);
                    document.getElementById('stopButton').click();
                    await this.stop();
                    return;
                }

                this.isErrorTriggered = true;
                const error = e?.error?.code || e;
                if (!shouldRestartOnError(this.bot, error) || !botStarted(this.bot)) {
                    reject(e);
                    return;
                }

                globalObserver.emit('Error', e);
                const { initArgs, tradeOptions } = this.bot.tradeEngine;
                this.terminateSession().then(() => {
                    this.init();
                    this.$scope.observer.register('Error', onError);
                    this.bot.tradeEngine.init(...initArgs);
                    this.bot.tradeEngine.start(tradeOptions);
                    // TODO to add it back in case of normal error and we bot the coninue
                    //  this.revert(this.startState);
                });
            };

            this.$scope.observer.register('Error', onError);
            this.interpreter = new JSInterpreter(code, initFunc);
            this.onFinish = resolve;
            this.loop();
        });
    };

    loop() {
        if (this.stopped || !this.interpreter.run()) {
            this.onFinish(this.interpreter.pseudoToNative(this.interpreter.value));
        }
    }

    revert = state => {
        this.interpreter.restoreStateSnapshot(state);
        // eslint-disable-next-line no-underscore-dangle
        this.interpreter.paused_ = false;
        this.loop();
    };

    terminateSession() {
        return new Promise((resolve, reject) => {
            this.stopped = true;
            this.isErrorTriggered = false;
            globalObserver.setState({ isRunning: false });
            const { ticksService } = this.$scope;
            ticksService
                .unsubscribeFromTicksService()
                .then(() => {
                    globalObserver.setState({ isStopping: false });
                    resolve();
                })
                .catch(err => reject(err));
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            if (this.bot.tradeEngine.isSold === false && !this.isErrorTriggered) {
                globalObserver.register('contract.status', contractStatus => {
                    if (contractStatus.id === 'contract.sold') {
                        this.terminateSession()
                            .then(() => {
                                globalObserver.unregisterAll('contract.status');
                                resolve();
                            })
                            .catch(err => reject(err));
                    }
                });
            } else {
                this.terminateSession()
                    .then(() => resolve())
                    .catch(err => reject(err));
            }
        });
    }

    createAsync(interpreter, func) {
        const asyncFunc = (...args) => {
            const callback = args.pop();

            // Workaround for unknown number of args
            const reversedArgs = args.slice().reverse();
            const firsDefinedArgIdx = reversedArgs.findIndex(arg => arg !== undefined);

            // Remove extra undefined args from end of the args
            const functionArgs = firsDefinedArgIdx < 0 ? [] : reversedArgs.slice(firsDefinedArgIdx).reverse();
            // End of workaround

            func(...functionArgs.map(arg => interpreter.pseudoToNative(arg)))
                .then(rv => {
                    callback(interpreter.nativeToPseudo(rv));
                    this.loop();
                })
                .catch(e => this.$scope.observer.emit('Error', e));
        };

        // TODO: This is a workaround, create issue on original repo, once fixed
        // remove this. We don't know how many args are going to be passed, so we
        // assume a max of 100.
        const MAX_ACCEPTABLE_FUNC_ARGS = 100;
        Object.defineProperty(asyncFunc, 'length', { value: MAX_ACCEPTABLE_FUNC_ARGS + 1 });
        return interpreter.createAsyncFunction(asyncFunc);
    }

    hasStarted() {
        return !this.stopped;
    }
}

export const createInterpreter = () => new Interpreter();

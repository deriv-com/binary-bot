export const debounce = (func, delay) => {
    let timeoutId;

    const debouncedFunction = function (...args) {
        const context = this;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };

    return debouncedFunction;
};

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

export const formatDate = date => {
    const year = date.getFullYear();
    const day = `0${date.getDate()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    return year + day + month;
};

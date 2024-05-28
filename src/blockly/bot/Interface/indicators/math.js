export const takeField = (arr, field) => arr.map(x => (field ? x[field] : x));

export const takeLast = (arr, n, field) => takeField(arr.slice(n > arr.length ? 0 : arr.length - n, arr.length), field);

export const sum = data => data.reduce((acc, x) => acc + x, 0);

export const mean = data => data.reduce((a, b) => a + b, 0) / data.length;

export const stddev = data => {
    const data_mean = mean(data);
    const sq_diff = data.map(n => (n - data_mean) ** 2);
    const avg_sq_diff = mean(sq_diff);
    return Math.sqrt(avg_sq_diff);
};

export const sequence = n => Array.from(Array(n).keys());

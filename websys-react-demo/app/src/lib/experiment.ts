const generateUserAmounts = (start: number, stop: number, step: number) => {
    const size = (stop - start) / step + 1;

    return Array.from({ length: size }, (_value, key) => {
        return start + key * step;
    });
};

export type CSVResults = {
    sort: string;
    render: string;
    total: string;
};

export const USER_AMOUNTS = generateUserAmounts(10, 1000, 100);

export const ITERATIONS = 10;

const generateUserAmounts = (start: number, stop: number, step: number) => {
    const size = (stop - start) / step + 1;

    return Array.from({ length: size }, (_value, key) => {
        return start + key * step;
    });
};

export const USER_AMOUNTS = generateUserAmounts(10, 1000, 10);

export const ITERATIONS = 10;

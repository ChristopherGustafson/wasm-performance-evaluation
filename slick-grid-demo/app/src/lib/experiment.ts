const generateUserAmounts = (start: number, stop: number) => {
    const array = [];

    let next = start;
    let last = undefined;

    do {
        array.push(next);
        [last] = array.slice(-1);
        next = last * 2;
    } while (next <= stop);
    return array;
};

export type CSVResults = {
    sort: string;
    render: string;
    total: string;
};

export const USER_AMOUNTS = generateUserAmounts(10, 1280);

export const ITERATIONS = 40;

/* The type of data we are expecting as input */
export type Data = { [amount: number]: number[] };

/**
 * From a matrix of values, create a stringified CSV-version of the matrix
 * @param matrix
 * @returns A CSV-string of the matrix
 */
const matrixToCSV = (matrix: (string | number)[][]) => {
    const csvArray: string[] = [];
    for (const row of matrix) {
        csvArray.push(row.join(","));
    }
    return csvArray.join("\r\n");
};

/**
 * From a data-object, generate a url to download a CSV with the data
 * @param {{[amount: number]: number[]}} data An object with keys being an array of metrics
 * @returns An object URL, can be used in a link-element to download on click.
 */
const dataToCSV = (data: Data): string => {
    const amounts = Object.keys(data);

    const iterationsMatrix: number[][] = [];

    for (const amount of amounts) {
        for (let iteration = 0; iteration < data[parseInt(amount)].length; iteration++) {
            if (iterationsMatrix[iteration] === undefined) {
                iterationsMatrix[iteration] = [data[parseInt(amount)][iteration]];
            } else {
                iterationsMatrix[iteration].push(data[parseInt(amount)][iteration]);
            }
        }
    }

    const csvMatrix = [amounts, ...iterationsMatrix];
    const csvString = matrixToCSV(csvMatrix);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    return URL.createObjectURL(blob);
};

export default dataToCSV;

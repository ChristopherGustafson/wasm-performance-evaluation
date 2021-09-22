const matrixToCSV = (matrix: (string | number)[][]) => {
    const csvArray: string[] = [];
    for (const row of matrix) {
        csvArray.push(row.join(","));
    }
    return csvArray.join("\r\n");
};

const dataToCsv = (data: { [amount: number]: number[] }): string => {
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

export default dataToCsv;

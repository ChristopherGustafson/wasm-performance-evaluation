import { ChangeEvent, useState } from "react";
import { name } from "faker/locale/en";
import measureTime from "./lib/measureTime";

import { ITERATIONS, USER_AMOUNTS, CSVResults } from "./lib/experiment";
import dataToCSV, { Data } from "./lib/toCSV";
import { Implementation, implementations } from "./lib/implementations";
import quickSort, { Cmp } from "./lib/quickSort";

import "slickgrid/slick.core";
import "slickgrid/lib/jquery.event.drag-2.3.0";
import "slickgrid/slick.grid";
import "slickgrid/slick.grid.css";

type User = {
    id: number;
    firstName: string;
    lastName: string;
};

const columns: Array<Slick.Column<User>> = [
    { id: "id", name: "ID", field: "id" },
    { id: "firstName", name: "First name", field: "firstName" },
    { id: "lastName", name: "Last name", field: "lastName" },
];

const gridOptions = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    autoHeight: true,
    fullWidthRows: true,
};

const generateUser = (index: number): User => {
    return {
        id: index,
        firstName: name.firstName(),
        lastName: name.lastName(),
    };
};

const generateUsers = (amount: number): User[] => {
    return Array.from({ length: amount }, (_value, index) => {
        return generateUser(index);
    });
};

const userCmp = (a: User, b: User): -1 | 0 | 1 => {
    if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) {
        return 1;
    } else if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) {
        return -1;
    }
    return 0;
};

function sortNative<T>(arr: Array<T>, cmp: Cmp<T>): Array<T> {
    return arr.sort(cmp);
}

type ExperimentData = {
    sort: Data;
    render: Data;
};

const resultsEmpty: Data = USER_AMOUNTS.reduce((prevValue, currentValue) => ({ ...prevValue, [currentValue]: [] }), {});

let experimentData: ExperimentData = {
    sort: JSON.parse(JSON.stringify(resultsEmpty)),
    render: JSON.parse(JSON.stringify(resultsEmpty)),
};

let experimentRunning = false;

const Js = () => {
    const [implementation, setImplementation] = useState<Implementation>(Implementation.Native);
    const [CSVResults, setCSVResults] = useState<CSVResults>();
    const [users, setUsers] = useState(generateUsers(100));

    const getSortFunction = (imp: Implementation) => {
        switch (imp) {
            case Implementation.Native:
                return sortNative;
            case Implementation.QuickSort:
                return quickSort;
        }
    };

    const updateUserList = (value: string): [number, number] => {
        const parsedValue = value === "" ? 0 : parseInt(value);
        const generatedUsers = generateUsers(parsedValue);
        const sortFunction = getSortFunction(implementation);
        const [sortedUsers, sortingTime] = measureTime(
            sortFunction,
            `[JS] sort ${generatedUsers.length} users`,
            generatedUsers,
            userCmp
        );
        if (experimentRunning) {
            // If experiment is running add the measured value to the experiment data
            experimentData.sort[parsedValue].push(sortingTime);
        }
        setUsers(sortedUsers);
        const createSlickGrid = () => {
            new Slick.Grid("#slick", sortedUsers, columns, gridOptions);
        };
        const renderTime = measureTime(createSlickGrid, `[JS] render ${generatedUsers.length} users`)[1];
        return [sortingTime, renderTime];
    };

    const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateUserList(event.target.value);
    };

    const refresh = () => {
        updateUserList(users.length.toString());
    };

    const runExperiments = async () => {
        const resultsEmpty: Data = USER_AMOUNTS.reduce(
            (prevValue, currentValue) => ({ ...prevValue, [currentValue]: [] }),
            {}
        );
        // Deep copy the empty results =
        const resultsSort: Data = JSON.parse(JSON.stringify(resultsEmpty));
        const resultsRender: Data = JSON.parse(JSON.stringify(resultsEmpty));
        const resultsTotal: Data = JSON.parse(JSON.stringify(resultsEmpty));

        for (const amount of USER_AMOUNTS) {
            for (let iteration = 0; iteration < ITERATIONS; iteration++) {
                const [sortingTime, renderTime] = await updateUserList(amount.toString());
                resultsSort[amount].push(sortingTime);
                resultsRender[amount].push(renderTime);
                resultsTotal[amount].push(sortingTime + renderTime);
                // Add small delay to avoid update depth conflicts
                await new Promise((resolve) => setTimeout(resolve, 1));
            }
        }
        console.log("[WASM] Sort data:");
        console.table(resultsSort);
        console.log("[WASM] Render data:");
        console.table(resultsRender);
        console.log("[WASM] Total data:");
        console.table(resultsTotal);

        const resultsSortCSV = dataToCSV(resultsSort);
        const resultsRenderCSV = dataToCSV(resultsRender);
        const resultsTotalCSV = dataToCSV(resultsTotal);
        setCSVResults({
            sort: resultsSortCSV,
            render: resultsRenderCSV,
            total: resultsTotalCSV,
        });
    };

    const onImplementationChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setImplementation(parseInt(event.target.value));
    };

    return (
        <>
            <button onClick={runExperiments}>Run experiments</button>
            <button onClick={refresh}>Trigger refresh</button>
            <select value={implementation} onChange={onImplementationChange}>
                {implementations.map((imp) => (
                    <option key={imp[1]} value={imp[1]}>
                        {imp[0]}
                    </option>
                ))}
            </select>
            <input min={0} type="number" value={users.length} onChange={onAmountChange} />
            <br />
            {CSVResults && (
                <>
                    <a href={CSVResults.sort} download={"js-experiment-results-sort-slick.csv"}>
                        Download sort results
                    </a>
                    <br />
                    <a href={CSVResults.render} download={"js-experiment-results-render-slick.csv"}>
                        Download render results
                    </a>
                    <br />
                    <a href={CSVResults.total} download={"js-experiment-results-total-slick.csv"}>
                        Download total results
                    </a>
                </>
            )}
            <div id="slick" />
        </>
    );
};

export default Js;

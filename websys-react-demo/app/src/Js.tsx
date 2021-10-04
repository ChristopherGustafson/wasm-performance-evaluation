import { ChangeEvent, Profiler, ProfilerOnRenderCallback, useState } from "react";
import { name } from "faker/locale/en";
import measureTime from "./lib/measureTime";

import { ITERATIONS, USER_AMOUNTS, CSVResults } from "./lib/experiment";
import dataToCSV, { Data } from "./lib/toCSV";
import { Implementation, implementations } from "./lib/implementations";
import quickSort, { Cmp } from "./lib/quickSort";

type User = {
    firstName: string;
    lastName: string;
};

const generateUser = (): User => {
    return {
        firstName: name.firstName(),
        lastName: name.lastName(),
    };
};

const generateUsers = (amount: number): User[] => {
    return Array.from({ length: amount }, generateUser);
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

const Users: React.FC<{ users: User[] }> = ({ users }) => {
    return (
        <ul id="user_list">
            {users.map((user, index) => (
                <li key={index}>
                    <span>{user.firstName}</span>
                    <span>{user.lastName}</span>
                </li>
            ))}
        </ul>
    );
};

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

    const updateUserList = (value: string): number => {
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
        return sortingTime;
    };

    const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateUserList(event.target.value);
    };

    const refresh = () => {
        updateUserList(users.length.toString());
    };

    const runExperiments = async () => {
        // Start experiment by flushing old data and setting running to true
        experimentRunning = true;
        experimentData = {
            sort: JSON.parse(JSON.stringify(resultsEmpty)),
            render: JSON.parse(JSON.stringify(resultsEmpty)),
        };
        updateUserList(USER_AMOUNTS[0].toString());
    };

    const calculateResults = () => {
        const total = USER_AMOUNTS.reduce((prev, curr) => {
            const totalAmount = experimentData.render[curr].map((render, i) => render + experimentData.sort[curr][i]);
            return { ...prev, [curr]: totalAmount };
        }, {} as Data);

        const results: CSVResults = {
            sort: dataToCSV(experimentData.sort),
            render: dataToCSV(experimentData.render),
            total: dataToCSV(total),
        };
        console.log("[JS] Sort data:");
        console.table(experimentData.sort);
        console.log("[JS] Render data:");
        console.table(experimentData.render);
        console.log("[JS] Total data:");
        console.table(total);

        setCSVResults(results);
    };

    const onRender: ProfilerOnRenderCallback = (
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions
    ) => {
        if (experimentRunning) {
            const amountNumber = users.length;
            experimentData.render[amountNumber].push(actualDuration);
            if (experimentData.render[amountNumber].length === ITERATIONS) {
                // If we have more amounts to test, select the next one
                if (amountNumber !== USER_AMOUNTS.slice(-1)[0]) {
                    // Get the next amount in an ordered fashion
                    updateUserList(USER_AMOUNTS[USER_AMOUNTS.indexOf(amountNumber) + 1].toString());
                } else {
                    // If no more to test, calculate the results and stop experiment
                    calculateResults();
                    experimentRunning = false;
                }
            } else {
                // To avoid reaching maximum update depth, add a small delay here
                setTimeout(refresh, 1);
            }
        }
        console.log(`[JS] Render time: ${actualDuration}ms`);
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
                    <a href={CSVResults.sort} download={"wasm-experiment-results-sort.csv"}>
                        Download sort results
                    </a>
                    <br />
                    <a href={CSVResults.render} download={"wasm-experiment-results-render.csv"}>
                        Download render results
                    </a>
                    <br />
                    <a href={CSVResults.total} download={"wasm-experiment-results-total.csv"}>
                        Download total results
                    </a>
                </>
            )}
            <Profiler id="js" onRender={onRender}>
                <Users users={users} />
            </Profiler>
        </>
    );
};

export default Js;

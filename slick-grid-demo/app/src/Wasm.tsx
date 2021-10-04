import { ChangeEvent, useRef, useState } from "react";
import { CSVResults, ITERATIONS, USER_AMOUNTS } from "./lib/experiment";
import { Implementation, implementationName, implementations } from "./lib/implementations";
import measureTime from "./lib/measureTime";
import dataToCSV, { Data } from "./lib/toCSV";

import "slickgrid/slick.core";
import "slickgrid/lib/jquery.event.drag-2.3.0";
import "slickgrid/slick.grid";
import "slickgrid/slick.grid.css";

type User = {
    firstName: string;
    lastName: string;
};

const columns: Array<Slick.Column<User>> = [
    { id: "firstName", name: "First name", field: "firstName" },
    { id: "lastName", name: "Last name", field: "lastName" },
];

const gridOptions = {
    autoHeight: true,
    fullWidthRows: true,
};

const wasm = import("wasm");

const Wasm: React.FC = () => {
    const gridRef = useRef<Slick.Grid<User[]>>(null);
    const [CSVResults, setCSVResults] = useState<CSVResults>();
    const [implementation, setImplementation] = useState<Implementation>(Implementation.Native);
    const [amount, setAmount] = useState("100");

    const updateUserList = (value: string) => {
        const parsedValue = value === "" ? 0 : parseInt(value);
        return wasm.then((module) => {
            module.generate_users(parsedValue);
            const sortingTime = measureTime(module.sort_users, `[WASM] sort ${parsedValue} users`, implementation)[1];
            // Create empty slick grid table
            if (gridRef.current === null) {
                (gridRef.current as any) = new Slick.Grid("#slick", [], columns, gridOptions);
            }
            const renderTime = measureTime(module.render_users, `[WASM] render ${parsedValue} users`)[1];
            return [sortingTime, renderTime];
        });
    };

    const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
        updateUserList(event.target.value);
    };

    const refresh = () => {
        updateUserList(amount);
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
            <input min={0} type="number" value={amount.toString()} onChange={onAmountChange} />
            <br />
            {CSVResults && (
                <>
                    <a
                        href={CSVResults.sort}
                        download={`wasm-experiment-results-sort-${implementationName(implementation)}-slick.csv`}
                    >
                        Download sort results
                    </a>
                    <br />
                    <a
                        href={CSVResults.render}
                        download={`wasm-experiment-results-render-${implementationName(implementation)}-slick.csv`}
                    >
                        Download render results
                    </a>
                    <br />
                    <a
                        href={CSVResults.total}
                        download={`wasm-experiment-results-total-${implementationName(implementation)}-slick.csv`}
                    >
                        Download total results
                    </a>
                </>
            )}
            <div id="slick" />
        </>
    );
};

export default Wasm;

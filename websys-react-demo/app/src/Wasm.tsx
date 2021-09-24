import { ChangeEvent, useEffect, useState } from "react";
import { CSVResults, ITERATIONS, USER_AMOUNTS } from "./lib/experiment";
import measureTime from "./lib/measureTime";
import dataToCSV, { Data } from "./lib/toCSV";

const wasm = import("wasm");

const Users: React.FC = () => {
    return <div id="App" />;
};

const Wasm: React.FC = () => {
    const [CSVResults, setCSVResults] = useState<CSVResults>();
    const [amount, setAmount] = useState("100");

    useEffect(() => {
        wasm.then((module) => {
            module.init();
        });
    }, []);

    const updateUserList = (value: string) => {
        const parsedValue = value === "" ? 0 : parseInt(value);
        return wasm.then((module) => {
            module.generate_users(parsedValue);
            const sortingTime = measureTime(module.sort_users, `[WASM] sort ${parsedValue} users`)[1];
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

    return (
        <>
            <button onClick={runExperiments}>Run experiments</button>
            <button onClick={refresh}>Trigger refresh</button>
            <input min={0} type="number" value={amount.toString()} onChange={onAmountChange} />
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
            <Users />
        </>
    );
};

export default Wasm;

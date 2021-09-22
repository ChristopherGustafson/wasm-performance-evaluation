import { ChangeEvent, useEffect, useState } from "react";
import { ITERATIONS, USER_AMOUNTS } from "./lib/experiment";
import measureTime from "./lib/measureTime";
import dataToCsv from "./lib/toCsv";

const wasm = import("wasm");

const Users: React.FC = () => {
    return <div id="App" />;
};

const Wasm: React.FC = () => {
    const [csvUrl, setCsvUrl] = useState<string>();
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
            module.render_users();
            return sortingTime;
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
        const results: { [userAmount: number]: number[] } = USER_AMOUNTS.reduce(
            (prevValue, currentValue) => ({ ...prevValue, [currentValue]: [] }),
            {}
        );
        for (const amount of USER_AMOUNTS) {
            for (let iteration = 0; iteration < ITERATIONS; iteration++) {
                const sortingTime = await updateUserList(amount.toString());
                results[amount].push(sortingTime);
            }
        }
        setCsvUrl(dataToCsv(results));
    };

    return (
        <>
            <button onClick={runExperiments}>Run experiments</button>
            <button onClick={refresh}>Trigger refresh</button>
            <input min={0} type="number" value={amount.toString()} onChange={onAmountChange} />
            <br />
            {csvUrl && (
                <a href={csvUrl} download={"wasm-experiment-results.csv"}>
                    Download csv results
                </a>
            )}
            <Users />
        </>
    );
};

export default Wasm;

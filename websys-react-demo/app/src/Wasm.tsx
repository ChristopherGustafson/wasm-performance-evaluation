import { ChangeEvent, useEffect, useState } from "react";
import measureTime from "./lib/measureTime";

const wasm = import("wasm");

const Users: React.FC = () => {
    return <div id="App" />;
};

const Wasm: React.FC = () => {
    const [amount, setAmount] = useState("100");

    useEffect(() => {
        wasm.then((module) => {
            module.init();
        });
    }, []);

    const updateUserList = (value: string) => {
        const parsedValue = value === "" ? 0 : parseInt(value);
        wasm.then((module) => {
            module.generate_users(parsedValue);
            measureTime(module.sort_users, `[WASM] sort ${parsedValue} users`);
            module.render_users();
        });
    };

    const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
        updateUserList(event.target.value);
    };

    const refresh = () => {
        updateUserList(amount);
    };

    return (
        <>
            <button onClick={refresh}>Trigger refresh</button>
            <input min={0} type="number" value={amount.toString()} onChange={onAmountChange} />
            <Users />
        </>
    );
};

export default Wasm;

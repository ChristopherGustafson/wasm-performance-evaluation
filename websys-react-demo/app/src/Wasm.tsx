import { ChangeEvent, useEffect, useState } from "react";

type ChangeAmountCallback = (amount: number) => void;

const Wasm = () => {
    const [changeAmountCallback, setChangeAmountCallback] = useState<ChangeAmountCallback>();
    const [amount, setAmount] = useState(100);

    useEffect(() => {
        import("wasm").then((module) => {
            const cb: ChangeAmountCallback = module.init(100);
            setChangeAmountCallback(() => cb);
        });
    }, []);

    const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value);
        setAmount(newValue);
        changeAmountCallback && changeAmountCallback(newValue);
    };
    return (
        <>
            {!!changeAmountCallback && <input type="number" value={amount} onChange={onAmountChange} />}
            <div id="App" />
        </>
    );
};

export default Wasm;

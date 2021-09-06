import { ChangeEvent, useEffect, useState } from "react";

const calculateResult = async (a: number, b: number) => {
    const wasm = await import("wasm");
    return wasm.add_two_ints(a, b);
};

const App = () => {
    const [state, setState] = useState({ a: 0, b: 0 });
    const [result, setResult] = useState(0);

    const handleChange = (id: keyof typeof state) => (event: ChangeEvent<HTMLInputElement>) => {
        setState((prev) => ({ ...prev, [id]: event.target.value }));
    };

    useEffect(() => {
        calculateResult(state.a, state.b).then(setResult);
    }, [state]);

    return (
        <div className="App">
            <input type="number" value={state.a} onChange={handleChange("a")} />
            <input type="number" value={state.b} onChange={handleChange("b")} />

            <div>
                {state.a} + {state.b} = {result}
            </div>
        </div>
    );
};

export default App;

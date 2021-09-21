import { ChangeEvent, useState } from "react";
import Js from "./Js";
import Wasm from "./Wasm";

enum Implementation {
    WASM = "WASM",
    JS = "JS",
}

const App = () => {
    const [implementation, setImplementation] = useState<Implementation>(Implementation.WASM);

    const getImplementation = () => {
        switch (implementation) {
            case Implementation.WASM:
                return <Wasm />;
            case Implementation.JS:
                return <Js />;
        }
    };

    const onSelectImplementation = (event: ChangeEvent<HTMLSelectElement>) => {
        setImplementation(event.target.value as Implementation);
    };

    return (
        <div>
            <select onChange={onSelectImplementation}>
                {Object.values(Implementation).map((impl) => {
                    return <option value={impl}>{impl}</option>;
                })}
            </select>
            <br />
            {getImplementation()}
        </div>
    );
};

export default App;

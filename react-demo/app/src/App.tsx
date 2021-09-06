const App = () => {
    import("wasm").then((module) => {
        console.log(module);
    });
    return <div className="App"></div>;
};

export default App;

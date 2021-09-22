/**
 * Execute a function and measures the time it takes to fully execute that function using `performance.now()`
 * @param {(...args: Args) => ReturnType} func The function
 * @param {string} label Label of the output which is logged to the console
 * @param {...Args} args List of arguments passed to the function.
 * @returns {[ReturnType, number]} A tuple with the return value of the function as the first value and the time it took to execute as the second
 */
function measureTime<ReturnType, Args extends Array<any>>(
    func: (...args: Args) => ReturnType,
    label: string,
    ...args: Args
): [ReturnType, number] {
    const start = window.performance.now();
    const ret = func(...args);
    const end = window.performance.now();
    const elapsed = end - start;
    console.log(`${label}: ${elapsed}ms`);
    return [ret, elapsed];
}

export default measureTime;

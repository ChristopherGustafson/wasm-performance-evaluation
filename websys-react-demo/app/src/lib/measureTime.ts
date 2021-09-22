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

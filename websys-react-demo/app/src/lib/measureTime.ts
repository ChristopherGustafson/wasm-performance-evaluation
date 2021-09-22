function measureTime<ReturnType, Args extends Array<any>>(
    func: (...args: Args) => ReturnType,
    label: string,
    ...args: Args
): ReturnType {
    console.time(label);
    const ret = func(...args);
    console.timeEnd(label);
    return ret;
}

export default measureTime;

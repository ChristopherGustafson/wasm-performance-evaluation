export type Cmp<T> = (a: T, b: T) => -1 | 0 | 1;

function swap<T>(arr: Array<T>, i: number, j: number): void {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function partition<T>(arr: Array<T>, low: number, high: number, cmp: Cmp<T>): number {
    let pivot = arr[high];

    let i = low - 1;
    for (let j = low; j <= high; j++) {
        if (cmp(arr[j], pivot) <= 0) {
            i += 1;
            swap(arr, i, j);
        }
    }
    return i;
}

function quickSortInner<T>(arr: Array<T>, low: number, high: number, cmp: Cmp<T>): void {
    if (low >= 0 && high >= 0 && low < high) {
        let p = partition(arr, low, high, cmp);
        quickSortInner(arr, low, p - 1, cmp);
        quickSortInner(arr, p + 1, high, cmp);
    }
}

function quickSort<T>(arr: Array<T>, cmp: Cmp<T>): Array<T> {
    quickSortInner(arr, 0, arr.length - 1, cmp);
    return arr;
}

export default quickSort;

use core::cmp::Ordering;

fn partition<T>(arr: &mut Vec<T>, low: isize, high: isize, cmp: fn(&T, &T) -> Ordering) -> isize {
    let pivot = high as usize;

    let mut i = low - 1;

    for j in low..(high + 1) {
        let ord = cmp(&arr[j as usize], &arr[pivot]);
        if ord == Ordering::Less || ord == Ordering::Equal {
            i += 1;
            arr.swap(i as usize, j as usize);
        }
    }

    i
}

fn quick_sort_inner<T>(arr: &mut Vec<T>, low: isize, high: isize, cmp: fn(&T, &T) -> Ordering) {
    if low >= 0 && high >= 0 && low < high {
        let p = partition(arr, low, high, cmp);
        quick_sort_inner(arr, low, p - 1, cmp);
        quick_sort_inner(arr, p + 1, high, cmp)
    }
}

pub fn quick_sort<T>(arr: &mut Vec<T>, cmp: fn(&T, &T) -> Ordering) {
    let length = arr.len();
    quick_sort_inner(arr, 0, (length - 1) as isize, cmp);
}

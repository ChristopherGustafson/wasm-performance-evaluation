export enum Implementation {
    Native,
    QuickSort,
}
export const implementations = Object.entries(Implementation).filter((implementation) => {
    return isNaN(parseInt(implementation[0]));
}) as [string, Implementation][];

export const implementationName = (implementation: Implementation) => {
    switch (implementation) {
        case Implementation.Native:
            return "native";
        case Implementation.QuickSort:
            return "quick-sort";
    }
};

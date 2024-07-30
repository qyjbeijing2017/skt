export enum SktStorageObjectState {
    NEW = 0,
    READ = 1,
    CHANGED = 2,
}

export interface SktStorageObjectSerialized {
    key: string;
    collection: string;
}

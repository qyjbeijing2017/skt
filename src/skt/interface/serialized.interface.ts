export type SktId = string;
export type SktSerializedBaseField =  number | string | boolean | null | undefined;
export type SktSerializedField = SktSerializedBaseField | SktSerializedBaseField[] | SktId | SktId[];

export interface SktSerialized {
    [key: string]: SktSerializedField;
}

export interface SktSerializedObject {
    sktId: string;
    objects: {
        [key: string]: SktSerialized
    }
}

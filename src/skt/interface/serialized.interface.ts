export type SktId = string | undefined | null;
export type SktSerializedBaseField =  number | string | boolean | null | undefined | object;
export type SktSerializedField = SktSerializedBaseField | SktSerializedBaseField[] | SktId | SktId[];

export interface SktSerialized {
    [key: string]: SktSerializedField;
}

export interface SktSerializedObject extends nkruntime.MatchState {
    sktId: SktId;
    objects: {
        [key: string]: SktSerialized
    }
}

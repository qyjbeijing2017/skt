export interface SktSerializedObject {
    [key: string]: any;
}

export interface SktSerialized {
    sktId: string;
    object: {
        [key: string]: SktSerializedObject;
    }
}
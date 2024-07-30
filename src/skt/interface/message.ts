export interface MessageIn {
    opCode: number;
    data: any;
    sender: nkruntime.Presence;
}

export interface MessageOut {
    opCode: number;
    data: any;
    receiver: nkruntime.Presence[];
}
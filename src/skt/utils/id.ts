import { SktId } from "../interface/serialized.interface";
import { randomString } from "./random-string";

export function createStringSktId(): SktId {
    return randomString(4);
}
import { SktId } from "../interface/serialized.interface";
import { randomString } from "./random-string";

export function createSktId(): SktId {
    return randomString(4);
}
import { SktProperty } from "./decorator/property";
import { SktLogger } from "./logger";
import { SktSerializable } from "./serializable";

export class SktGameObject extends SktSerializable {
    @SktProperty()
    private _started: boolean = false;
    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
    ) {
        super(nk, logger);
    }

    start() {
    }

    update() {
    }

    destroy() {
    }

    onDestroy() {
    }
}
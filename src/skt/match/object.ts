import { sktGetProperties } from "../decorator/meta-data";
import { SktProperty } from "../decorator/property";
import { isParent } from "../decorator/type-instance-of";
import { SktLogger } from "../logger";
import { SktSerializable } from "../serializable";
import { SktMatch } from "./match";

export class SktObject extends SktSerializable {
    @SktProperty()
    private _started: boolean = false;
    constructor(
        nk: nkruntime.Nakama,
        logger: SktLogger,
        readonly sktMatch: SktMatch
    ) {
        super(nk, logger);
    }

    get children(): SktObject[] {
        const property = sktGetProperties(this.classConstructor);
        return property.filter((prop) => {
            if(isParent(prop.type, SktObject)) {
                return true;
            }
            return false;
        }).map((prop) => {
            return this[prop.key] as SktObject;
        });
    }

    start() {

    }

    handleStart() {
        this.children.forEach((child) => {
            child.handleStart();
        });
        if (this._started) {
            return;
        }
        this.start();
        this._started = true;
    }

    update() {
    }

    handleUpdate() {
        this.children.forEach((child) => {
            child.update();
        });
        this.update();
    }

    onDestroy() {
    }

    private _destroyed: boolean = false;
    destroy() {
        if (this._destroyed) {
            return;
        }
        this.onDestroy();
        this._destroyed = true;
    }
}
import { SktClass } from "../decorator/class";
import { sktGetProperties } from "../decorator/meta-data";
import { SktProperty } from "../decorator/property";
import { isParent } from "../decorator/type-instance-of";
import { SktSerializedObject } from "../interface/serialized.interface";
import { SktLogger } from "../logger";
import { SktSerializable } from "../serializable";
import { SktObject } from "./object";

export interface SktMatchOptions {
    ctx: nkruntime.Context;
    logger: nkruntime.Logger;
    nk: nkruntime.Nakama;
    params?: { [key: string]: any };
    dispatcher?: nkruntime.MatchDispatcher;
    tick?: number;
    state?: SktSerializedObject;
    presences?: nkruntime.Presence[];
    messages?: nkruntime.MatchMessage[];
    metadata?: { [key: string]: any };
    date?: string;
}

@SktClass()
export class SktMatch extends SktSerializable {
    protected tickRate: number = 1;
    @SktProperty()
    private _isRunning: boolean = true;
    get isRunning(): boolean {
        return this._isRunning;
    }
    exit() {
        this._isRunning = false;
    }

    get name(): string {
        return this.constructor.name;
    }

    @SktProperty()
    readonly presences: {
        [userId: string]: nkruntime.Presence;
    } = {};

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

    constructor(private readonly option: SktMatchOptions) {
        super(option.nk, new SktLogger(option.logger));
    }

    protected onPlayerJoin(presence: nkruntime.Presence): void {}

    protected onPlayerLeave(presence: nkruntime.Presence): void {}

    protected onLoop(): void {}

    protected onInit(): void {}

    init(): { state: SktSerializedObject; tickRate: number; label: string; } {
        this.onInit();
        const state = this.serialize();
        return {
            state: state,
            tickRate: this.tickRate,
            label: JSON.stringify({
                sktId: this.sktId,
                name: this.name,
            }),
        };
    }

    join(): { state: SktSerializedObject } | null {
        this.deserialize(this.option.state!);
        this.option.presences?.forEach((presence) => {
            this.presences[presence.userId] = presence;
            this.onPlayerJoin(presence);
        });
        return {
            state: this.serialize(),
        }
    }

    leave(): { state: SktSerializedObject } | null {
        this.deserialize(this.option.state!);
        this.option.presences?.forEach((presence) => {
            this.onPlayerLeave(presence);
        });
        return {
            state: this.serialize(),
        }
    }

    loop(): {state: SktSerializedObject} | null {
        this.deserialize(this.option.state!);
        if(!this.isRunning) {
            return null
        }

        this.children.forEach((child) => {
            child.handleStart();
        });
        this.children.forEach((child) => {
            child.handleUpdate();
        });
        this.onLoop();
        return {
            state: this.serialize(),
        };
    }

    joinAttempt(): { state: SktSerializedObject, accept: boolean } | null {
        this.deserialize(this.option.state!);
        return {
            state: this.serialize(),
            accept: true,
        };
    }

    signal(): { state: SktSerializedObject } | null {
        this.deserialize(this.option.state!);
        return {
            state: this.serialize(),
        };
    }

    terminate(): { state: SktSerializedObject } | null {
        this.deserialize(this.option.state!);
        return {
            state: this.serialize(),
        };
    }

}
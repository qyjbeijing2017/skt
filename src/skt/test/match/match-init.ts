import { SktSerializedObject } from "../../interface/serialized.interface";
import { SktMatch } from "../../match/match";

const Match = SktMatch;

function matchInit(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    params: { [key: string]: string; }
): { state: SktSerializedObject; tickRate: number; label: string; } {
    return new Match({
        ctx,
        logger,
        nk,
        params,
    }).init();
}

function matchJoin(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    dispatcher: nkruntime.MatchDispatcher,
    tick: number,
    state: SktSerializedObject,
    presences: nkruntime.Presence[]
): { state: SktSerializedObject; } | null {
    return new Match({
        ctx,
        logger,
        nk,
        dispatcher,
        tick,
        state,
        presences,
    }).join();
}

function matchLeave(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    dispatcher: nkruntime.MatchDispatcher,
    tick: number,
    state: SktSerializedObject,
    presences: nkruntime.Presence[]
): { state: SktSerializedObject; } | null {
    return new Match({
        ctx,
        logger,
        nk,
        dispatcher,
        tick,
        state,
        presences,
    }).leave();
}

function matchLoop(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    dispatcher: nkruntime.MatchDispatcher,
    tick: number,
    state: SktSerializedObject,
    messages: nkruntime.MatchMessage[]
): { state: SktSerializedObject; } | null {
    return new Match({
        ctx,
        logger,
        nk,
        dispatcher,
        tick,
        state,
        messages,
    }).loop();
}

function matchJoinAttempt(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    dispatcher: nkruntime.MatchDispatcher,
    tick: number,
    state: SktSerializedObject,
    presence: nkruntime.Presence,
    metadata: { [key: string]: any }
): { state: SktSerializedObject; accept: boolean; } | null {
    return new Match({
        ctx,
        logger,
        nk,
        dispatcher,
        tick,
        state,
        metadata,
    }).joinAttempt();
}

function matchSignal(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    dispatcher: nkruntime.MatchDispatcher,
    tick: number,
    state: SktSerializedObject,
    data: string
): { state: SktSerializedObject; } | null {
    return new Match({
        ctx,
        logger,
        nk,
        dispatcher,
        tick,
        state,
    }).signal();
}

function matchTerminate(
    ctx: nkruntime.Context, 
    logger: nkruntime.Logger, 
    nk: nkruntime.Nakama, 
    dispatcher: nkruntime.MatchDispatcher, 
    tick: number, 
    state: SktSerializedObject
): { state: SktSerializedObject; } | null {
    return new Match({
        ctx,
        logger,
        nk,
        dispatcher,
        tick,
        state,
    }).terminate();
}

export const sktTestMatch: nkruntime.MatchHandler<SktSerializedObject> = {
    matchInit,
    matchJoin,
    matchLeave,
    matchLoop,
    matchJoinAttempt,
    matchSignal,
    matchTerminate,
};
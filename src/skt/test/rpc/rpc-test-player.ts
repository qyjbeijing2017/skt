

export const rpcTestPlayer: nkruntime.RpcFunction = (
    ctx,
    logger,
    nk,
    payload
) => {
    
    return JSON.stringify({
        user: true,
    });
}
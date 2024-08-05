function InitModule(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    initializer: nkruntime.Initializer
) {
    try {
    } catch (error) {
        logger.error("Error initializing module", error.message);
    }
}

// Reference InitModule to avoid it getting removed on build
!InitModule && InitModule.bind(null);
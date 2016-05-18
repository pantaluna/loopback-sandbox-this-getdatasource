module.exports = function(Checklist) {
    Checklist.observe('before save', function(ctx, next) {
        if (ctx.isNewInstance) {
            ctx.instance.created = new Date();
        } else {
            ctx.instance.updated = new Date();
        }
       next();
    });
};

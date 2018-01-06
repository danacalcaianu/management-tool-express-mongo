const mongoose = require( "mongoose" );

module.exports = ( req, res, next ) => {
    const { projectId } = req.params;
    const { userId } = req.params;
    const Collection = mongoose.model( "Project" );
    return Collection.findOne(
        { id: projectId },
        ( err, found ) => {
            if ( err ) {
                return res.serverError( );
            }
            if ( !( found.addedBy === userId ) ) {
                return res.unauthorized();
            }
            return next();
        },
    );
};

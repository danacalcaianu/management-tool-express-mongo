const co = require( "co" );

exports.saveChangesToModel = ( res, model ) => {
    model.save( ( err, updatedModel ) => {
        if ( err ) {
            return res.validationError( err );
        }
        return res.success( updatedModel );
    } );
};

// exports.queryModel = ( res, model, query ) => model.find(
//     query,
//     ( err, results ) => {
//         if ( err ) {
//             return res.serverError();
//         }
//         return res.success( results );
//     },
// );

// exports.queryModel = ( res, model, query ) => model.find(
//     query ).then( ( results ) => {
//     return res.success( results );
// } );

exports.queryModel = co.wrap( function* ( model, query ) {
    const result = yield model.find( query );
    return result;
} );

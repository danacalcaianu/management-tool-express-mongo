const co = require( "co" );


exports.updateRating = ( movie, rating, username ) => {
    const ratingIndex = movie.getRatingIndex( username );
    if ( ratingIndex === -1 ) {
        movie.addRating( rating, username );
    } else {
        movie.updateRating( rating, ratingIndex );
    }
    movie.updateRatingAverage();
};

exports.saveChangesToModel = ( res, model ) => {
    console.log(model)
    model.save( ( err, updatedModel ) => {
        if ( err ) {
            console.log(err)
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
    const movies = yield model.find( query );
    return movies;
} );

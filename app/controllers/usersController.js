const mongoose = require( "mongoose" );
const { saveChangesToModel, updateRating } = require( "../utilities/index" );

const User = mongoose.model( "User" );
const Project = mongoose.model( "Project" );

/* eslint consistent-return: "off" */
exports.register = ( req, res ) => {
    let { user } = req;
    if ( user ) {
        return res.preconditionFailed( "existing_user" );
    }
    user = new User( req.body );
    user.setId();
    user.password = req.hash;
    saveChangesToModel( res, user );
};

exports.login = ( req, res ) => {
    const { token } = req;

    return res.json( {
        success: true,
        token,
    } );
};

exports.edit = ( req, res ) => {
    const { user } = req;

    user.editUser( req.body );
    saveChangesToModel( res, user );
};

exports.delete = ( req, res ) => {
    const { user } = req;

    user.deleted = true;
    saveChangesToModel( res, user );
};

exports.addProject = ( req, res ) => {
    const { user } = req;
    let { project } = req;

    if ( project ) {
        return res.preconditionFailed( "existing_project" );
    }
    project = new Project( req.body );
    project.addOwner( user.id );
    project.addId( );
    saveChangesToModel( res, project );
};

exports.addSprint = ( req, res ) => {
    const { project } = req;
    const { username } = req.user;
    project.addSprint( req.body, username );
    // updateRating( project, req.body.rating, username );
    console.log(project)
    saveChangesToModel( res, project );
};

exports.editMovie = ( req, res ) => {
    const { movie } = req;
    movie.editMovie( req.body );
    saveChangesToModel( res, movie );
};

exports.removeReview = ( req, res ) => {
    const { movie } = req;
    const { username } = req.user;
    const { reviewId } = req.params;
    const reviewIndex = movie.getReviewIndex( reviewId );

    if ( movie.reviews[ reviewIndex ].author !== username ) {
        return res.unauthorized();
    }
    movie.removeReview( reviewIndex );

    const ratingIndex = movie.getRatingIndex( username );
    movie.deleteRating( ratingIndex );
    movie.updateRatingAverage();

    saveChangesToModel( res, movie );
};

exports.editReview = ( req, res ) => {
    const { movie } = req;
    const { username } = req.user;
    const { reviewId } = req.params;
    const reviewIndex = movie.getReviewIndex( reviewId );

    if ( movie.reviews[ reviewIndex ].author !== username ) {
        return res.unauthorized();
    }
    movie.editReview( req.body, reviewIndex );
    updateRating( movie, req.body.rating, username );

    saveChangesToModel( res, movie );
};

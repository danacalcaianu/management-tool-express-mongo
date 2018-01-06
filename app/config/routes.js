const moviesController = require( "../controllers/moviesController" );
const checkOwnership = require( "../middlewares/checkOwnership" );
const checkRequestParameter = require( "../middlewares/checkRequestParameter" );
const checkUserAccess = require( "../middlewares/checkUserAccess" );

const validateToken = require( "../middlewares/validateToken" );
const checkExistingModel = require( "../middlewares/checkExistingModel" );
const usersController = require( "../controllers/usersController" );
const checkEmailExists = require( "../middlewares/checkEmailExists" );
const checkEmailFormat = require( "../middlewares/checkEmailFormat" );
const checkLoginPassword = require( "../middlewares/checkLoginPassword" );
const assignToken = require( "../middlewares/assignToken" );
const hashPassword = require( "../middlewares/hashPassword" );
const express = require( "express" );

const router = express.Router( );

/**
*    @apiGroup User
*    @api {post} /users/registration Adding an user to the db.
*    @apiParam {String} id  User ID required.
*    @apiParam {String} username  Mandatory  username.
*    @apiParam {String} firstName  Mandatory first name.
*    @apiParam {String} lastName  Mandatory last name.
*    @apiParam {String} email  Mandatory email.
*    @apiExample {response} Example response:
*       {
*         "user": {
*            "id": 123456789,
*            "username": "user123"
*           }
*      }
*/
router.post(
    "/users/registration",
    checkEmailFormat,
    checkExistingModel( "username", "User", "user" ),
    checkEmailExists( "User" ),
    hashPassword,
    usersController.register,
);

/**
*    @apiGroup User
*    @api {post} /users/login User login route.
*    @apiParam {String} id  User ID required.
*    @apiParam {String} username  User username required.
*    @apiParam {String} password  User password required.
*    @apiExample {response} Example response:
*       {
*         "user": {
*            "token": dahljkhajfhajku32974eq9kjh
*
*      }
*/
router.post(
    "/users/login",
    checkExistingModel( "username", "User", "user" ),
    checkLoginPassword,
    checkUserAccess,
    assignToken,
    usersController.login,
);

/**
*    @apiGroup User
*    @api {delete} /users/:userId/deleteProfile Delete an user.
*    @apiParam {String} userId  User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.put(
    "/users/:userId/deleteProfile",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    usersController.delete,
);

/**
*    @apiGroup User
*    @api {delete} /users/:userId/addMovie Add a movie.
*    @apiParam {String} userId  User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.put(
    "/users/:userId/addMovie",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    checkExistingModel( "title", "Movie", "movie" ),
    usersController.addMovie,
);

/**
*    @apiGroup User
*    @api {put} /users/:userId/rateMovie/:movieId Rate a movie.
*    @apiParam {String} userId  User ID required.
*    @apiParam {String} movieId  Movie ID required.
*    @apiBodyExample Example body
*       {
*           rating: "3"
*       }
*/
router.put(
    "/users/:userId/rateMovie/:movieId",
    checkExistingModel( "userId", "User", "user" ),
    // validateToken,
    checkExistingModel( "movieId", "Movie", "movie" ),
    usersController.rateMovie,
);

/**
*    @apiGroup User
*    @api {put} /users/:userId/reviewMovie/:movieId Review a movie.
*    @apiParam {String} userId  User ID required.
*    @apiParam {String} movieId  Movie ID required.
*/
router.put(
    "/users/:userId/reviewMovie/:movieId",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    checkExistingModel( "movieId", "Movie", "movie" ),
    usersController.reviewMovie,
);

/**
*    @apiGroup User
*    @api {put} /users/:userId/editMovie/:movieId Edit a movie.
*    @apiParam {String} userId  User ID required.
*    @apiParam {String} movieId  Movie ID required.
*/
router.put(
    "/users/:userId/editMovie/:movieId",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    checkExistingModel( "movieId", "Movie", "movie" ),
    checkOwnership,
    usersController.editMovie,
);

/**

*    @apiGroup User
*    @api {put} /users/:userId/:movieId/removeReview/:reviewId Remove a review.
*    @apiParam {String} userId User ID required.
*    @apiParam {String} movieId Movie ID required.
*    @apiParam {String} reviewId Review ID required.

*/
router.delete(
    "/users/:userId/:movieId/removeReview/:reviewId",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    checkExistingModel( "movieId", "Movie", "movie" ),
    usersController.removeReview,
);
/*
    *    @apiGroup User
    *    @api {put} /users/:userId/:movieId/spamReview/:reviewId Mark a review as spam.
    *    @apiParam {String} userId  User ID required.
    *    @apiParam {String} movieId Movie ID required.
    *    @apiParam {String} reviewId  Review ID required.
*/
router.put(
    "/users/:userId/:movieId/spamReview/:reviewId",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    checkExistingModel( "movieId", "Movie", "movie" ),
    usersController.markReviewAsSpam,
);

/*
    *    @apiGroup User
    *    @api {put} /users/:userId/:movieId/editReview/:reviewId Edit a review.
    *    @apiParam {String} userId  User ID required.
    *    @apiParam {String} movieId Movie ID required.
    *    @apiParam {String} reviewId  Review ID required.
*/
router.put(
    "/users/:userId/:movieId/editReview/:reviewId",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    checkExistingModel( "movieId", "Movie", "movie" ),
    usersController.editReview,
);

/**
*    @apiGroup Movie
*    @api {get} /movies/:movieId/getMovie Get a movie.
*    @apiParam {String} id  Movie ID required.
*    @apiSampleRequest http://localhost:3030/movies/1223frhs/getMovie
*/
router.get(
    "/movies/:movieId/getMovie",
    checkExistingModel( "movieId", "Movie", "movie" ),
    moviesController.getMovie,
);

/**
*    @apiGroup Movie
*    @api {get} /movies/getAll/:param Get all movies.
*    @apiDescription returns all movies if param is missing, otherwise
*    filters by param value (rating, categories)
*/
router.get(
    "/movies/getAll/:param?",
    checkRequestParameter,
    moviesController.getAllMovies,
);

/**
*    @apiGroup Movie
*    @api {get} /movies/getBatch/:page Get a certain number of movies.
*    @apiDescription returns a limited number of movies based on the page parameter
*/
router.get(
    "/movies/getBatch/:page",
    moviesController.getBatchOfMovies,
);

/**
*    @apiGroup Movie
*    @api {get} /movies/:userId/getUserMovies Get all movies for user.
*    @apiDescription returns all movies for a given user
*    @apiParam {String} id  User ID required.
*/
router.get(
    "/movies/:userId/getUserMovies",
    checkExistingModel( "userId", "User", "user" ),
    validateToken,
    moviesController.getMoviesForUser,
);

module.exports = ( app ) => {
    app.use( "/", router );
};

const projectsController = require( "../controllers/projectsController" );
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
    assignToken,
    usersController.login,
);

/**
*    @apiGroup User
*    @api {delete} /users/:userId/addProject Add a project.
*    @apiParam {String} userId  User ID required.
*    @apiHeaderExample Example header
*       {
*           id:123456789
*       }
*/
router.put(
    "/users/:userId/addProject",
    checkExistingModel( "userId", "User", "user" ),
    // validateToken,
    checkExistingModel( "title", "Project", "project" ),
    usersController.addProject,
);

/**
*    @apiGroup User
*    @api {put} /users/:userId/addSprint/:projectId Add a sprint.
*    @apiParam {String} userId  User ID required.
*    @apiParam {String} projectId  Project ID required.
*/
router.put(
    "/users/:userId/addSprint/:projectId",
    checkExistingModel( "userId", "User", "user" ),
    // validateToken,
    checkExistingModel( "projectId", "Project", "project" ),
    usersController.addSprint,
);

/**
*    @apiGroup User
*    @api {put} /users/:userId/addIssue/:projectId Add an issue.
*    @apiParam {String} userId  User ID required.
*    @apiParam {String} projectId  Project ID required.
*/
router.put(
    "/users/:userId/addIssue/:projectId",
    checkExistingModel( "userId", "User", "user" ),
    // validateToken,
    checkExistingModel( "projectId", "Project", "project" ),
    usersController.addIssue,
);

/**

*    @apiGroup User
*    @api {put} /users/:userId/:projectId/removeSprint/:sprintId Remove a sprint.
*    @apiParam {String} userId User ID required.
*    @apiParam {String} projectId Project ID required.
*    @apiParam {String} sprintwId Sprint ID required.

*/
router.delete(
    "/users/:projectId/removeSprint/:sprintId",
    // checkExistingModel( "userId", "User", "user" ),
    // validateToken,
    checkExistingModel( "projectId", "Project", "project" ),
    usersController.removeSprint,
);

/*
    *    @apiGroup User
    *    @api {put} /users/:userId/:projectId/editSprint/:sprintId Edit a sprint.
    *    @apiParam {String} userId  User ID required.
    *    @apiParam {String} projectId Project ID required.
    *    @apiParam {String} SprintId  Sprint ID required.
*/
router.put(
    "/users/:userId/:projectId/editSprint/:sprintId",
    checkExistingModel( "userId", "User", "user" ),
    // validateToken,
    checkExistingModel( "projectId", "Project", "project" ),
    usersController.editSprint,
);

/**
*    @apiGroup Project
*    @api {get} /projects/:projectId/getProject Get a project.
*    @apiParam {String} id  Project ID required.
*    @apiSampleRequest http://localhost:3030/projects/1223frhs/getProject
*/
router.get(
    "/projects/:projectId/getProject",
    checkExistingModel( "projectId", "Project", "project" ),
    projectsController.getProject,
);

/**
*    @apiGroup Project
*    @api {get} /projects/getAll/:param Get all projects.
*    @apiDescription returns all projects
*/
router.get(
    "/projects/getAll/",
    projectsController.getAllProjects,
);

module.exports = ( app ) => {
    app.use( "/", router );
};

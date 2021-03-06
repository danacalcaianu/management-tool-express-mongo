const mongoose = require( "mongoose" );
const { saveChangesToModel } = require( "../utilities/index" );

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
    const { user }= req;
    return res.json( {
        success: true,
        token,
        user,
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
    saveChangesToModel( res, project );
};

exports.addIssue = ( req, res ) => {
    const { project } = req;
    const { username } = req.user;
    project.addIssue( req.body, username );
    saveChangesToModel( res, project );
};

exports.removeSprint = ( req, res ) => {
    const { project } = req;
    const { sprintId } = req.params;
    const sprintIndex = project.getSprintIndex( sprintId );

    project.removeSprint( sprintIndex );

    saveChangesToModel( res, project );
};

exports.editIssue = ( req, res ) => {
    const { project } = req;
    const { issueId } = req.params;
    const issueIndex = project.getIssueIndex( issueId );

    project.editIssue( req.body, issueIndex );

    saveChangesToModel( res, project );
};

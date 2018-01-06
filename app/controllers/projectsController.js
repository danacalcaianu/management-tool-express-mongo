const { queryModel } = require( "../utilities" );
const mongoose = require( "mongoose" );

const Project = mongoose.model( "Project" );
exports.getProject = ( req, res ) => {
    const { project } = req;
    if ( !project ) {
        return res.notFound();
    }
    return res.success( project );
};

exports.getAllProjects = ( req, res ) => {
    const field = undefined;
    const { param } = req.params;
    const projects = queryModel( Project, field );
    projects
        .then( ( results ) => {
            if ( param ) {
                const final = results.filter( ( item ) => item.title.toLowerCase().indexOf( param.toLowerCase() ) !== -1 );
                res.success( final );
                return;
            }
            res.success( results );
        } )
        .catch( ( err ) => res.send( err ) );
};

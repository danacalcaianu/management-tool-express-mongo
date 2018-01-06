const mongoose = require( "mongoose" );
const uid = require( "uid" );

const { Schema } = mongoose;

const sprintSchema = new Schema( {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
} );

const projectSchema = new Schema( {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    addedBy: String, // userId
    sprints: { type: [ sprintSchema ], default: [ ] },
}, { usePushEach: true } );

/* eslint func-names : off */
projectSchema.methods.createProject = function( data ) {
    this.title = data.title;
    this.description = data.description;
    this.categories = data.categories;
    return this;
};

projectSchema.methods.addSprint = function( body, author ) {
    const { title, description } = body;
    const sprint = {
        title,
        description,
        author,
        id: uid( 10 ),
    };
    return this.sprints.push( sprint );
};

projectSchema.methods.getSprintIndex = function( sprintId ) {
    const index = this.sprints.map( sprint => sprint.id ).indexOf( sprintId );
    return index;
};

projectSchema.methods.removeSprint = function( sprintIndex ) {
    this.sprints.splice( sprintIndex, 1 );
};

projectSchema.methods.addOwner = function( userId ) {
    this.addedBy = userId;
};

projectSchema.methods.addId = function( ) {
    this.id = uid( 10 );
};

projectSchema.methods.editSprint = function( body, index ) {
    const { title, description } = body;
    const sprint = this.sprints[ index ];
    sprint.title = title || sprint.title;
    sprint.description = description || sprint.description;
};

module.exports = mongoose.model( "Project", projectSchema );

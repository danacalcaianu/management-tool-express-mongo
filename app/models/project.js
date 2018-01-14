const mongoose = require( "mongoose" );
const uid = require( "uid" );

const { Schema } = mongoose;

const issueSchema = new Schema( {
    id: { type: String, required: true },
    type: {
        type: String,
        enum: [ "feature", "bug", "task" ],
        required: true,
    },
    title: { type: String, required: true },
    sprint: { type: String, required: true },
    createdBy: String,
    assignee: String,
    description: String,
    status: {
        type: String,
        enum: [ "new", "in progress", "feedback", "rework", "resolved" ],
        required: true,
    },
    tasks: String,
    comments: String,

}, {
    timestamps: true,
} );

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
    issues: { type: [ issueSchema ], default: [ ] },
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

projectSchema.methods.addIssue = function( body, createdBy ) {
    const {
        title, description, sprint, type, assignee, status, tasks, comments,
    } = body;
    const newSprint = {
        title,
        type,
        description,
        sprint,
        createdBy,
        assignee,
        status,
        tasks,
        comments,
        id: uid( 10 ),
    };
    return this.issues.push( newSprint );
};

projectSchema.methods.getSprintIndex = function( sprintId ) {
    const index = this.sprints.map( sprint => sprint.id ).indexOf( sprintId );
    return index;
};

projectSchema.methods.getIssueIndex = function( issueId ) {
    const index = this.issues.map( issue => issue.id ).indexOf( issueId );
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
/* eslint complexity : off */
projectSchema.methods.editIssue = function( body, index ) {
    const {
        title, description, type, sprint, status, assignee,
    } = body;

    const issue = this.issues[ index ];

    issue.title = title || issue.title;
    issue.description = description || issue.description;
    issue.type = type || issue.type;
    issue.sprint = sprint;
    issue.status = status || issue.status;
    if ( assignee ) {
        issue.assignee = assignee || issue.assignee;
    }
};

module.exports = mongoose.model( "Project", projectSchema );

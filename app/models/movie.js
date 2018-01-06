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
} );

/* eslint func-names : off */
projectSchema.methods.createMovie = function( data ) {
    this.title = data.title;
    this.description = data.description;
    this.categories = data.categories;
    return this;
};

projectSchema.methods.addReview = function( body, author ) {
    const { title, description, rating } = body;
    const review = {
        title,
        description,
        rating,
        author,
        id: uid( 10 ),
    };
    return this.reviews.push( review );
};

projectSchema.methods.getReviewIndex = function( reviewId ) {
    const index = this.reviews.map( review => review.id ).indexOf( reviewId );
    return index;
};

projectSchema.methods.getReviewForIndex = function( reviewIndex ) {
    const review = this.reviews[ reviewIndex ];
    return review;
};

projectSchema.methods.removeReview = function( reviewIndex ) {
    this.reviews.splice( reviewIndex, 1 );
};

projectSchema.methods.addOwner = function( userId ) {
    this.addedBy = userId;
};

projectSchema.methods.addId = function( ) {
    this.id = uid( 10 );
};

projectSchema.methods.addRating = function( rating, author ) {
    const newRating = {
        rating,
        owner: author,
    };
    this.ratings.push( newRating );
};

projectSchema.methods.updateRating = function ( newRating, index ) {
    const currentRating = this.ratings[ index ];
    currentRating.rating = newRating;
};

projectSchema.methods.getRatingIndex = function( owner ) {
    const index = this.ratings.map( rating => rating.owner ).indexOf( owner );
    return index;
};

projectSchema.methods.deleteRating = function ( ratingIndex ) {
    this.ratings.splice( ratingIndex, 1 );
};

projectSchema.methods.updateRatingAverage = function() {
    let average = 0;
    if ( this.ratings.length === 0 ) {
        this.averageRating = 0;
        return;
    }
    const total = this.ratings
        .map( ( object ) => object.rating )
        .reduce( ( acc, current ) => acc + current, 0 );

    average = total / this.ratings.length;
    this.averageRating = average.toFixed( 2 );
};

projectSchema.methods.editMovie = function( body ) {
    const {
        title, director, picture, releaseDate, description, categories, cast,
    } = body;
    this.title = title || this.title;
    this.director = director;
    this.releaseDate = releaseDate;
    this.description = description || this.description;
    this.picture = picture;
    this.categories = categories || this.categories;
    this.cast = cast;
};

projectSchema.methods.spamReview = function( reviewIndex ) {
    const review = this.reviews[ reviewIndex ];
    review.markedAsSpam = true;
};

projectSchema.methods.editReview = function( body, index ) {
    const { title, description, rating } = body;
    const review = this.reviews[ index ];
    review.title = title || review.title;
    review.description = description || review.description;
    review.rating = rating;
};

module.exports = mongoose.model( "Movie", projectSchema );

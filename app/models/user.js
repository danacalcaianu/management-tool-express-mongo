const mongoose = require( "mongoose" );
const bcrypt = require( "bcrypt" );
const uid = require( "uid" );

const { Schema } = mongoose;

const userSchema = new Schema( {
    id: { type: String },
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: [ "male", "female" ] },
    avatar: { type: String },
}, {
    timestamps: true,
} );
/* eslint func-names : off */
userSchema.methods.setId = function () {
    this.id = uid( 10 );
};

userSchema.methods.setPass = function( password ) {
    const saltRounds = 10;
    bcrypt.hash( password, saltRounds, function( err, hash ) {
        this.password = hash;
    } );
};

userSchema.methods.setFullName = function( ) {
    return `${ this.firstName } ${ this.lastName }`;
};

module.exports = mongoose.model( "User", userSchema );

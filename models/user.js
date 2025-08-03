import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true,
    },

    lastName: {
        type: String,
        required: true, 
    },

    username: {
        type: String,
        required: true, 
        unique: true,
    },

    password: {
        type: String,
        required: true,
  },

    role: {
        type: String, 
        enum: ["instructor", "student"],
        required: true,
    }
});

// Define a static method on the userSchema called 'hashPassword'.
// Static methods are called on the Model itself (e.g., User.hashPassword()), not on instances of the model.
// This asynchronous function takes a plain text password and returns a hashed version of it.
userSchema.statics.hashPassword = async function (password) {
  // bcrypt.hash takes the plain password and a salt round (cost factor, here 10).
  // Higher salt rounds make hashing slower but more secure.
  return await bcrypt.hash(password, 10);
};

// Define an instance method on the userSchema called 'isValidPassword'.
// Instance methods are called on individual documents (instances of the User model, e.g., user.isValidPassword()).
// This asynchronous function takes a plain text password and compares it to the stored hashed password for this user instance.
userSchema.methods.isValidPassword = async function (password) {
  // `this.password` refers to the hashed password stored in the current user document.
  // bcrypt.compare securely compares the plain password with the stored hash.
  // It returns true if they match, false otherwise.
  return await bcrypt.compare(password, this.password);
};

// Create a Mongoose model named 'User' based on the userSchema.
// Models are constructors compiled from Schema definitions. An instance of a model is called a document.
// Mongoose will create/use a collection named 'users' (pluralized and lowercased version of 'User') in MongoDB.
const User = mongoose.model("User", userSchema);

// Export the User model so it can be used in other parts of the application (e.g., in passport-config.js or auth routes).
export default User;
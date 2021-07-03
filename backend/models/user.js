const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    password: { type: String, required: true },
    resetToken: { type: String, required: false },
    resetTokenExpiration: { type: String, required: false },
});

module.exports = mongoose.model('User', userSchema);
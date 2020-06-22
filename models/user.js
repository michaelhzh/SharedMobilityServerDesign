const mongoose = require ('mongoose');

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username : {
        type: String,
        required: true,
        unique: true,
        //could include a match overhere for email validation if we want to make username to email
    },
    password : {
        type: String,
        required: true
    }
});

module.exports =  mongoose.model('User', UserSchema);
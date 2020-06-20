const mongoose = require ('mongoose');

const PostSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : {
        type: String,
        required: true
    },
    destination : {
        type: String,
        required: true
    },
    from : {
        type: String,
        required: true
    },
    time :{
        type: Number,
        min: 0,
        default : 120
    },
    DOT : {
        type: Date,
        default : Date.now
    }
});

module.exports =  mongoose.model('Posts', PostSchema);
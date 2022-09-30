import mongoose from "mongoose";


const CommentsSchema = new mongoose.Schema({
    id: {type: String, required: true},
    fullName : {type: String, required: true},
    avatarUrl : {type: String},
    text : {type: String, required:true}
}, {
    timestamps: true,
})

export default mongoose.model('Comments', CommentsSchema)
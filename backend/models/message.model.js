import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        ref: "User",
        required: true
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})

const Message = mongoose.model("Message", messageSchema)

export default Message;
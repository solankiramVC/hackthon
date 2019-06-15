import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import mongooseTimestamp from 'mongoose-timestamp';
const Schema = mongoose.Schema;

const messagesSchema = mongoose.Schema({
    message: {
        type: String
    },
    key:String,
    accessLimit:Number,
    downlaodLimit:Number,
    timeLimit: String,
    accessCount: {type: Number, default :0},
    downlaodCount:{type: Number, default :0},
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    receiverId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    isExpire: {type: String, enum: [0, 1], default:0},
}, {
        collection: 'messages'
    });


messagesSchema.plugin(mongooseTimestamp);
const messagesModel = mongoose.model('messages', messagesSchema);
export default messagesModel;
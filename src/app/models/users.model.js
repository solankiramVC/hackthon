import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import mongooseTimestamp from 'mongoose-timestamp';
const Schema = mongoose.Schema;

const UsersSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    uId : {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    oneTimeToken: {},
    status: {
        type: String,
        enum: [0, 1, 2]
    },
}, {
        collection: 'Users'
    });


UsersSchema.plugin(mongooseTimestamp);
UsersSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UsersSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

const UsersModel = mongoose.model('Users', UsersSchema);

UsersModel.saveUser = (saveToUser) => {
    return saveToUser.save();
}

UsersModel.filter = (filterParam) => {
    return UsersModel.find(filterParam);
}
export default UsersModel;
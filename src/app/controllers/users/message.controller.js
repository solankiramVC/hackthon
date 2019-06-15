import JWT from 'jsonwebtoken';
import AES from 'aes-es';
import UserModel from '../../models/users.model';
import messageModel from '../../models/message.model';
import config from '../../../config/config';
import SMTP from '../../../utils/email';
import Message from '../../../config/message';
import util from 'util';
import crypto from 'crypto';
import assert from  'assert';

exports.index = (req, res)=>{
    try{
        res.render('index.ejs');
    }catch(err) {
        console.log('err', err);
        res.status(400).send({
            code: 401,
            message: Message.errorMessage.userNotFound,
            data: [],
            error: []
        });
    }
}
exports.save = (req, res) => {
    try {
        const params =  req.body;
        const  algorithm = 'aes256';
        const  key = "asdadjsadkljkljlkj";
        let iv = crypto.randomBytes(16);
        const randomString  = makeid(32)
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(randomString), iv);
        let encrypted = cipher.update(params.message);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        params.key = randomString;
        params.message = iv.toString('hex') + ':' + encrypted.toString('hex');
        const messageForSave = messageModel(params);
        messageForSave.save().then((message) => {
            res.render('save', {key: randomString});
        }).catch((err) => {
            res.status(400).send({
                code: 401,
                message: Message.errorMessage.userNotFound,
                data: [],
                error: []
            });
        });
    }catch(err){
        console.log('err', err)
        res.status(400).send({
            code: 401,
            message: Message.errorMessage.userNotFound,
            data: [],
            error: []
        });
    }
}

exports.getUser = (req, res) => {
    try{
        const query = req.query;
        const id = query.id;
        messageModel.find({key : id, isExpire:0})
        .then((user) => {
            if(user.length > 0) {
                let textParts = user[0].message.split(':');
                let iv = Buffer.from(textParts.shift(), 'hex');
                let encryptedText = Buffer.from(textParts.join(':'), 'hex');
                let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(id.toString()), iv);
                let decrypted = decipher.update(encryptedText);
                decrypted = Buffer.concat([decrypted, decipher.final()]);
                const accessCount = Number(user[0].accessCount) + 1;
                let updateArray =  {}
                
                // console.log('accessCount', accessCount);
                console.log('Number(accessCount) >= Number(user.accessLimit)', Number(accessCount) >= Number(user.accessLimit))
                console.log('Number(accessCount)', Number(accessCount))
                console.log(' Number(user.accessLimit)', Number(user.accessLimit))
                if(Number(accessCount) >= Number(user[0].accessLimit)) {
                    console.log('accessCount', accessCount);
                    updateArray.isExpire = 1;
                    updateArray.message = "";
                }
                updateArray.accessCount = accessCount;
                console.log('updateArray', updateArray);
                messageModel.findByIdAndUpdate(user[0]._id, updateArray).
                then((updateMessage) => {
                    user.message = decrypted;
                    res.render('message', {message: decrypted})
                }).catch((err) => {
                    console.log('error', err)
                    res.status(400).send({
                        code: 401,
                        message: Message.errorMessage.userNotFound,
                        data: [],
                        error: []
                    });
                });
            } else {
                res.send({})
            }
            
        }).catch((err) => {
            console.log('error', err)
            res.status(400).send({
                code: 401,
                message: Message.errorMessage.userNotFound,
                data: [],
                error: []
            });
        });
    }catch(err) {
        console.log('error', err)
        res.status(400).send({
            code: 401,
            message: Message.errorMessage.userNotFound,
            data: [],
            error: []
        });
    }
}


const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

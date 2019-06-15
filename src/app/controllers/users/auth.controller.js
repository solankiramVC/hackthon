import JWT from 'jsonwebtoken';
import uuid from 'uuid/v1';
import UserModel from '../../models/users.model';
import config from '../../../config/config';
import SMTP from '../../../utils/email';
import Message from '../../../config/message';
import util from 'util';
import crypto from 'crypto';


/**
 * Create User if valid email and username
 * @public
 * @param req
 * @param res
 * @returns {*}
 */
exports.singup = async (req, res) => {
    try {
        const {params} = req.body;
        params.uId = uuid();
        console.log('params', params);
        const saveToUser = UserModel(req.body.params);
        await saveToUser.save()
            .then((user) => {
                const mailOptions = {
                    to: user.email,
                    subject: Message.emails.signup.subject,
                    text: util.format(Message.emails.signup.body,  params.uId)
                };
                SMTP.email(mailOptions, (err, info) => {
                    if (err) {
                        res.status(400).send({
                            code: 400,
                            message: Message.errorMessage.genericError,
                            data: [],
                            error: err
                        });
                    }
                    res.status(200).send({
                        code: 200,
                        message: Message.infoMessage.forgotPassword,
                        data: [],
                        error: []
                    });
                });
                res.status(200).send({
                    code: 200,
                    message: Message.infoMessage.saveUser,
                    data: user,
                    error: []
                });
            })
            .catch(err => {
                res.status(400).send({
                    code: 400,
                    message: Message.errorMessage.genericError,
                    data: [],
                    error: err
                });
            });
    } catch (err) {
        res.status(400).send({
            code: 400,
            message: Message.errorMessage.genericError,
            data: [],
            error: err
        });
    }
}



exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body.params;
        await UserModel.findOne({
            'email': email
        })
            .then((user) => {
                if (user) {
                    user.comparePassword(password, (err, match) => {
                        if (match === true) {
                                const oneTimeToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                                const token = JWT.sign(user.toJSON(), config.JWTSecret, {
                                    expiresIn: config.JWTExpireTime
                                });
                                const byre = crypto.randomBytes(32);
                                user.oneTimeToken = byre;
                                user.save({upsert:true}).then((resu) => {
                                    console.log(resu)
                                });
                                res.status(200).send({
                                    code: 200,
                                    message: Message.infoMessage.login,
                                    data: {
                                        token: 'JWT ' + token,
                                        user: user.email,
                                        oneTimeToken:byre
                                    },
                                    error: []
                                });
                        } else {
                            res.status(400).send({
                                code: 401,
                                message: Message.errorMessage.userNotFound,
                                data: [],
                                error: []
                            });
                        }
                    })
                } else {
                    res.status(400).send({
                        code: 401,
                        message: Message.errorMessage.userNotFound,
                        data: [],
                        error: []
                    });
                }
            })
            .catch(err => {
                res.status(400).send({
                    code: 400,
                    message: Message.errorMessage.genericError,
                    data: [],
                    error: err
                });
            })
    } catch (err) {
        console.log("req.body.params----------------", err);
        res.status(400).send({
            code: 400,
            message: Message.errorMessage.genericError,
            data: [],
            error: err
        });
    }
}

/**
 * Send email if email is valid and exist
 * @public
 * @param req
 * @param res
 * @returns {*}
 */
exports.forgotPassword = async (req, res) => {
    try {
        console.log("hello");
        const {
            params
        } = req.body;
        await UserModel.findOne({
            'email': params.email, 
        })
            .then((user) => {
        console.log("user");

                if (user) {
                    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = config.resetPasswordTokenExpireTime;
                    user.save();
                    const mailOptions = {
                        to: user.userName,
                        subject: Message.emails.forgotPassword.subject,
                        text: util.format(Message.quickwalkUser.forgotPassword.body, config.frontendUrl, token)
                    };
                    SMTP.email(mailOptions).then((result) => {
                        res.status(200).send({
                            code: 200,
                            message: Message.infoMessage.forgotPassword,
                            data: [],
                            error: []
                        });
                    }).catch((err) => {
                        res.status(400).send({
                            code: 400,
                            message: Message.errorMessage.genericError,
                            data: [],
                            error: err
                        });
                    })
                } else {
        console.log("else");
                    res.status(401).send({
                        code: 401,
                        message: Message.errorMessage.emailNotFound,
                        data: [],
                        error: []
                    });
                }
            })
            .catch((err) => {
        console.log("err",err);

                res.status(400).send({
                    code: 400,
                    message: Message.errorMessage.genericError,
                    data: [],
                    error: err
                });
            });
    } catch (err) {
        res.status(400).send({
            code: 400,
            message: Message.errorMessage.genericError,
            data: [],
            error: err
        });
    }
}

/**
 * Reset password if token is valid
 * @public
 * @param req
 * @param res
 * @returns {*}
 */
exports.resetPassword = async (req, res) => {
    try {
        const {
            password,
            token
        } = req.body.params;
        await UserModel.findOne({
            resetPasswordToken: token
        })
            .then((user) => {
                if (user) {
                    user.password = password;
                    user.save();
                    const mailOptions = {
                        to: user.userName,
                        subject: Message.emails.resetPassword.subject,
                        text: util.format(Message.emails.resetPassword.body, user.userName)
                    };
                    SMTP.email(mailOptions)
                    .then((result) => {
                        res.status(200).send({
                            code: 200,
                            message: Message.infoMessage.resetPassword,
                            data: [],
                            error: []
                        });
                    }).catch((err) => {
                        res.status(400).send({
                            code: 400,
                            message: Message.errorMessage.genericError,
                            data: [],
                            error: err
                        });
                    })
                } else {
                    res.status(401).send({
                        code: 401,
                        message: Message.errorMessage.tokenNotFound,
                        data: [],
                        error: []
                    });
                }
            })
            .catch((err) => {
                res.status(400).send({
                    code: 400,
                    message: Message.errorMessage.genericError,
                    data: [],
                    error: err
                });
            });
    } catch (err) {
        res.status(400).send({
            code: 400,
            message: Message.errorMessage.genericError,
            data: [],
            error: err
        });
    }
}

/**
 * Verify account if token is valid and not expire
 * @public
 * @param req
 * @param res
 * @returns {*}
 */
exports.verify = async (req, res) => {
    try {
        const {
            token,
            password
        } = req.body.params;
        console.log('Token', token);
        await UserModel.findOne({
            emailVerificationToken: token
        })
            .then((users) => {
                console.log('users >>>>>>', users);
                if (users) {
                    users.status = "1";
                    users.password = password;
                    users.save();
                    res.status(200).send({
                        code: 200,
                        message: Message.infoMessage.accountVerify,
                        data: [],
                        error: []
                    });
                }
                else {
                    res.status(404).send({
                        code: 404,
                        message: Message.errorMessage.tokenNotFound,
                        data: [],
                        error: []
                    });
                }
            })
            .catch((err) => {
                res.status(400).send({
                    code: 400,
                    message: Message.errorMessage.genericError,
                    data: [],
                    error: err
                });
            })
    } catch (err) {
        res.status(400).send({
            code: 400,
            message: Message.errorMessage.genericError,
            data: [],
            error: err
        });
    }
}
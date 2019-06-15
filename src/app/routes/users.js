import {
    Router
} from 'express';
import passport from 'passport';
import validate from 'express-validation';
import authController from '../controllers/users/auth.controller';
import messageController from '../controllers/users/message.controller';
import authValidator from '../validation/auth';
import userValidator from '../validation/user';

const router = Router();
/**
 * GET v1/status
 */
router.get('/status', passport.authenticate('User', {
    session: false
}), (req, res) => res.send('OK'));
/**
 * @api {post} /signup register user
 * @apiDescription signup user
 * @apiVersion 1.0.0
 * @apiName signup
 * @apiGroup Post
 * 
 * @apiParam  {String}  email     User Email
 * @apiParam  {String}  username  Username
 * @apiParam  {String}  password  User Password
 * @apiParam  {String}  company   User Company
 *
 * @apiSuccess (Created 200) {String}  id       User's id
 * @apiSuccess (Created 200) {String}  email    User's email
 * @apiSuccess (Created 200) {String}  company  User's company
 *
 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
 */
router.post('/signup', validate(authValidator.signup), authController.singup);

/**
 * @api {post} /login login user
 * @apiDescription Login user
 * @apiVersion 1.0.0
 * @apiName login
 * @apiGroup Post
 * 
 * @apiParam  {String}  email     User Email
 * @apiParam  {String}  password  User Password
 *
 * @apiSuccess (Created 200) {String}  token  Token For Authenticate
 *
 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
 */
router.post('/login', authController.login);

/**
 * @api {post} /forgotPassword 
 * @apiDescription Forgot Password user
 * @apiVersion 1.0.0
 * @apiName forgotPassword
 * @apiGroup Post
 * 
 * @apiParam  {String}  email     Email
 *
 * @apiSuccess (200) {String}  message  email sent
 *
 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
 */
router.post('/forgotPassword', authController.forgotPassword);

/**
 * @api {post} /resetPassword 
 * @apiDescription Reset Password user
 * @apiVersion 1.0.0
 * @apiName resetPassword
 * @apiGroup Post
 * 
 * @apiParam  {String}  token  Token from forgot password email link
 *
 * @apiSuccess (200) {String}  message  reset password 
 *
 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
 */
router.post('/resetPassword', validate(authValidator.resetPassword), authController.resetPassword);

/**
 * @api {post} /verify 
 * @apiDescription Verify Account
 * @apiVersion 1.0.0
 * @apiName verify
 * @apiGroup User Authenticate
 * 
 * @apiParam  {String}  token  Token from Active account email link
 *
 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
 */
router.post('/verify', validate(authValidator.verify), authController.verify);
/**
 * @api {post} /verify 
 * @apiDescription Verify Account
 * @apiVersion 1.0.0
 * @apiName verify
 * @apiGroup User Authenticate
 * 
 * @apiParam  {String}  token  Token from Active account email link
 *
 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
 */
router.post('/message/save',  messageController.save);
router.get('/user/get',  messageController.getUser);
router.get('/user/index',  messageController.index);
// router.get('/user/saveFile', messageController.saveFile);






module.exports = router;
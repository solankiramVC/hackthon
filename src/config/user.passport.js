import { Strategy, ExtractJwt } from 'passport-jwt';
import Users from '../app/models/users.model';
import config from './config';

module.exports = (passport) => {
    const opts = {};
    // console.log(req.headers);
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    console.log('opts.jwtFromRequest', opts.jwtFromRequest);
    opts.secretOrKey = config.JWTSecret;
    
    passport.use('User', new Strategy(opts, (jwt_payload, done) => {
        Users.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    }));
}
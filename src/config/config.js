import environment from  '../../environment';
const envConfig = environment[process.env.NODE_ENV];

module.exports = {
    JWTSecret : 'hackthon',
    JWTExpireTime : 604800,
    resetPasswordTokenExpireTime: Date.now() + 3600000,
    emailVerifyTokenExpireTime: Date.now() + 3600000,
    frontendUrl: envConfig.userUri,
    adminUrl: envConfig.adminUri,
    masterAdmin: envConfig.masterAdminUri,
};
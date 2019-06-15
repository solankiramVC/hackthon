import nodemailer from 'nodemailer';
import util from 'util';

module.exports.email = (params) => {
    return new Promise((resolve, reject) => {
        try {
            const smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ramsolanki.viitorcloud@gmail.com',
                    pass: 'RAhir@123'
                }
            });
            params.from = 'ramsolanki.viitorcloud@gmail.com';
            smtpTransport.sendMail(params, (err, info) => {
                if (err) reject(err, []);
                if (info) resolve(info);
            })
        } catch (err) {
            reject(err);
        }
    });
}



// module.exports.email = (params, callback) => {
//     try {
//         const smtpTransport = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'ramsolanki.viitorcloud@gmail.com',
//                 pass: 'RAhir@123'
//             }
//         });
//         params.from = 'ramsolanki.viitorcloud@gmail.com';
//         smtpTransport.sendMail(params, (err, info) => {
//             if (err) callback(err, []);
//             if (info) callback(undefined, info);
//         })
//     } catch (err) {
//         callback(err, []);
//     }
// }



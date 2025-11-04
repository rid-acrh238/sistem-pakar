// export const jwtConfig = {
//   secret: "spk-depresi-secret-key", // ganti dengan env variable nanti
//   expiresIn: "1h"
// };

const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

exports.generateTokens = (payload) => {
    const token = jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || '15m',
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    });
    return { token, refreshToken };
};

exports.verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);
exports.verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

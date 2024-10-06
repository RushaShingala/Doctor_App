const jwt = require('jsonwebtoken');
require("dotenv").config();
var db = require("../Config/db");
const { where } = require('sequelize');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication failed - Token missing on header' });
        }
        console.log(authHeader);

        const token = req.headers['authorization'].split(' ')[1];

        console.log("token", token);

        if (!token) {
            return res.status(401).json({ error: 'Authentication failed - Token not provided' });
        }
        const decodedToken = jwt.verify(token, 'test');
        const isUser = decodedToken.sub;

        console.log("sub", isUser);

        const istoken = await db.Token.findByPk(isUser);
        if (!istoken) {
            return res.status(401).json({ error: 'Authentication failed - Token is not recognized' });
        }
        console.log("istoken.tokenVersion", istoken.tokenVersion);
        console.log("decodedToken.tokenVersion", decodedToken.tokenVersion);

        if (istoken.tokenVersion !== decodedToken.tokenVersion) {
            return res.status(401).json({ error: 'Authentication failed - Token is not recognized' });
        }

        if (istoken) {
            var result = await db.User.findAll({
                where: {
                    id: istoken.userid
                }
            })
            //  if you use findall function then these function return array ,then we can use result[0]
            //console.log("result",result[0]);
            //console.log("result.dataValues",result[0].dataValues);
            // req.user=result[0].dataValues;
            // req.token=istoken.device_id;
            if (result && result.length > 0) {
                req.user = result[0].dataValues;
                req.token = istoken.device_id;
                req.tid = istoken.id;

            } else {
                return res.status(401).json({ error: 'Authentication failed - User not found' }); // 401 Unauthorized
            }
        }
        else {
            console.log("token not found", istoken);
            return res.status(401).json({ error: 'Authentication failed - Invalid token' });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = authenticate;




























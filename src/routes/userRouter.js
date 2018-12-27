import express from 'express';
import ResponseContent from '../utils/ResponseContent';
import validateInput from '../utils/validations/user';
import {getDateTimeString} from '../utils/Timer';
import fs from 'fs';
import BaizeCode from '../utils/encrypt/baize_coder';
import path from 'path';
import User from '../models/user';
import {AES_KEY, IV} from "../constants/index";
import {authenticateVerify} from '../middlewares/authenticate';
import {getRedis} from "../redis";





var rsaPath = path.resolve(__dirname,'../utils/encrypt/rsa/512');
var router = express.Router();
var redisClient = getRedis(0);

router.post('/logout',function (req, res, next) {
    var responseConten;
    const authToken = req.headers['authtoken'];
    if(authToken){
        const redisKey = 'token_'+authToken;
        redisClient.del(redisKey);
        responseConten = new ResponseContent(null, true, '');
        res.status(200).json(responseConten);
    }else{
        responseConten = new ResponseContent(null, false, '参数错误');
        res.status(400).json(responseConten);
    }
});



router.post('/login',authenticateVerify,function (req, res, next) {
    var responseConten;
    var {username,password} = req.body;

    User.getUser(username,username).then(user=>{
        if(user){
            var userPassword = user.password_digest;
            try {
                //数据库密码解密
                userPassword = BaizeCode.getAesDecryptString(userPassword,AES_KEY,IV);
                //用户输入密码解密
                ///获取私钥解密
                const authToken = req.headers['authtoken'];
                const redisKey = 'token_'+authToken;
                redisClient.hgetall(redisKey,function (err, redisValue) {
                    if (redisValue) {
                        const {publicKey,privateKey} = redisValue;
                        try{//解密
                            var loginPassword = BaizeCode.baizeDecrypt(password, privateKey);
                            if(userPassword === loginPassword){
                                user = {
                                    id:user.id,
                                    username:user.account,
                                    email:user.email,
                                    publicKey:publicKey,
                                    privateKey:privateKey
                                }
                                redisClient.hmset(redisKey,user);
                                redisClient.expire(redisKey,60*60);
                                responseConten = new ResponseContent({id:user.id,username:user.username,email:user.email}, true, "登陆成功");
                                res.status(200).json(responseConten);
                            }else{
                                responseConten = new ResponseContent(null,false,'用户名或密码错误');
                                res.status(200).json(responseConten);
                            }
                        }catch (e) {
                            console.log(e);
                            responseConten = new ResponseContent(null, false, '服务器异常');
                            res.status(500).json(responseConten);
                        }
                    } else {
                        responseConten = new ResponseContent(null, false, "会话已过期");
                        res.status(666).json(responseConten);
                    }
                });

            }catch (e) {
                console.log(e)
                responseConten = new ResponseContent(null,false,"服务器异常");
                res.status(500).json(responseConten);
            }
        }else{
            responseConten = new ResponseContent(null,false,'用户名或密码错误');
            res.status(200).json(responseConten);
        }

    }).catch(err => {
        console.log(err)
        responseConten = new ResponseContent(null,false,err.sqlMessage);
        res.status(500).json(responseConten);
    });



    //
    // responseConten = new ResponseContent(null,true,"登录成功");
    // res.status(200).json(responseConten);
});


router.post('/signup', function (req, res, next) {
    var responseConten;
    var {username, password, email} = req.body;

    if (password) {
        try {
            const privateKey = fs.readFileSync(rsaPath + '/rsa_private_key.pem', 'utf-8');
            password = BaizeCode.baizeDecrypt(password, privateKey);
            const {error, isValid} = validateInput({
                username: username,
                password: password,
                email: email,
            });
            if (isValid) {
                User.getUser(username, email).then(user => {
                    try {
                        if (user) {
                            responseConten = new ResponseContent(null, false, "用户名或邮箱已被注册");
                            res.status(200).json(responseConten);
                        } else {
                            const time = getDateTimeString();
                            //加密
                            const encryptPassword = BaizeCode.getAesEncryptString(password, AES_KEY, IV).toString();

                            const user = {
                                account: username,
                                password_digest: encryptPassword,
                                email: email,
                                created_at: time,
                                updated_at: time,
                            }

                            User.createUser(user).then(userIds => {
                                responseConten = new ResponseContent(userIds[0], true, "注册成功");
                                res.status(200).json(responseConten);
                            }).catch(err => {
                                console.log(err)
                                responseConten = new ResponseContent(null, false, err.sqlMessage);
                                res.status(500).json(responseConten);
                            });
                        }
                    } catch (e) {
                        console.log(e)
                        responseConten = new ResponseContent(null, false, "服务器异常");
                        res.status(500).json(responseConten);
                    }
                });
            } else {
                responseConten = new ResponseContent(null, false, error);
                res.status(400).json(responseConten);
            }

        } catch (e) {
            console.log(e)
            responseConten = new ResponseContent(null, false, "服务器异常");
            res.status(500).json(responseConten);
        }
    } else {
        responseConten = new ResponseContent(null, false, "无效参数");
        res.status(400).json(responseConten);
    }


});




export default router;

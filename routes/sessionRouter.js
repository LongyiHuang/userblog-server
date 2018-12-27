import express from 'express';
import ResponseContent from '../utils/ResponseContent';
import svgCaptcha from 'svg-captcha';
import BaizeCode from '../utils/encrypt/baize_coder';
import { getRedis } from '../redis';
import UUID from '../utils/UUID';

var router = express.Router();


var redisClient = getRedis(0);


router.get('/publickey',function (req,res,next) {
    const keys = BaizeCode.getRsaKeys(512);
    const {publicKey,privateKey} = keys;

    //保存这组key
    const token = UUID();
    const redisKey = 'token_'+token;
    const redisValue = {
        publicKey:publicKey.replace(/[\r\n]/g, ""),
        privateKey:privateKey.replace(/[\r\n]/g, "")
    }
    redisClient.hmset(redisKey,redisValue);
    redisClient.expire(redisKey,60);

    var responseConten = new ResponseContent({publicKey:publicKey.replace(/[\r\n]/g, ""),token:token},true,"");
    res.status(200).json(responseConten);
});

router.get('/verify',function (req,res,next) {
    var option = req.query;
    option.background = '#'+option.background;
    // 验证码，有两个属性，text是字符，data是svg代码
    var code = svgCaptcha.create(option);
    //验证码字符存入redis
    const token = UUID();
    const redisKey = 'token_'+token;
    const redisValue = {
        verifyCode:code.text.toLowerCase()
    }
    redisClient.hmset(redisKey,redisValue);
    redisClient.expire(redisKey,60);

    var responseConten = new ResponseContent({img: code.data,token: token}, true, "");
    res.status(200).json(responseConten);
})


router.get('/auth',function (req,res,next) {
    var responseConten;
    const {token} = req.query;
    const redisKey = 'token_'+token;
    redisClient.hgetall(redisKey,function (err, redisValue) {
        if (redisValue) {
            const user = {
                id: redisValue.id,
                username:redisValue.username,
                email:redisValue.email,
            }
            if(user.id){
                responseConten = new ResponseContent(user,true, "")
                res.status(200).json(responseConten);
            }else{
                responseConten = new ResponseContent(null,false, "未授权，请登陆")
                res.status(200).json(responseConten);
            }
        }else{
            responseConten = new ResponseContent(null,false, "会话已过期，请从新登陆")
            res.status(200).json(responseConten);
        }
    });
    //
    // var responseConten = new ResponseContent({img: code.data,token: token}, true, "");
    // res.status(200).json(responseConten);
})




export default router;
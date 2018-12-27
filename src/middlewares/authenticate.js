import ResponseContent from "../utils/ResponseContent";
import {getRedis} from '../redis';


var redisClient = getRedis(0);

export function authenticateVerify (req,res,next) {
    const token =req.headers['verifytoken'];
    var responseConten;
    if(token){
       const { verify } = req.body;
       const redisKey = 'token_'+token;
       redisClient.hgetall(redisKey,function (err, reply) {
           if(reply){
               const verifyCode = reply.verifyCode;
               if(verify.toLowerCase() === verifyCode){
                    next();
               }else{
                   responseConten = new ResponseContent(null,false, '验证码错误');
                   res.status(200).json(responseConten);
               }

           }else{
               responseConten = new ResponseContent(null,false, "验证码已过期")
               res.status(200).json(responseConten);
           }
       });
   }else{
       responseConten = new ResponseContent(null,false, '验证码已过期');
       res.status(200).json(responseConten);
   }

}



export function authenticateAuth (req,res,next) {
    var responseConten;
    const token = req.headers['authtoken'];
    if(token){
        const redisKey = 'token_'+token;
        redisClient.hgetall(redisKey,function (err, reply) {
            if(reply){
                const {username} = reply;
                if(username){
                    next();
                }else{
                    responseConten = new ResponseContent(null,false, "未授权，请登陆")
                    res.status(666).json(responseConten);
                }
            }else{
                responseConten = new ResponseContent(null,false, "会话已过期，请从新登陆")
                res.status(666).json(responseConten);
            }
        });
    }else{
        responseConten = new ResponseContent(null,false, "未授权，请登陆")
        res.status(666).json(responseConten);
    }
}
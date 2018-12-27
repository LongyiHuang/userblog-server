// import {redisClient} from './redis';
// import fs from 'fs';
// import BaizeCode from './utils/encrypt/baize_coder';
var express = require('express');
import articleRouter from './routes/articleRouter';
import userRouter from './routes/userRouter';
import sessionRouter from './routes/sessionRouter';
var bodyParser = require('body-parser');



var app = express();
app.use(bodyParser.json());
// app.use(cookieParser());
//
// app.use(session({
//     secret: '12345',
//     name: 'session_verify',
//     cookie: {maxAge: 60000},
//     resave: false,
//     saveUninitialized: true,
// }));


// app.use('/', history()); // 由js控制路由，一定要写在express.static前面！！！
// app.use('/', express.static(path.join(__dirname, '..', 'client')));

//路由
app.use('/api/article',articleRouter);
app.use('/api/user',userRouter);
app.use('/api/session',sessionRouter);



app.listen(7000,function () {
    console.log('Server started on port 7000...');
})



//
// redisClient.set('token','tokenVolue');
// redisClient.expire('token',5);
// var i = 0;
//
// var myTimer = setInterval(function() {
//     redisClient.get('token', function (err, reply) {
//         if(reply) {
//             i++;
//             if(i>4 && i<10){
//                 console.log('加钟')
//                 redisClient.expire('token',5);
//                 i = 10;
//             }
//             console.log('I live: ' + reply.toString() + i);
//         } else {
//             clearTimeout(myTimer);
//             console.log(err);
//             redisClient.quit();
//         }
//     });
// }, 1000);

// const d = '123456';
// const privateKey = fs.readFileSync('./utils/encrypt/rsa/512/rsa_private_key.pem', 'utf-8');
// const publicKey = fs.readFileSync('./utils/encrypt/rsa/512/rsa_public_key.pem', 'utf-8');
// const keys = BaizeCode.getRsaKeys(512);
// const en = BaizeCode.baizeEncrypt(d,keys.publicKey);
// console.log('en:'+en);
// const de = BaizeCode.baizeDecrypt(en,keys.privateKey);
// console.log('de:'+de);


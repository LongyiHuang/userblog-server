var redis = require('redis');
const environment = process.env.NODE_ENV || 'development';
var config = require('./config').redis[environment];




export function getRedis(channel) {
    const option = {
        host:config.ip,
        port:config.port,
        password:config.auth,
    };
    var client = redis.createClient(option);
    client.on('error', function (error) {
        console.log("RedisServer is error!\n" + error);
    });
    client.on("connect", function () {
        console.log("RedisServer is connected!");
    });
    client.on("end", function () {
        console.log("RedisServer is end!");
    });
    client.select(channel, function() {
        console.log("RedisServer channel:"+channel);
    });
    return client;
}





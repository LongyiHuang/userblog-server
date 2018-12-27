//AES加密工具
var crypto = require('crypto-js');
//RSA加密工具
const NodeRSA = require('node-rsa');

//AES加密初始向量
const iv = "liangzhanmingrix";

const dataSeparator = "data_separator";


//baize加密
const baizeEncrypt = (data,publicKey) => {
    var result = "";
    if (data != null || data !== ""){
        //获取AES加密秘钥
        const aesKey = getAesKey();
        // console.log("aesKey:"+aesKey);
        //用AES加密明文数据
        const dataAfterAes = getAesEncryptString(data, aesKey, iv);
        // console.log("dataAfterAes:" + dataAfterAes);
        //用RSA加密AES加密秘钥
        const keyAfterRsa = getRsaEncryptString(aesKey, publicKey);
        // console.log("keyAfterRsa:" + keyAfterRsa);
        //拼凑密文
        result = dataAfterAes + dataSeparator + keyAfterRsa;
    }
    return result;
}
//baize解密
const baizeDecrypt = (data,privateKey) => {
    var result = "";
    if (data != null || data !== ""){
        //使用分隔符分割AES密文和经RSA加密后的AES秘钥
        var cryptDate = data.split(dataSeparator);
        //RSA解密，得到AES秘钥
        var aesKey = getRsaDecryptString(cryptDate[1],privateKey);
        // console.log("aesKey:"+aesKey);
        //使用AES秘钥解密得到明文
        result = getAesDecryptString(cryptDate[0],aesKey,iv);
    }
    return result;
}

//AES加密
const getAesEncryptString = (data, key, iv) => {
    const key2 = crypto.enc.Utf8.parse(key);;
    const iv2 = crypto.enc.Utf8.parse(iv);
    return crypto.AES.encrypt(data, key2, {
        iv: iv2,
        mode: crypto.mode.CBC,
        padding: crypto.pad.ZeroPadding
    });
};

//AES解密
const getAesDecryptString = (data, key, iv) => {
    const key2 = crypto.enc.Utf8.parse(key);;
    const iv2 = crypto.enc.Utf8.parse(iv);
    var decrypt = crypto.AES.decrypt(data, key2, {
        iv: iv2,
        mode: crypto.mode.CBC,
        padding: crypto.pad.ZeroPadding
    });
    var decryptedStr = decrypt.toString(crypto.enc.Utf8);
    return decryptedStr;
};


//RSA加密
const getRsaEncryptString = (data, publicKey) => {
    var pubKey = new NodeRSA(publicKey);
    pubKey.setOptions({encryptionScheme: 'pkcs1'});
    return pubKey.encrypt(data, 'base64');
};

//RSA解密
const getRsaDecryptString = (data,privateKey) => {
    var priKey = new NodeRSA(privateKey);
    priKey.setOptions({encryptionScheme: 'pkcs1'});
    return priKey.decrypt(data, 'utf8');
}

//获取一对RSA公钥秘钥
const getRsaKeys = (length) => {
    length = length >= 512 ? length : 512;
    var key = new NodeRSA({b: length});//生成秘钥
    var pubkey = key.exportKey('pkcs8-public');//导出公钥
    // console.log("pubkey: ", pubkey);
    var prikey = key.exportKey('pkcs1-private');//导出私钥
    // console.log("prikey: ", prikey);
    return {
        publicKey:pubkey,
        privateKey:prikey
    }
}


//获取随机16位字符串
const randomString = (length) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

//获取AES加密秘钥
var keyLength = 16;
const getAesKey = () => {
    return randomString(keyLength);
};


export default  {
    baizeEncrypt:baizeEncrypt,
    baizeDecrypt:baizeDecrypt,
    getAesEncryptString:getAesEncryptString,
    getAesDecryptString:getAesDecryptString,
    getRsaKeys:getRsaKeys,
    getRsaEncryptString:getRsaEncryptString,
    getRsaDecryptString:getRsaDecryptString,
};




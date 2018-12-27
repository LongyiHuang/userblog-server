import validator from 'validator';
import isEmpty from 'lodash/isEmpty';


const validateInput = (userInfo) => {


    let error = {};

    if(validator.isEmpty(userInfo.username)) {
        error = "请输入用户名";
    }

    if(validator.isEmpty(userInfo.password)){
        error = "请输入密码";

    }else if(!validator.isLength(userInfo.password,{min:3,max:20})){
        error= '密码长度至少大于3位，小于20位';
    }


    if(validator.isEmpty(userInfo.email)){
        error = '请输入邮箱';
    }

    if(!validator.isEmail(userInfo.email)){
        error = '请输入有效邮箱';
    }

    return {
        error,
        isValid:isEmpty(error)
    }
}


export default validateInput;
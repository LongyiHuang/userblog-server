import validator from 'validator';
import isEmpty from 'lodash/isEmpty';


const validateInput = (loginData) => {
    let errors = {};

    if(validator.isEmpty(loginData.account)){
        errors.account = "This field is required";
    }

    if(validator.isEmpty(loginData.password)){
        errors.password = "This field is required";
    }
    return {
        errors,
        isValid:isEmpty(errors)
    }
}


export default validateInput;
import isEmpty from 'lodash/isEmpty';

var rules = {
    "title": [true, 50],
    "author": [true, 20],
    "description":[true,100],
    "content":[true,0]
}

const validateInput = (args) => {
    let error = {};
    for (var i in rules) {
        if (rules[i][0] == true) {
            //判断参数是否存在
            if (!args[i]) {
                error = "invalid param " + i;
            }
        }
    }

    //判断参数是否在允许的列表中
    for (var i in args) {
        if (!rules[i]) {
            error = "invalid param " + i;
            return false;
        }
        //限制长度
        if (rules[i][1] != 0) {
            if (args[i].length > rules[i][1]) {
                error = "value of " + i + " too long";
            }
        }
    }
    return {
        error,
        isValid:isEmpty(error)
    };

}



export default validateInput;
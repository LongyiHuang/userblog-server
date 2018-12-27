import db from '../db';


var createUser = (user) => {
    return db('user').insert(user);
}


var getUser = (username,email) => {
    return db('user').where('account', username).orWhere('email',email).first();
}

export default {
    createUser : createUser,
    getUser: getUser
}

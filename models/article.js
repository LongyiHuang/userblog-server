import db from '../db';

var getArticles = (pageNumber,pageSize) => {
    let offset = (pageNumber-1) * pageSize;
    return db.select('*').from('article').limit(pageSize).offset(offset).orderBy('created_at', 'desc');

}

var getArticle = (id) => {
    return db('article').where('id', id).first();
}

var createArticle = (article) => {
    return db('article').insert(article);
}

var deleteArticle = (id) => {
    return db('article').where('id',id).del();
}

var updateArticle = (id,article) => {
    return db('article')
        .where('id', '=', id)
        .update({
            title: article.title,
            author: article.author,
            description:article.description,
            content:article.content,
            updated_at: article.updated_at,
        });

}



var getCount = () => {
    return db('article').count();
}

export default {
    getArticles: getArticles,
    getArticle: getArticle,
    createArticle: createArticle,
    deleteArticle: deleteArticle,
    updateArticle: updateArticle,
    getCount: getCount,
}



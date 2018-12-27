import express from 'express';
import Article from '../models/article';
import ResponseContent from '../utils/ResponseContent';
import validateInput from '../utils/validations/article';
import {getDateTimeString} from '../utils/Timer';
import {authenticateAuth} from '../middlewares/authenticate';
// import path from 'path';

var router = express.Router();

router.get('/', function(req, res, next) {
    const pageNumber = req.query.pageNumber;
    const pageSize = req.query.pageSize;
    var responseConten;
    Article.getArticles(pageNumber,pageSize).then(articles =>{
        if(articles.length>0){
            articles.forEach(article => {
                article.created_at = new Date(article.created_at).getTime();
                article.updated_at = new Date(article.updated_at).getTime();
            });
        }
        Article.getCount().then(count =>{
            responseConten = new ResponseContent({articles:articles,total:count[0]["count(*)"]},true,"");
            res.status(200).json(responseConten);
        }).catch(err => {
            responseConten = new ResponseContent(null,false,err.sqlMessage);
            res.status(500).json(responseConten);
        });
    }).catch(err => {
        responseConten = new ResponseContent(null,false,err.sqlMessage);
        res.status(500).json(responseConten);
    });
});

router.get('/:id',function (req,res,next) {
    var responseConten;
    var id = req.params.id;
    Article.getArticle(id).then(article =>{
        responseConten = new ResponseContent(article,true,"");
        res.status(200).json(responseConten);
    }).catch(err => {
        responseConten = new ResponseContent(null,false,err.sqlMessage);
        res.status(201).json(responseConten);
    });
});


router.post('/',authenticateAuth, function(req, res, next) {
    var article = req.body;
    var responseConten;
    const {error,isValid} = validateInput(article);
    if(isValid){
        const time = getDateTimeString();
        article = {
            title: article.title,
            author: article.author,
            description: article.description,
            content: article.content,
            created_at: time,
            updated_at: time
        }
        Article.createArticle(article).then(articleIds => {
            article.id = articleIds[0];
            responseConten = new ResponseContent(article,true,"");
            res.status(200).json(responseConten);
        }).catch(err => {
            responseConten = new ResponseContent(null,false,err.sqlMessage);
            res.status(500).json(responseConten);
        });
    }else{
        responseConten = new ResponseContent(null,false,error);
        res.status(400).json(responseConten);
    }
});

router.delete('/:id',authenticateAuth,function (req,res,next) {
    var responseConten;
    var id = req.params.id;
    Article.deleteArticle(id).then(() =>{
        responseConten = new ResponseContent(id,true,"");
        res.status(200).json(responseConten);
    }).catch(err => {
        responseConten = new ResponseContent(null,false,err.sqlMessage);
        res.status(500).json(responseConten);
    });
});


router.patch('/:id',authenticateAuth, function(req, res, next) {
    var article = req.body;
    var id = req.params.id;
    var responseConten;
    const {error,isValid} = validateInput(article);
    if(isValid){
        Article.getArticle(id).then(articleOld =>{
            if(articleOld){
                const time = getDateTimeString();
                article = {
                    title: article.title,
                    author: article.author,
                    description: article.description,
                    content: article.content,
                    updated_at: time
                }
                Article.updateArticle(id,article).then(() =>{
                    responseConten = new ResponseContent(article,true,"");
                    res.status(200).json(responseConten);
                }).catch(err => {
                    responseConten = new ResponseContent(null,false,err.sqlMessage);
                    res.status(500).json(responseConten);
                });
            }else{
                responseConten = new ResponseContent(null,false,"文章不存在");
                res.status(200).json(responseConten);
            }

        }).catch(err => {
            responseConten = new ResponseContent(null,false,err.sqlMessage);
            res.status(500).json(responseConten);
        });
    }else{
        responseConten = new ResponseContent(null,false,error);
        res.status(400).json(responseConten);
    }
});



export default router;

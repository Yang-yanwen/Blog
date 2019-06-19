const express = require('express')
const router = express()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const moment = require('moment')
const MongoControl = require('./tools/mongo-pack-2').MongoCotrol
const page = new MongoControl('blog', 'page')
const comment = new MongoControl('blog', 'comment')
const path = require('path')

const CookieControl = require('./tools/cookie')

//管理员登录
//----------问题 cookie的回收机制待实现
var admin = new CookieControl()

//请求 /admin界面 有正确cookie 给，没有定向login页面
router.get('/', (req, res) => {
    if (admin.checkToken(req.cookies.token)) {
        res.sendFile(path.resolve('./static/admin.html'))
    } else {
        //res.status(403).send('你没有权限')
        res.redirect('/admin/login')
    }

})
//发送登录界面
router.get('/login', (req, res) => {
    res.sendFile(path.resolve('./static/login.html'))
})
//登录表单接受
router.post('/login', urlencodedParser, (req, res) => {
    if (req.body.username == 'admin' && req.body.password == 'admin') {
        res.cookie('token', admin.getToken())
        res.redirect('/admin')
    }
    else {
        res.status(403).send('登录失败')
    }
})
//获取文章列表
router.get('/getArticle',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    page.find({},(err,result)=>{
        if(err){
            res.status(500).send('服务器错误')
            return
        }
        res.send(result)
    })
})
//删除文章接口
router.get('/deletePage',(req,res)=>{
    //res.setHeader('Access-Control-Allow-Origin','*')
    var id=req.query.id
    //console.log(id)
    page.removeById(id,(err,result)=>{
        if(err){
            res.status(500).send('服务器错误')
            return
        }
        res.send('删除成功')
    })
})
//判断文章内容格式是否正确
function checkPage({ title, author, sort, intro, content }) {
    this.title = title; this.author = author; this.sort = sort;
    this.intro = intro; this.content = content;
    if (!this.title  || !this.author|| !this.sort  || !this.intro  || !this.content ) {
        return false
    } else {
        return true
    }
}
//发布新文章
router.post('/uploadPage', urlencodedParser, (req, res) => {
    if (admin.checkToken(req.cookies.token)) {//判断管理员是否为登录状态
        var { title, author, sort, intro, content } = req.body
        // console.log({ title, author, sort, intro, content })
        if(checkPage({ title, author, sort, intro, content })){//判断格式
            var nowDate = moment().format('YYYY-MM-DD HH-mm-ss')
            page.insert({
                title: title,
                author: author,
                sort: sort,
                content: content,
                intro: intro,
                date: nowDate
            }, (err, result) => {
                res.send('文章发布成功')
            })
        }else{
            res.send('请校对文档格式')
        }
    } else {
        res.status(403).send('你没有权限')
        return
    }
})

//前端后台 请求state为【0】的评论
router.get('/getComment', (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin','*') //静态调试 解决跨域问题
    if (admin.checkToken(req.cookies.token)) {

    } else {
        res.status(403).send('你没有权限')
        return
    }
    comment.find({ state: 0 }, (err, result) => {
        if (result.length == 0) {
            res.send([])
            return
        }
        //console.log(result)
        //同时获取评论来源于那个文章
        var count = 0////设置哨兵变量
        for (var i = 0; i < result.length; i++) {
            var nowData = result[i]
            //最主要的问题：异步回调 只能执行一次res.send() 不能在最内层找到后发 
            //也不能在最外发【异步问题：抛出进程执行下一条 循环一条条抛出没运行结束 就发送】
            var currentPage = nowData.fid //得到文章id
            page.findById(currentPage, (err, data) => {
                var pageData = data[0]
                nowData.f_title = pageData.title //将文章title塞进评论数据中 发送而出
                nowData.f_intro = pageData.intro

                //哨兵记录
                count++
                if (count == result.length) {
                    res.send(result)
                }
            })
        }
    })
})
//处理评论的具体接口
router.get('/passComment', (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin','*') //静态调试 解决跨域问题
    if (admin.checkToken(req.cookies.token)) {

    } else {
        res.status(403).send('你没有权限')
        return
    }
    var id = req.query.id
    comment.updateById(id, { state: 1 }, (err, result) => {
        res.send({ result: 'ok' })
    })
})
router.get('/nopassComment', (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin','*') //静态调试 解决跨域问题
    if (admin.checkToken(req.cookies.token)) {

    } else {
        res.status(403).send('你没有权限')
        return
    }

    var id = req.query.id
    comment.updateById(id, { state: 2 }, (err, result) => {
        res.send({ result: 'ok' })
    })
})
module.exports = router
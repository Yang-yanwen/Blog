// express模块引入
const express = require('express')
//初始化express的app
const app = express()

//引入body-parser
const bodyParser = require('body-parser')
//初始化urlencoded解析器
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//引入cookie-parser模块
const cookieParser = require('cookie-parser')

//引入ejs模块做后端渲染
const ejs = require('ejs')

//引入moment模块处理时间格式
const moment = require('moment')

//引入marked模块 将md格式编码为HTML格式
const marked=require('marked')

//引入自己包装的MongoDB模块
const MongoControl = require('./tools/mongo-pack-2').MongoCotrol
//初始化需要的数据库和集合
const page = new MongoControl('blog', 'page')
const comment = new MongoControl('blog', 'comment')

//为请求添加中间件：解析cookie
app.use(cookieParser())

//否定静态目录读取index.html 
app.use(express.static('./static', { index: false })) 

//后台管理接口 【先将admin请求拦截为静态请求】
//先是 login.html请求css js 失败 
app.use('/admin',express.static('./static',{index:false}))
app.use('/admin',require('./admin'))
//$-管理界面//app.get('/admin') 
//$-发表文章//app.post('/admin/submitPage')
//$-评论审核//app.post('/admin/inspectComment')


//&-前台接口
//&-首页请求
app.get('/', (req, res) => {
    //在page数据库查找文章
    page.find({}, function (err, result) {
        //ejs渲染json文章数据到页面
        ejs.renderFile('./ejs-tpl/index.ejs', { data: result }, function (err, html) {
            res.send(html)
        })
    })
})
//&-具体文章请求
app.get('/p', (req, res) => {
    //获取前端传来的id
    var id = req.query.id
    //根据id【数据库中键名为_id幺】查文章
    page.findById(id, (err, result) => {
        //文章不存在时
        if (result.length == 0) {
            res.status(404).send('文章不存在')
            return
        }
        //id查询肯定只返回一条
        var json = result[0]
        
        // 使用marke 处理md格式文件为HTML格式
        json.content=marked(json.content)
        //id查评论
        comment.find({ fid: id ,state:1 }, (err, result) => {
            //渲染评论 --渲染数据有文章和评论
            ejs.renderFile('./ejs-tpl/page.ejs', { data: json, comment: result }, (err, html) => {
                html=html.replace('<!-- content -->',json.content)
                res.send(html)
            })
        })
    })
})
//&-接受评论
app.post('/submitComment', urlencodedParser, (req, res) => {
    //获取url中携带的id为文章所属id
    var id = req.query.id
    //获取评论中的email和内容
    var { email, content } = req.body
    //console.log(id,email,content)

    //填入数据库
    //如果评论的fid不存在 不允许评论
    if (!id) { 
        res.status(403).send('不允许评论')
        return
    }
    if (!email || !content) {
        res.status(403).send('不允许评论')
        return
    }
    //插入数据库
    comment.insert({
        fid: id,
        content: content,
        author: email,
        date: moment().format('YYYY-MM-DD HH-mm-ss'),
        state:0
    }, (err, result) => {
        if (err) {
            //数据库插入失败时
            res.status(500).send('你的评论有毒，干崩了我的服务器')
            return
        }
        //评论完成 重定向到原页面
        res.redirect('/p?id=' + id)
    })
})

//监听4000端口
app.listen(4000)
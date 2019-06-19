const  MongoControl=require('./tools/mongo-pack-2').MongoCotrol
var page=new MongoControl('blog','page')
var comment=new MongoControl('blog','comment')

// 对时间解析 new Date()--> Tue Nov 27 2018 21:49:23 GMT+0800 (中国标准时间)
const moment=require('moment')
//moment().format('YYYY-MM-DD HH-mm-ss') ----->2018-11-27 22-13-22

// page.insert(
//     {
//         sort:'Population',
//         title:'单身狗',
//         author:'百度百科',
//         date:moment().format('YYYY-MM-DD HH-mm-ss'),
//         content:'“单身狗”一词发明之前，形容单身用的是“光棍”。“光棍”一词并无褒贬之意。但“单身狗”一词的发明，明显是对单身人群的嘲讽，甚至有很多人拿来自嘲',
//         intro:'“单身狗”一个网络俚语，特指没有恋爱对象的人.....'
//     },(err,result)=>{})


//定位当前文章 评论时 插入fid
// comment.insert({
//     fid:'5bfd54f5a2e01c3d580a2de1',
//     content:'写这文章的都是单身狗',
//     author:'blueblue@handsome.com',
//     date:moment().format('YYYY-MM-DD HH-mm-ss')

// },(err,result)=>{})

// page.removeById('5c0280b125efec748809b3ed',(err,res)=>{
//     console.log(res.result)
// })
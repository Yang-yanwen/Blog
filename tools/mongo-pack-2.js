const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient
const mongoUrl='mongodb://127.0.0.1:27017'
const ObjectId = mongodb.ObjectId
//对象内 各方法 进行二次包装

class MongoCotrol{
    constructor(dbName,collectionName){
        this.dbName=dbName
        this.collectionName=collectionName
    }

    _init(callback){
        MongoClient.connect(mongoUrl,{useNewUrlParser:true},(error,client)=>{
            if(error){
                 callback(error)
                 return
            }
            var db=client.db(this.dbName)
            callback(null,db.collection(this.collectionName),client)
        })
    }

    find(findQuery,callback){
        this._init((err,collection,client)=>{
            collection.find(findQuery).toArray((err,res)=>{
                callback(err,res)
                client.close()
            })
        }) 
    }

    // find(findQuery,callback){
    //     MongoClient.connect(mongoUrl,{useNewUrlParser:true},(error,client)=>{
    //         if(error){
    //              callback(error)
    //              return
    //         }
    //         var db=client.db(this.dbName)
    //         db.collection(this.collectionName).find(findQuery).toArray((err,res)=>{
    //             callback(err,res)
    //             client.close()
    //         })
    //     })
    // }
    insert(docs,callback){
        this._init((err,collection,client)=>{
            collection.insert(docs,(err,result)=>{
                callback(err,result)
                client.close()
            })
        })
    }
    // insert(docs,callback){
    //     MongoClient.connect(mongoUrl,{useNewUrlParser:true},(error,client)=>{
    //         if(error){
    //             callback(error)
    //             return
    //         }
    //         var db=client.db(this.dbName)
    //         db.collection(this.collectionName).insert(docs,(err,res)=>{
    //             callback(err,res)
    //             client.close()
    //         })
    //     })
    // }
    update(findQuery,newData,callback){
        this._init((err,collection,client)=>{
            collection.update(findQuery,{$set:newData},(err,result)=>{
                callback(err,result)
                client.close()
            })
        })
    }
    // update(findQuery,newData,callback){
    //     MongoClient.connect(mongoUrl,{useNewUrlParser:true},(error,client)=>{
    //         if(error){
    //             callback(error)
    //             return
    //         }
    //         var db=client.db(this.dbName)
    //         db.collection(this.collectionName).update(findQuery,{$set:newData},(err,res)=>{
    //             callback(err,res)
    //             client.close()
    //         })
    //     }) 
    // }
    remove(findQuery,callback){
        this._init((error,collection,client)=>{
            collection.remove(findQuery,(err,result)=>{
                callback(err,result)
                client.close()
            })
        })
    }
    // remove(findQuery,callback){
    //     MongoClient.connect(mongoUrl,{useNewUrlParser:true},(error,client)=>{
    //         if(error){
    //             callback(error)
    //             return
    //         }
    //         var db=client.db(this.dbName)
    //         db.collection(this.collectionName).remove(findQuery,(err,res)=>{
    //             callback(err,res)
    //             client.close()
    //         })
    //     })
    // }
    removeById(id,callback){
        var findQuery={_id:ObjectId(id)}
        this.remove(findQuery,callback)
    }
    updateById(id,newData,callback){
        var findQuery={_id:ObjectId(id)}
        this.update(findQuery,newData,callback)
    }
    findById(id,callback){
        var findQuery={_id:ObjectId(id)}
        this.find(findQuery,callback)
    }
}


exports.MongoCotrol=MongoCotrol

// var user=new MongoCotrol('test','user')
//-pass-//

//参见图片

// user.find({},function(err,res){
//     console.log(res)
// })

// user.findById('5bf7e2d2cd6ea4326008139e',function(err,res){
//     console.log(res)
// })

// user.insert({name:"啊啊3"},function(err,res){
//     console.log(res.result)
// })

// user.removeById('5bf7e12b753685165ca96913',function(err,res){
//     console.log(res.result)
// })

// user.updateById('5bf405e124803c2235ae08f0',{name:"赵熙",age:22},function(err,res){
//     console.log(res.result)
// })
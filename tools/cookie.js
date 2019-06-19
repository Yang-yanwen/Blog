//构造cookie类 产生 检查 去除
class CookieControl{
    constructor(){
        this.tokenArr=[]
    }
    getToken(){
        var token=''
        var str='123vhjdfjkm789trgfcbv9poHDFVSKBNO$%^&8vygbhnj678'
        for(var i=0;i<20;i++){
            if(i%5==0&&i!=0){
               token+='-'
            }
             token+=str[parseInt(Math.random()*str.length)]
        }
        this.tokenArr.push(token)
        return token
    }
    checkToken(token){
        for(var i=0;i<this.tokenArr.length;i++){
            if(this.tokenArr[i]==token){
                return true
            }
        }
        return false
    }
    removeToken(token){
        for(var i=0;i<this.tokenArr.length;i++){
            if(this.tokenArr[i]==token){
                this.tokenArr.splice(i,1)
                return
            }
        }
        return false
    }
}
module.exports=CookieControl
// var a=new CookieControl()
// var b=a.getToken()
// console.log(
//     a.checkToken(b)
// )
var listItem=$('.list-item')
var rightWrap=$('.right-wrap')
 

listItem.on('click',function(){
    listItem.removeClass('active')
    $(this).addClass('active')
    
    var tag=$(this).attr('data-wrap')
    rightWrap.removeClass('active')
    $('#'+tag).addClass('active')
})
# 如何使用markdown来撰写博客文章 

>  ## 基于node环境

1. ` $ cnpm install marked` 安装模块 在根.js文件内 ` require` 引入

2. 将通过 ` Visual Studio Code` 编辑md文章，` Crtl+shift+p` 调出预览窗口，编辑完成后插入数据库。

3. 一般后端渲染通过 ` ejs` 模块的语法模式将数据放置在需要的位置
```html
<p>      
    日期：<%= data.date %>
</p>
```

4. 在 ` ejs` 模板文件内无法将md文件渲染在浏览器中，依旧如同txt文件被解读
 ```html 
 <div class="well">
    <%= data.content %> 
</div>
 ````

5. md文件从数据库提取出来，通过 ` marked()` 将md文件解析为 `HTML`文件
 ```JavaScript
  json.content = marked(json.content)
  ```

6. 通过 ` replace` 将需要位置替换为 ` html`文件，如此浏览器直接将读取
  ```JavaScript
   html=html.replace('<!-- content -->',json.content)
  ```

7. 代码块的高亮处置，下载 [heightlight.js](https://highlightjs.org/) 勾选需要代码高亮的语种
   > ##### heightlight使用方法类似boostrap

8. 解压至需要的文件夹内，并在需要的  ` ejs ` 文件内
  ```html 
<link rel="stylesheet" href="./path/styles/hybrid.css">
<script src="./path/highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
  ```

9. 并在最后引入监听
  ```javascript
$(document).ready(function() {
    $('pre code').each(function(i, block) {
         hljs.highlightBlock(block);
    });
});
```

10. done





 
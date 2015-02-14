custormPager
============

前端分页器，类似博客园那样的

![image](https://github.com/zjh-neverstop/customPager/blob/master/Effect drawing.png)

```js
//实例化分页器
var pager = CustomPager(10);
//为了测试这里直接指定数据总数，实际应该从服务器获取
pager.totalCount = 1000;

//pager.pageMode = "click";   //ajax方式获取数据需要将pageMode设置为click模式
//通过ajax方式获取分页数据后的回调函数，可以在该方法中处理显示逻辑，绑定模板之类的
//pager.pageCallback = function(result){ //TODO };
//设置当前页，并通过ajax方式获取该页数据
//pager.getPagedData(1);

var pageIndex = getQueryStringByName("page") || 1;
//跳转基地址，这里是测试数据
pager.baseUrl = "file:///F:/test/customPager/example.html";  
//直接设置当前页，如果使用href方式翻页，需要使用该方法
pager.setCurrentIndex(pageIndex);

function getQueryStringByName(name) {
      var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
      if (result == null || result.length < 1) {
          return "";
      }
      return result[1];
  }
```

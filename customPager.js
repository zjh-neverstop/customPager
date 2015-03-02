/**
* Created by zhaojinghao on 14-9-19.
*/

//自定义前端分页器
(function(window) {

    //事件绑定器
    var addHandler = function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    };

    //绑定分页处理
    var bind = function(customPager,pageIndex,element){
        if(customPager.pageMode == "link"){
            element.href = customPager.baseUrl + "?page=" + pageIndex;
        }
        else{
            element.onclick = function(){
                customPager.getPagedData(pageIndex);
                return false;
            }
        }
    }


    //处理页码显示的方法
    var pageHandle = function(customPager) {
        //总共页数
        var totalPageCount = customPager.totalCount % customPager.pageSize == 0 ? parseInt(customPager.totalCount / customPager.pageSize) : parseInt(customPager.totalCount / customPager.pageSize) + 1;
        //显示页码的数量
        var displayPageCount = customPager.displayPageCount;
        var rangeStartIndex;
        var rangeEndIndex;

        var pagerNode = document.createElement("DIV");
        var pageInfo = {};

        rangeStartIndex = customPager.pageIndex - parseInt((displayPageCount / 2));
        rangeEndIndex = customPager.pageIndex + parseInt((displayPageCount / 2));


        //范围开头的处理
        if (rangeStartIndex < 1) {
            rangeEndIndex = rangeEndIndex + (1 - rangeStartIndex);
            rangeStartIndex = 1;

            rangeEndIndex = rangeEndIndex > totalPageCount ? totalPageCount : rangeEndIndex;
        }

        //范围结尾的处理
        if (rangeEndIndex > totalPageCount) {
            rangeStartIndex = rangeStartIndex - (rangeEndIndex - totalPageCount);
            rangeEndIndex = totalPageCount;

            rangeStartIndex = rangeStartIndex < 1 ? 1 : rangeStartIndex;
        }

        //是否显示prev
        if (customPager.pageIndex > 1) {
            pageInfo.hasPrev = "yes";
            var prev = document.createElement("A");
            bind(customPager,customPager.pageIndex - 1,prev);
            prev.appendChild(document.createTextNode("< Prev"));
            pagerNode.appendChild(prev);
        }
        else {
            pageInfo.hasPrev = "no";
        }

        //是否额外显示第一页
        if (rangeStartIndex > 1) {
            var node = document.createElement("A");
            bind(customPager,1,node);
            node.appendChild(document.createTextNode("1"));
            pagerNode.appendChild(node);
        }

        //是否显示起始省略符
        if (rangeStartIndex - 1 > 1) {
            pageInfo.hasStartSeparator = "yes";
            pagerNode.appendChild(document.createTextNode("..."));
        }
        else {
            pageInfo.hasStartSeparator = "no";
        }

        for (var i = rangeStartIndex; i <= rangeEndIndex; i++) {
            var node = document.createElement("A");
            
            node.appendChild(document.createTextNode(i));

            if (i == customPager.pageIndex) {
                node.className = "current";
            }
            else{
                bind(customPager,i,node);
            }

            pagerNode.appendChild(node);

        }

        //是否显示结尾省略符
        if (rangeEndIndex + 1 < totalPageCount) {
            pageInfo.hasEndSeparator = "yes";
            pagerNode.appendChild(document.createTextNode("..."));
        }
        else {
            pageInfo.hasEndSeparator = "no";
        }

        //是否额外显示最后一页
        if (rangeEndIndex < totalPageCount) {
            var node = document.createElement("A");
            bind(customPager,totalPageCount,node);
            node.appendChild(document.createTextNode(totalPageCount));
            pagerNode.appendChild(node);
        }

        //是否显示next
        pageInfo.hasNext = customPager.pageIndex < totalPageCount ? "yes" : "no";
        if (customPager.pageIndex < totalPageCount) {
            pageInfo.hasNext = "yes";

            var next = document.createElement("A");
            bind(customPager,customPager.pageIndex + 1,next);
            next.appendChild(document.createTextNode("Next >"));

            pagerNode.appendChild(next);
        }
        else {
            pageInfo.hasNext = "no";
        }

        document.getElementById("pager").innerHTML = "";
        if (totalPageCount > 1) {
            document.getElementById("pager").appendChild(pagerNode);
        }

    };


    var CustomPager = (function(window) {
        //全局配置
        var globalConfig = {};

        //构造函数
        var CustomPager = function(pageSize,url) {
            //当前页码
            this.pageIndex = 1;
            //每页行数
            this.pageSize = pageSize;
            //分页器中显示的页码数
            this.displayPageCount = 8;
            //总共行数
            this.totalCount = 0;
            //跳转基地址
            this.baseUrl = '/';
            //server url
            this.url = url || "";
            //分页方式
            this.pageMode = "link";
            //查询参数
            this.searchParams = {};
            
            /*
            前一个版本中，直接以html的方式返回表格数据，这样就直接限制了返回数据的格式，
            通过定义回调函数，把数据交由调用者自己处理，增强了分页器的灵活性，还能很方便的与knockoutjs框架进行配合使用
            例如：可以在mvvm模型中定义一个分页器，然后通过定义回调函数，将分页器获取的数据赋值给mvvm中的相关属性，
                  来实现UI的自动刷新
            */
            //获取数据后的回调事件，调用者自行实现数据的处理方法
            this.pageCallback = null;

        };

        //原型函数
        CustomPager.prototype = {
            getPagedData: function(pageIndex) {
                this.pageIndex = pageIndex;
                var pagerObj = this;
                pageHandle(this);

                var params = {};

                for (var p in pagerObj.searchParams) {
                    params[p] = pagerObj.searchParams[p];
                }

                params.pageIndex = pageIndex;
                params.pageSize = pagerObj.pageSize;

                $.ajax({
                    type: "POST",
                    url: this.url,
                    dataType: "json", 
                    data: params,
                    success: function(result) {
                        pagerObj.totalCount = result.totalCount;
                        console.debug(result);
                        pageHandle(pagerObj);

                        if(pagerObj.pageCallback){
                            pagerObj.pageCallback(result);
                        }
                        
                    }
                });
            },

            //设置当前页
            setCurrentIndex:function(pageIndex,totalCount){
                this.pageIndex = parseInt(pageIndex);
                if(totalCount && typeof totalCount == "number"){
                    this.totalCount = totalCount;
                }
                
                pageHandle(this);
            },

            configParams: function(params) {

            }
        };

        //工厂方法
        return function(pageSize,url) {
            return new CustomPager(pageSize,url);
        };
    })();

    window.CustomPager = CustomPager;

})(window, undefined);

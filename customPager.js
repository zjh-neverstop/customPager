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
            var tag = customPager.baseUrl.indexOf("?") > 0 ? "&" : "?";
            element.href = customPager.baseUrl + tag + "page=" + pageIndex;
        }
        else{
            element.onclick = function(){
                customPager.getPagedData(pageIndex);
                return false;
            }
        }
    }

	var pageHandleObj = {};

    //处理页码显示的方法
    pageHandleObj.cnblogPager = function(customPager) {
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

        document.getElementById(customPager.placeHolderId).innerHTML = "";
        if (totalPageCount > 1) {
            document.getElementById(customPager.placeHolderId).appendChild(pagerNode);
        }

    };

	pageHandleObj.defaultPager = function(customPager) {
        //总页数
        var totalPageCount = customPager.totalCount % customPager.pageSize == 0 ? parseInt(customPager.totalCount / customPager.pageSize) : parseInt(customPager.totalCount / customPager.pageSize) + 1;
        //显示页码的数量
        var displayPageCount = customPager.displayPageCount;
        var rangeStartIndex;
        var rangeEndIndex;

        //用来计算范围的中间变量
        var blockIndex = parseInt((customPager.pageIndex - 1) / displayPageCount);
        var blockCount = totalPageCount % displayPageCount == 0 ? parseInt(totalPageCount / displayPageCount) : parseInt(totalPageCount / displayPageCount) + 1;
        rangeStartIndex = blockIndex * displayPageCount + 1;
        rangeEndIndex = (blockIndex + 1) * displayPageCount;
        rangeEndIndex = rangeEndIndex > totalPageCount ? totalPageCount : rangeEndIndex;

        var pagerNode = document.createElement("DIV");
        var pageInfo = {};

        //        console.debug("totalPageCount: " + totalPageCount);
        //        console.debug("displayPageCount: " + displayPageCount);
        //        console.debug("rangeStartIndex: " + rangeStartIndex);
        //        console.debug("rangeEndIndex: " + rangeEndIndex);
        //        console.debug("blockIndex: " + blockIndex);
        //        console.debug("blockCount: " + blockCount);

        //首页
		var startNode = document.createElement("A");
		if (customPager.pageIndex > 1) {
            bind(customPager,1,startNode);
        }
        else {
            startNode.className = "default-disabled";   //改为class
        }
        
        startNode.appendChild(document.createTextNode("首页"));
        pagerNode.appendChild(startNode);

        //上一页
        var prev = document.createElement("A");
		if (customPager.pageIndex > 1) {
            bind(customPager,customPager.pageIndex - 1,prev);
        }
        else {
            prev.className = "default-disabled";   //改为class
        }
        prev.appendChild(document.createTextNode("上一页"));
        pagerNode.appendChild(prev);
		


        //是否显示起始省略符
        if (blockIndex > 0) {
            pageInfo.hasStartSeparator = "yes";
            var prevEllipsis = document.createElement("A");
            prevEllipsis.appendChild(document.createTextNode("..."));
            prevEllipsis.className = "shenglue";
			bind(customPager,parseInt(blockIndex * displayPageCount),prevEllipsis);
            pagerNode.appendChild(prevEllipsis);
        }
        else {
            pageInfo.hasStartSeparator = "no";
        }


        for (var i = rangeStartIndex; i <= rangeEndIndex; i++) {
            var node = document.createElement("A");

            //绑定事件，此处需注意闭包问题
            /*(function(i) {
                addHandler(node, "click", function() {
                    customPager.getPagedData(i);
                    return false;
                });
            })(i);*/
	    
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
        if (blockIndex + 1 < blockCount) {
            pageInfo.hasEndSeparator = "yes";
            var nextEllipsis = document.createElement("A");
            nextEllipsis.appendChild(document.createTextNode("..."));
            nextEllipsis.className = "shenglue";
			bind(customPager,((blockIndex + 1) * displayPageCount + 1),nextEllipsis);
            pagerNode.appendChild(nextEllipsis);
        }
        else {
            pageInfo.hasEndSeparator = "no";
        }


        //下一页
        var next = document.createElement("A");
        next.appendChild(document.createTextNode("下一页"));
        console.log("typeof customPager:" + (typeof customPager.pageIndex));
        if (customPager.pageIndex < totalPageCount) {
			bind(customPager,(customPager.pageIndex + 1),next);
        }
        else {
            next.className = "default-disabled";   //改为class
        }
        pagerNode.appendChild(next);

        //尾页
        var endNode = document.createElement("A");
        endNode.appendChild(document.createTextNode("尾页"));
        if (customPager.pageIndex < totalPageCount) {
			bind(customPager,totalPageCount,endNode);
        }
        else {
            endNode.className = "default-disabled";   //改为class
        }
        pagerNode.appendChild(endNode);



        document.getElementById(customPager.placeHolderId).innerHTML = "";
        if (totalPageCount > 1) {
            document.getElementById(customPager.placeHolderId).appendChild(pagerNode);
        }
    };

	//相对屏幕居中显示
    function makeCenter(id) {
        document.getElementById(id).style.display = "block";
        $('#' + id).css("top", Math.max(0, (($(window).height() - $('#' + id).outerHeight()) / 2) + $(window).scrollTop()) + "px");
        $('#' + id).css("left", Math.max(0, (($(window).width() - $('#' + id).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    }


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
			//分页样式
            this.pagerStyle = "defaultPager";
			//显示页码的容器id
			this.placeHolderId = "pager";
            
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
                pageHandleObj[pagerObj.pagerStyle](pagerObj);

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
                        pageHandleObj[pagerObj.pagerStyle](pagerObj);

                        if(pagerObj.pageCallback){
                            pagerObj.pageCallback(result);
                        }
                        
                    },
                    beforeSend: function() {
                        makeCenter("ajax-loader");
                    },
                    complete: function() {
                        $("#ajax-loader").hide();

                    }
                });
            },

            //设置当前页
            setCurrentIndex:function(pageIndex,totalCount){
                this.pageIndex = parseInt(pageIndex);
                if(totalCount && typeof totalCount == "number"){
                    this.totalCount = totalCount;
                }
                
                pageHandleObj[this.pagerStyle](this);
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

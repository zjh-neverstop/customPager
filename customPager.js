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
        //pageInfo.hasPrev = customPager.pageIndex > 1 ? "yes" : "no";
        if (customPager.pageIndex > 1) {
            pageInfo.hasPrev = "yes";
            var prev = document.createElement("A");
            prev.href = "#" + (customPager.pageIndex - 1);
            prev.onclick = function() {
                customPager.getPagedData(customPager.pageIndex - 1);
                return false;
            };
            prev.appendChild(document.createTextNode("< Prev"));
            pagerNode.appendChild(prev);
        }
        else {
            pageInfo.hasPrev = "no";
        }

        //是否额外显示第一页
        if (rangeStartIndex > 1) {
            var node = document.createElement("A");
            node.href = "#1";
            node.onclick = function() {
                customPager.getPagedData(1);
                return false;
            };
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
            node.href = "#" + i;

            //绑定事件，此处需注意闭包问题
            (function(i) {
                addHandler(node, "click", function() {
                    customPager.getPagedData(i);
                    return false;
                });
            })(i);
            node.appendChild(document.createTextNode(i));

            if (i == customPager.pageIndex) {
                node.className = "current";
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
            node.href = "#" + totalPageCount;

            node.onclick = function() {
                console.debug(totalPageCount);
                customPager.getPagedData(totalPageCount);
                return false;
            };
            node.appendChild(document.createTextNode(totalPageCount));
            pagerNode.appendChild(node);
        }

        //是否显示next
        pageInfo.hasNext = customPager.pageIndex < totalPageCount ? "yes" : "no";
        if (customPager.pageIndex < totalPageCount) {
            pageInfo.hasNext = "yes";

            var next = document.createElement("A");
            next.href = "#" + (customPager.pageIndex + 1);
            next.onclick = function() {
                customPager.getPagedData(customPager.pageIndex + 1);
                return false;
            };
            next.appendChild(document.createTextNode("Next >"));

            pagerNode.appendChild(next);
        }
        else {
            pageInfo.hasNext = "no";
        }

        document.getElementById("pager").innerHTML = "";
        document.getElementById("pager").appendChild(pagerNode);

    };


    var CustomPager = (function(window) {
        //全局配置
        var globalConfig = {};

        //构造函数
        var CustomPager = function(url, pageSize) {
            //当前页码
            this.pageIndex = 1;
            //每页行数
            this.pageSize = pageSize;
            //分页器中显示的页码数
            this.displayPageCount = 8;
            //总共行数
            this.totalCount = 0;
            this.url = url;
            this.orderField = "";
            this.orderDirection = "";
            //查询参数
            this.searchParams = {};

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
                params.orderField = pagerObj.orderField;
                params.orderDirection = pagerObj.orderDirection;

                $.ajax({
                    type: "POST",
                    url: this.url,
                    dataType: "html",
                    data: params,
                    success: function(result) {
                        var tempNode = document.createElement("DIV");
                        tempNode.style.display = "none";
                        tempNode.innerHTML = result;
                        document.body.appendChild(tempNode);
                        document.getElementById('resultArea').innerHTML = document.getElementById('resultData').innerHTML;
                        pagerObj.totalCount = document.getElementById("resultCount").innerHTML;
                        pageHandle(pagerObj);
                        document.body.removeChild(tempNode);
                    }
                });
            },

            configParams: function(params) {

            }
        };

        //工厂方法
        return function(url, pageSize) {
            return new CustomPager(url, pageSize);
        };
    })();

    window.CustomPager = CustomPager;

})(window, undefined);

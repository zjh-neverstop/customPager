/**
* Created by zhaojinghao on 14-9-19.
*/

//�Զ���ǰ�˷�ҳ��
(function(window) {

    //�¼�����
    var addHandler = function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    };

    //�󶨷�ҳ����
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

	var pageHandleObj = {};

    //����ҳ����ʾ�ķ���
    pageHandleObj.cnblogPager = function(customPager) {
        //�ܹ�ҳ��
        var totalPageCount = customPager.totalCount % customPager.pageSize == 0 ? parseInt(customPager.totalCount / customPager.pageSize) : parseInt(customPager.totalCount / customPager.pageSize) + 1;
        //��ʾҳ�������
        var displayPageCount = customPager.displayPageCount;
        var rangeStartIndex;
        var rangeEndIndex;

        var pagerNode = document.createElement("DIV");
        var pageInfo = {};

        rangeStartIndex = customPager.pageIndex - parseInt((displayPageCount / 2));
        rangeEndIndex = customPager.pageIndex + parseInt((displayPageCount / 2));


        //��Χ��ͷ�Ĵ���
        if (rangeStartIndex < 1) {
            rangeEndIndex = rangeEndIndex + (1 - rangeStartIndex);
            rangeStartIndex = 1;

            rangeEndIndex = rangeEndIndex > totalPageCount ? totalPageCount : rangeEndIndex;
        }

        //��Χ��β�Ĵ���
        if (rangeEndIndex > totalPageCount) {
            rangeStartIndex = rangeStartIndex - (rangeEndIndex - totalPageCount);
            rangeEndIndex = totalPageCount;

            rangeStartIndex = rangeStartIndex < 1 ? 1 : rangeStartIndex;
        }

        //�Ƿ���ʾprev
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

        //�Ƿ������ʾ��һҳ
        if (rangeStartIndex > 1) {
            var node = document.createElement("A");
            bind(customPager,1,node);
            node.appendChild(document.createTextNode("1"));
            pagerNode.appendChild(node);
        }

        //�Ƿ���ʾ��ʼʡ�Է�
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

        //�Ƿ���ʾ��βʡ�Է�
        if (rangeEndIndex + 1 < totalPageCount) {
            pageInfo.hasEndSeparator = "yes";
            pagerNode.appendChild(document.createTextNode("..."));
        }
        else {
            pageInfo.hasEndSeparator = "no";
        }

        //�Ƿ������ʾ���һҳ
        if (rangeEndIndex < totalPageCount) {
            var node = document.createElement("A");
            bind(customPager,totalPageCount,node);
            node.appendChild(document.createTextNode(totalPageCount));
            pagerNode.appendChild(node);
        }

        //�Ƿ���ʾnext
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
        //��ҳ��
        var totalPageCount = customPager.totalCount % customPager.pageSize == 0 ? parseInt(customPager.totalCount / customPager.pageSize) : parseInt(customPager.totalCount / customPager.pageSize) + 1;
        //��ʾҳ�������
        var displayPageCount = customPager.displayPageCount;
        var rangeStartIndex;
        var rangeEndIndex;

        //�������㷶Χ���м����
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

        //��ҳ
		var startNode = document.createElement("A");
		if (customPager.pageIndex > 1) {
            bind(customPager,1,startNode);
        }
        else {
            startNode.className = "default-disabled";   //��Ϊclass
        }
        
        startNode.appendChild(document.createTextNode("��ҳ"));
        pagerNode.appendChild(startNode);

        //��һҳ
        var prev = document.createElement("A");
		if (customPager.pageIndex > 1) {
            bind(customPager,customPager.pageIndex - 1,prev);
        }
        else {
            prev.className = "default-disabled";   //��Ϊclass
        }
        prev.appendChild(document.createTextNode("��һҳ"));
        pagerNode.appendChild(prev);
		


        //�Ƿ���ʾ��ʼʡ�Է�
        if (blockIndex > 0) {
            pageInfo.hasStartSeparator = "yes";
            var prevEllipsis = document.createElement("A");
            prevEllipsis.appendChild(document.createTextNode("..."));
            prevEllipsis.className = "shenglue";
			bind(customPager,parseInt((blockIndex - 1) * displayPageCount + 1),prevEllipsis);
            pagerNode.appendChild(prevEllipsis);
        }
        else {
            pageInfo.hasStartSeparator = "no";
        }


        for (var i = rangeStartIndex; i <= rangeEndIndex; i++) {
            var node = document.createElement("A");

            //���¼����˴���ע��հ�����
            /*(function(i) {
                addHandler(node, "click", function() {
                    customPager.getPagedData(i);
                    return false;
                });
            })(i);*/
			bind(customPager,i,node);
            node.appendChild(document.createTextNode(i));

            if (i == customPager.pageIndex) {
                node.className = "current";
            }

            pagerNode.appendChild(node);

        }

        //�Ƿ���ʾ��βʡ�Է�
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


        //��һҳ
        var next = document.createElement("A");
        next.appendChild(document.createTextNode("��һҳ"));
        console.log("typeof customPager:" + (typeof customPager.pageIndex));
        if (customPager.pageIndex < totalPageCount) {
			bind(customPager,(customPager.pageIndex + 1),next);
        }
        else {
            next.className = "default-disabled";   //��Ϊclass
        }
        pagerNode.appendChild(next);

        //βҳ
        var endNode = document.createElement("A");
        endNode.appendChild(document.createTextNode("βҳ"));
        if (customPager.pageIndex < totalPageCount) {
			bind(customPager,totalPageCount,endNode);
        }
        else {
            endNode.className = "default-disabled";   //��Ϊclass
        }
        pagerNode.appendChild(endNode);



        document.getElementById(customPager.placeHolderId).innerHTML = "";
        if (totalPageCount > 1) {
            document.getElementById(customPager.placeHolderId).appendChild(pagerNode);
        }
    };

	//�����Ļ������ʾ
    function makeCenter(id) {
        document.getElementById(id).style.display = "block";
        $('#' + id).css("top", Math.max(0, (($(window).height() - $('#' + id).outerHeight()) / 2) + $(window).scrollTop()) + "px");
        $('#' + id).css("left", Math.max(0, (($(window).width() - $('#' + id).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    }


    var CustomPager = (function(window) {
        //ȫ������
        var globalConfig = {};

        //���캯��
        var CustomPager = function(pageSize,url) {
            //��ǰҳ��
            this.pageIndex = 1;
            //ÿҳ����
            this.pageSize = pageSize;
            //��ҳ������ʾ��ҳ����
            this.displayPageCount = 8;
            //�ܹ�����
            this.totalCount = 0;
            //��ת����ַ
            this.baseUrl = '/';
            //server url
            this.url = url || "";
            //��ҳ��ʽ
            this.pageMode = "link";
            //��ѯ����
            this.searchParams = {};
			//��ҳ��ʽ
            this.pagerStyle = "defaultPager";
			//��ʾҳ�������id
			this.placeHolderId = "pager";
            
            /*
            ǰһ���汾�У�ֱ����html�ķ�ʽ���ر�����ݣ�������ֱ�������˷������ݵĸ�ʽ��
            ͨ������ص������������ݽ��ɵ������Լ�������ǿ�˷�ҳ��������ԣ����ܷܺ������knockoutjs��ܽ������ʹ��
            ���磺������mvvmģ���ж���һ����ҳ����Ȼ��ͨ������ص�����������ҳ����ȡ�����ݸ�ֵ��mvvm�е�������ԣ�
                  ��ʵ��UI���Զ�ˢ��
            */
            //��ȡ���ݺ�Ļص��¼�������������ʵ�����ݵĴ�����
            this.pageCallback = null;

        };

        //ԭ�ͺ���
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

            //���õ�ǰҳ
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

        //��������
        return function(pageSize,url) {
            return new CustomPager(pageSize,url);
        };
    })();

    window.CustomPager = CustomPager;

})(window, undefined);

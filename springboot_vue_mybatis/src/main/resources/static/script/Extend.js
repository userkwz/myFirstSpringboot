/*******************************************************************************************************************
使用说明
1.显示遮罩层
$.ShowMaskLayer(Bool)
参数Bool:是否在右上角显示关闭遮罩层的按钮 默认false
2.关闭遮罩层
$.CloseMaskLayer()
3.显示对话框
$(obj).ShowPromptBox(options)
参数options：是数组
{
showMask:true,      //是否显示遮罩层 默认true
site:"center",      //显示位置center(默认),topright,bottomright
position: 'fixed'   //定位方式 一般不改变
}
4.关闭对话框显示
$(obj).ClosePromptBox(Bool)
参数Bool：是否关闭遮罩层 默认:false
5.执行设置对话框
$(obj).IsPromptBox()
********************************************************************************************************************/
/**********************************************************
遮罩层显示
/********************************************************/

var lastObj_forClose;

jQuery.extend({
    maskLayerPara: {
        maskLayerID: "sev_dialog_mask_layer",
        loadingID: "sev_dialog_loading"
    },
    ShowMaskLayer: function (withclosebutton) {
        var showButton = false;
        if (withclosebutton != null)
            showButton = withclosebutton;
        var shadeLayer = $("body").find("#" + this.maskLayerPara.maskLayerID);
        if (shadeLayer.html() == null) {
            var htmlMaskLayer = "<div id=\"" + this.maskLayerPara.maskLayerID + "\"><a style=\"float:right;\" href=\"javascript:void(0)\"><span class=\"icon_cross_16px\"></span></a></div>";
            $("body").append(htmlMaskLayer);
            $("body").find("#" + this.maskLayerPara.maskLayerID + " a").click(function () { $.CloseMaskLayer(); $(lastObj_forClose).fadeOut(); });
        }
        if (showButton)
            $("body").find("#" + this.maskLayerPara.maskLayerID).find("a").css({ display: 'block' });
        else
            $("body").find("#" + this.maskLayerPara.maskLayerID).find("a").css({ display: 'none' });
        shadeLayer = $("body").find("#" + this.maskLayerPara.maskLayerID);
        shadeLayer.fadeTo("fast", 0.5);
    },
    CloseMaskLayer: function () {
        var shadeLayer = $("body").find("#" + this.maskLayerPara.maskLayerID);
        if (shadeLayer.html() != null) {
            $(eval(this.maskLayerPara.maskLayerID)).fadeOut("fast");
        }
    },
    ShowLoading: function (mask, opt) {
        if (mask == null)
            mask = false;
        var load = $("body").find("#" + this.maskLayerPara.loadingID);
        if (load.html() == null) {
            var htmDialog = "<div id=\"" + this.maskLayerPara.loadingID + "\" class='sev_loading_dialog' style='width:300px;'></div>";
            $("body").append(htmDialog);
        }
        if (opt == null)
        { opt = { showMask: mask, site: "bottomright", context: "<label class=\"icon_16px_loading1\"></label> 执行中、请稍等……" }; }
        $("#" + this.maskLayerPara.loadingID).ShowTip(opt);
    },
    UpdateLoadingText: function (txt, mask) {
        opt = { showMask: mask, site: "bottomright", context: "<label class=\"icon_16px_loading1\"></label> " + txt };
        $("#" + this.maskLayerPara.loadingID).ShowTip(opt);
    }
    ,
    ShowLoadingIframe: function (mask, opt) {
        if (mask == null)
            mask = false;
        var load = $("body").find("#" + this.maskLayerPara.loadingID);
        if (load.html() == null) {
            var htmDialog = "<div id=\"" + this.maskLayerPara.loadingID + "\" class='sev_loading_dialog' style='width:200px;'></div>";
            $("body").append(htmDialog);
        }
        if (opt == null)
        { opt = { showMask: mask, site: "bottomright", context: "<label class=\"icon_16px_loading1\"></label> 载入中、请稍等……" }; }
        $("#" + this.maskLayerPara.loadingID).ShowTipIframe(opt);
    },
    CloseLoading: function (mask) {
        $("#" + this.maskLayerPara.loadingID).ClosePromptBox(mask);
    },
    CloseSelfPromptBox: function (obj) {
        obj = $(obj).parent().parent();
        obj.ClosePromptBox(true);
        $.CloseLoading();
    },
    CloseSelfPromptBox: function (obj, cj) {
        var obj = $(obj);
        for (var i = 0; i < cj; i++) {
            obj = obj.parent();
        }
        obj.ClosePromptBox(true);
        $.CloseLoading();
    }
});
$(window).bind("keydown", function (event) {
    if (event.keyCode == '27') {
        $.CloseMaskLayer();
    }
});
/**********************************************************
提示框
/********************************************************/
(function ($) {
    var defaults = {
        showMask: true,
        site: "topcenter",
        position: 'fixed',
        context: ""
    };

    var pd_mouseDown = false;

    $.fn.ShowTip = function (options) {
        var obj = $(this);
        //alert(obj.attr("id"));
        lastObj_forClose = obj;
        var opts = $.extend({}, defaults, options);
        if (opts.showMask)
            $.ShowMaskLayer(true);
        var left = ($(window).width() - obj.width()) / 2;
        var top = ($(window).height() - obj.height()) / 2;
        obj.css({
            "z-index": "9998",
            "position": opts.position
        });
        obj.html(opts.context);
        refreshSite(obj, opts.site);
        obj.fadeIn("fast", function () {
            obj.html(opts.context);
            refreshSite(obj, opts.site);
        });
        $(window).resize(function () {
            refreshSite(obj, opts.site);
        });
        $(window).bind("keydown", function (event) {
            if (event.keyCode == '27') {
                $(obj).fadeOut("fast");
            }
        });
    }

    $.fn.ShowTipIframe = function (options) {
        var obj = $(this);
        var opts = $.extend({}, defaults, options);
        if (opts.showMask)
            $.ShowMaskLayer(true);
        obj.css({
            "z-index": "9998",
            "position": opts.position
        });
        var parentObj = $(window.parent.document).find("#offsetTag");
        if (parentObj.html() == undefined) {
            obj.ShowTip(options);
            return;
        }
        var topSite = (parentObj.offset().top + (($(window.parent).height() - obj.height()) / 2));
        if (topSite > 93) { topSite = topSite - 95; }
        else { topSite = 1; }
        obj.css({ "top": topSite.toString() + "px", "left": parseInt(($(window).width() - obj.width()) / 2) + "px" });
        obj.fadeIn("fast", function () {
            obj.css({ "top": topSite.toString() + "px", "left": parseInt(($(window).width() - obj.width()) / 2) + "px" });
            obj.html(opts.context);
        });

        $(window).resize(function () {
            obj.css({ "top": topSite.toString() + "px", "left": parseInt(($(window).width() - obj.width()) / 2) + "px" });
        });

        $(window).bind("keydown", function (event) {
            if (event.keyCode == '27') {
                $(obj).fadeOut("fast");
            }
        });

        $(window.parent).scroll(function () {
            topSite = (parentObj.offset().top + (($(window.parent).height() - obj.height()) / 2));
            if (topSite > 93) { topSite = topSite - 95; }
            else { topSite = 1; }
            obj.css({ "top": topSite.toString() + "px", "left": parseInt(($(window).width() - obj.width()) / 2) + "px" });
        });
    }

    $.fn.ShowPromptBoxIframe = function (options) {
        pd_mouseDown = false;
        var obj = $(this);
        var opts = $.extend({}, defaults, options);
        if (opts.showMask)
            $.ShowMaskLayer(true);

        obj.css({
            "z-index": "9998",
            "position": opts.position
        });

        var parentObj = $(window.parent.document).find("#offsetTag");
        if (parentObj.html() == undefined) {
            obj.ShowPromptBox(options);
            return;
        }

        var topSite = parseInt(parentObj.offset().top);
        if (topSite > 110) {
            topSite = topSite - 110;
        }
        //alert(topSite);
        obj.css({ "top": topSite.toString() + "px", "left": parseInt(($(window).width() - obj.width()) / 2) + "px" });

        obj.fadeIn("fast", function () {
            obj.css({ "top": topSite.toString() + "px", "left": parseInt(($(window).width() - obj.width()) / 2) + "px" });
        });

        $(window).resize(function () {
            obj.css({ "top": topSite.toString() + "px", "left": parseInt(($(window).width() - obj.width()) / 2) + "px" });
        });

        $(window).bind("keydown", function (event) {
            if (event.keyCode == '27') {
                $(obj).fadeOut("fast");
            }
        });
        $(window.parent).scroll(function () {
            topSite = parseInt(parentObj.offset().top);
            if (topSite > 110) { topSite = topSite - 110; }
            else { topSite = 1; }
            obj.css({ "top": topSite.toString() + "px", "left": parseInt(($(window).width() - obj.width()) / 2) + "px" });
        });
    }

    $.fn.ShowPromptBox = function (options) {
        pd_mouseDown = false;
        var obj = $(this);
        if (obj.width() < 400) {
            obj.css({ "width": "400px" });
        }
        if (obj.height() < 200) {
            obj.find('.box_content').css({ "height": "200px" });
        }
        var opts = $.extend({}, defaults, options);
        if (opts.showMask)
            $.ShowMaskLayer(true);
        var left = ($(window).width() - obj.width()) / 2;
        var top = ($(window).height() - obj.height()) / 2;
        obj.css({
            "z-index": "9998",
            "position": opts.position
        });
        refreshSite(obj, opts.site);
        obj.fadeIn("fast", function () { refreshSite(obj, opts.site); });
        $(window).resize(function () {
            refreshSite(obj, opts.site);
        });
        $(window).bind("keydown", function (event) {
            if (event.keyCode == '27') {
                $(obj).fadeOut("fast");
                document.documentElement.style.overflow = 'auto';
            }
        });
        document.documentElement.style.overflow = 'hidden';
    }
    $.fn.ClosePromptBox = function (closeMask) {
        pd_mouseDown = false;
        $(this).fadeOut("fast");
        if (closeMask == true)
        { $.CloseMaskLayer(); }
        document.documentElement.style.overflow = 'auto';
    }
    $.fn.IsBox = function (title, content) {
        var obj = this;
        if (!obj.hasClass("sev_box_frame")) {
            obj.addClass("sev_box_frame");
        }

        if (obj.find(".box_content").length <= 0) {
            obj.wrapInner("<div class=\"box_content\"></div>");
        }
        if (obj.find(".box_content").prev().html() == null) {
            obj.find(".box_content").before("<p class=\"box_title\">" + title + "</p>");
        }
        else {
            obj.find(".box_title").text(title);
        }
        if (content != undefined) {
            obj.find(".box_content").html(content);
        }
        return obj;
    }

    $.fn.IsPromptBox = function (moveBox) {
        $(this).css({ "display": "none", "color": "#666", "font-size": "12px" });
        if (moveBox == null || moveBox == false)
            return;
        $(this).css({ "cursor": "move" });
        var x; var y; var top; var left; var clix; var cliy; var fx; var fy;
        var width; var height;
        $(this).mousedown(function (f) {
            pd_mouseDown = true;
            if (!f) {
                f = window.event;
            }
            fx = f.clientX;
            fy = f.clientY;
            top = $(this).offset().top;
            left = $(this).offset().left;
            width = $(window).width();
            height = $(window).height();
        });
        $(this).mousemove(function (e) {
            if (!e) {
                e = window.event;
            }
            clix = e.clientX;
            cliy = e.clientY;
            newtop = $(this).offset().top;
            newleft = $(this).offset().left;
            if (pd_mouseDown == true) {
                $(this).css({ 'top': top + (cliy - fy), 'left': left + (clix - fx) });
            }
        });
        $(this).mouseup(function () {
            pd_mouseDown = false;
            newtop = $(this).offset().top;
            newleft = $(this).offset().left;
            if (newtop < 15)
                $(this).animate({ "top": "15px" });
            if (newleft < 15)
                $(this).animate({ "left": "15px" });
            if (newtop > ($(window).height() - $(this).height() - 25))
                $(this).animate({ "top": ($(window).height() - $(this).height() - 25) });

            if (newleft > ($(window).width() - $(this).width() - 25))
                $(this).animate({ "left": ($(window).width() - $(this).width() - 25) });
        });
    }
    var refreshSite = function (obj, site) {
        if (site == "center") {
            obj.css({ "top": parseInt(($(window).height() - obj.height() - 10) / 2) + "px", "left": parseInt(($(window).width() - obj.width()) / 2) + "px" });
        }
        else if (site == "topcenter") {
            obj.css({ "top": "30px", "left": parseInt(($(window).width() - obj.width()) / 2) + "px" });
        }
        else if (site == "topright") {
            obj.css({ "top": "4px", "left": parseInt($(window).width() - obj.width() - 30) + "px" });
        }
        else if (site == "bottomright") {
            obj.css({ "top": parseInt(($(window).height() - obj.height() - 30)) + "px", "left": parseInt($(window).width() - obj.width() - 30) + "px" });
        }
        else {
            obj.css({ "top": parseInt(($(window).height() - obj.height() - 10) / 2) + "px", "left": parseInt(($(window).width() - obj.width()) / 2) + "px" });
        }
    }
})(jQuery);


/*
*   基础功能实现
*   使用此文件需要首选应用JQuery,EasyUI
*   2015-8-13
*/
var BaseFunc = {
    //参数集合
    "baseParams": {
        dialogDivID: "div_for_dialog_nc"
    },
    //获取地址参数
    "getUrlParam": function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    //动态添加脚本
    "AddHeadScriptTages": function (new_src) {
        var allScript = $("head").find("script[src='" + new_src + "']");
        var src = $(allScript).attr("src");
        if (src == null) {
            var t = "<script src=\"" + new_src + "\" type=\"text\/javascript\"><\/script>";
            $("head").append(t);
        }
    },
    "AddScript": function (src, type) {
        if (type == null)
        { type = "text/javascript"; }
        var add = true;
        var oHead = document.getElementsByTagName('head').item(0);
        for (var i = 0; i < oHead.childNodes.length; i++) {
            if (oHead.childNodes[i].src && oHead.childNodes[i].src.indexOf(src.replace(/\.\.\//g, '')) != -1) {
                var oScirpt = document.createElement("script");
                oScirpt.type = type;
                oScirpt.src = src;

                oHead.replaceChild(oScirpt, oHead.childNodes[i]);
                add = false;
                break;
            }
        }
        if (add) {
            var scirpt = document.createElement("script");
            scirpt.type = type;
            scirpt.src = src;
            oHead.appendChild(scirpt);
        }
    },
    "AddLink": function (href, type, rel) {
        if (type == null) {
            type = "text/css";
        }
        if (rel == null) {
            ref = "stylesheet";
        }
        var add = true;
        var es = document.getElementsByTagName('link');
        for (var i = 0; i < es.length; i++) {
            if (es[i]['href'].indexOf(href.replace(/\.\.\//g, '')) != -1) {
                add = false;
                break;
            }
        }
        if (add) {
            var oHead = document.getElementsByTagName('head').item(0);
            var oLink = document.createElement("link");
            oLink.type = type;
            oLink.href = href;
            oLink.rel = rel;
            oHead.appendChild(oLink);
        }
    },
    //用于移除脚本
    "RemoveHeadScriptTages": function (src) {
        var tag = $("head").find("script[src='" + src + "']");
        if (tag != null) {
            tag.remove();
        }
    },
    //刷新脚本
    "RefshHeadScriptTage": function (src) {
        BaseFunc.AddScript(src);
        return;
        var tag = $("head").find("script[src='" + src + "']");
        if (tag == null) {
            BaseFunc.AddHeadScriptTages(src);
        }
        else {
            BaseFunc.RemoveHeadScriptTages(src);
            BaseFunc.AddHeadScriptTages(src);
        }
    },
    //动态添加CSS
    "AddHeadCSSTages": function (new_src) {
        var allScript = $("head").find("link[href='" + new_src + "']");
        var src = $(allScript).attr("href");
        if (src == null) {
            var t = "<link rel=\"stylesheet\" type=\"text\/css\" href=\"" + new_src + "\" \/>";
            $("head").append(t);
        }
    },
    //移除添加CSS
    "RemoveHeadCSSTages": function (src) {
        var tag = $("head").find("link[href='" + src + "']");
        if (tag != null) {
            tag.remove();
        }
    },
    //刷新添加CSS
    "RefshHeadCSSTage": function (src) {
        var tag = $("head").find("link[href='" + src + "']");
        if (tag == null) {
            LoadCSS.AddHeadCSSTages(src);
        }
        else {
            LoadCSS.RemoveHeadCSSTages(src);
            LoadCSS.AddHeadCSSTages(src);
        }
    },
    /*基于EASY UI 实现的对话框*/
    "OpenDialog": function (url, title, height, width, backColor) {
        if (width == null) {
            width = 900;
        }
        if (backColor == null) {
            backColor = "#FFF";
        }
        var tmp = $("#" + this.baseParams.dialogDivID);
        if (tmp.html() == undefined) {
            $("body").append("<div id=\"" + this.baseParams.dialogDivID + "\"></div>");
            tmp = $("#" + this.baseParams.dialogDivID);
            tmp.dialog({
                resizable: false, closed: true, modal: true, width: width, height: 300
                //                ,buttons: [{ text: '关闭', iconCls: 'icon-no', handler: function () {
                //                    tmp.dialog("close");
                //                }}]
            });
        }
        tmp.css({ "background-color": backColor });
        if (height == -1) {
            tmp.dialog("resize", { height: $(window).height() - 30 });
        }
        else {
            tmp.dialog("resize", { height: height });
        }
        tmp.dialog("move", { top: 5 });
        tmp.dialog("open");
        tmp.dialog('refresh', url);
        tmp.dialog("setTitle", title);
        tmp.dialog("hcenter");
    },
    "CloseDialog": function () {
        $("#" + this.baseParams.dialogDivID).dialog("close");
    },
    //获取浏览器版本
    "GetBrowserInfo": function () {
        var agent = navigator.userAgent.toLowerCase();
        var regStr_ie = /msie [\d.]+;/gi;
        var regStr_ff = /firefox\/[\d.]+/gi
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;
        //IE
        if (agent.indexOf("msie") > 0) {
            return agent.match(regStr_ie);
        }
        //firefox
        if (agent.indexOf("firefox") > 0) {
            return agent.match(regStr_ff);
        }
        //Chrome
        if (agent.indexOf("chrome") > 0) {
            return agent.match(regStr_chrome);
        }
        //Safari
        if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
            return agent.match(regStr_saf);
        }
    }
};

jQuery.cookie = function (key, value, options) {
    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);
        if (value === null) {
            options.expires = -1;
        }
        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }
        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

/***************消息提示**********************/
//提示
function Alert(msg) {
    $.messager.alert('提示', msg, 'info');
    $("#messager_alert").append("<iframe style='position:absolute;z-index:-1;width:100%;height:100%;left:0;top:0;scrolling:no;border-left:0;border-top:0;background: '#050a30';' frameborder='1'></iframe>");
}

//提示+处理
function AlertAndDo(msg, fn) {
    $.messager.alert('提示', msg, 'info', fn);
    $("#messager_alert").append("<iframe style='position:absolute;z-index:-1;width:100%;height:100%;left:0;top:0;scrolling:no;border-left:0;border-top:0;background: '#050a30';' frameborder='1'></iframe>");
}

//错误提示
function ShowError(msg) {
    $.messager.alert('错误', msg, 'error');
}

//错误提示+处理
function ShowErrorAndDo(msg, fn) {
    $.messager.alert('错误', msg, 'error', fn);
}

//问题
function ShowQuestion(msg) {
    $.messager.alert('问题', msg, 'question');
}

//问题+处理
function ShowQuestionAndDo(msg, fn) {
    $.messager.alert('问题', msg, 'question', fn);
}

//警告
function ShowWarning(msg) {
    $.messager.alert('警告', msg, 'warning');
}

//警告+处理
function ShowWarningAndDo(msg, fn) {
    $.messager.alert('警告', msg, 'warning', fn);
}

/****************确认对话框********************/
//确认对话框
function Confirm(title, msg, fn) {
    $.messager.confirm(title, msg, fn);
    $("#messager_confirm").append("<iframe style='position:absolute;z-index:-1;width:100%;height:100%;left:0;top:0;scrolling:no;border-left:0;border-top:0;' frameborder='1'></iframe>");
}

/****************弹出输入框********************/
//弹出输入框
function Prompt(title, msg, fn) {
    $.messager.prompt(title, msg, fn);
}

/****************进度条**********************/
//显示进度条
function ShowProgress() {
    //$.messager.progress();
    $.messager.progress({
        title: '请稍候,正在加载数据.....',
        onOpen: function () {
            var iframeWidth = $(this).parent().parent().width();

            var iframeHeight = $(this).parent().parent().height();

            var windowWidth = $(this).parent().width();
            var windowHeight = $(this).parent().height();

            var setWidth = (iframeWidth - windowWidth) / 2;
            var setHeight = (iframeHeight - windowHeight) / 2;
            $(this).parent().css({
/* 修正面板位置 */
                left: setWidth,
                top: setHeight
            });

            if (iframeHeight < windowHeight) {
                $(this).parent().css({
/* 修正面板位置 */
                    left: setWidth,
                    top: 0
                });
            }
        }
        //msg: '正在加载数据......'
    });
}

//关闭进度条
function CloseProgress() {
    $.messager.progress('close');
}
/*************** 日期处理 *************/

function myformatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}

function myparser(s) {
    //if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    var d = parseInt(ss[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
    } else {
        return new Date();
    }
}
function DateFormatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '年' + (m < 10 ? ('0' + m) : m) + '月' + (d < 10 ? ('0' + d) : d) + '日';
}
function DateTimeFormatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mm = date.getMinutes();
    var s = date.getSeconds();
    return y.toString() + SjFormater(m).toString() + SjFormater(d).toString()
     + SjFormater(h).toString() + SjFormater(mm).toString() + SjFormater(s).toString();
}
function DateTimeFormat(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mm = date.getMinutes();
    var s = date.getSeconds();
    return y.toString() + '/' + SjFormater(m).toString() + '/' + SjFormater(d).toString() + ' '
     + SjFormater(h).toString() + ':' + SjFormater(mm).toString() + ':' + SjFormater(s).toString();
}
function SjFormater(t) {
    return (t < 10 ? ('0' + t) : t);
}
function DateParser(s) {
    var ss = (s.split(' '))[0];
    var arr = (s.split('/'));
    var y = parseInt(arr[0], 10);
    var m = parseInt(arr[1], 10);
    var d = parseInt(arr[2], 10);
    return y + '年' + (m < 10 ? ('0' + m) : m) + '月' + (d < 10 ? ('0' + d) : d) + '日';
    //return DateFormatter(myparser(ss));
    //return ss;
}
//function getStartDate() {
//    var date = new Date();
//    var year = date.getFullYear() - 1;
//    var startDate = year + '年12月26日';
//    return startDate;
//}

//function getEndDate() {
//    var date = new Date();
//    var strMonth = date.getMonth();
//    strMonth = strMonth + 1;
//    strMonth = strMonth == 13 ? 0 : strMonth;
//    if (strMonth < 10) {
//        strMonth = '0' + strMonth;
//    }
//    var strDay = date.getDate();
//    if (strDay < 10) {
//        strDay = '0' + strDay;
//    }
//    var startDate = date.getFullYear() + '年' + strMonth + '月' + strDay + '日';
//    return startDate;
//}

function getDate(date) {
    if (undefined == date) {
        return null;
    }
    var result = '';
    if (date.length >= 11) {
        result = date.substr(0, 4) + '-' + date.substr(5, 2) + '-' + date.substr(8, 2);
    }
    return result;
}
function getOraDate(date) {
    if (undefined == date) {
        return null;
    }
    var result = '';
    if (date.length == 11) {
        result = date.substr(0, 4) + '' + date.substr(5, 2) + '' + date.substr(8, 2);
    }
    return result;
}




//j
//获取combotree中选择的值
function getdwbmj(cbo) {
    var i = 0;
    //    var strdwbmj = "v_current_userInfo.DWBM";
    var strdwbmj = "";
    var dwbmj = $(cbo).combo('getValues');
    for (var i = 0; i < dwbmj.length; i++) {
        var dwbm = dwbmj[i].substring(1);
        if (strdwbmj == "") {
            strdwbmj = dwbm;
        }
        else {
            strdwbmj = strdwbmj + "," + dwbm;
        }
    }
    return strdwbmj
}
/*
* 获取字符串的真实长度
*/
function getLength(str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        }
        else {
            realLength += 2;
        }
    }
    return realLength;
}

/*
* 除去字符串的左空格
*/
function ltrim(s) {
    return s.replace(/(^\s*)/g, "");
}

/*
* 除去字符串的右空格
*/
function rtrim(s) {
    return s.replace(/(\s*$)/g, "");
}

/*
* 去除首尾空格
*/
function trim(s) {
    return s.replace(/(^\s*) | (\s*$)/g, "");
}

/*
* 判断字符串是否为空
*/
function isNull(data) {
    return (data == "" || data == undefined || data == null) ? true : false;
}

//电话验证 11位数字以1开头
function HRFilePhonevalidate(textString) {
    var reg = new RegExp(/^1\d{10}$/);
    if (reg.test(textString)) {
        return true;
    } else {
        return false;
    }
}


//简单的身份验证
function IsCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(card)) {
        return true;
    }
    return false;
}

//验证律师证件是否为17位纯数字
function IsLawyerID(id) {
    var reg = new RegExp(/^\d{17}$/);
    if (reg.test(id)) {
        return true;
    }
    else {
        return false;
    }
}

//邮箱验证
function mainIsValidate(textString) {
    var reg = new RegExp(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/);
    if (reg.test(textString)) {
        return true;
    } else {
        return false;
    }
}

// 错误信息处理
// 通过Ajax调用一般处理程序返回结果进行错误信息处理及过滤
// 一般处理程序返回数据为封装有异常信息及数据类转换的JSON
// 并且错误信息为result.ErrMsg,数据为result.Data
function doActionWithErrorHandle(result, func) {
    if (result == null || result == undefined) return;

    if (result.ErrMsg != null&&result.ErrMsg != undefined &&result.ErrMsg != '') {
        Alert(result.ErrMsg);
        return;
    }

    if (result.Data!= null&&result.ErrMsg != undefined) 
        func(result.Data);
}

// 获取系统名称
function getSystemName() {
    /*
    var sysName = '短信推送平台';
    // 调用一般处理程序获取注册信息
    $.ajax({
        type: "GET",
        url: "/Handler/Account/login.ashx",
        data: { action: 'SysName' },
        async: false,
        success: function (result) {
            sysName = result;
        }
    });
    if (sysName == null || sysName == '') {
        sysName = '短信推送平台';
    }
    */
    return "海南综合业务管理平台";
}

//获取二级系统名称
function getSubSystemName() {
    return "海南综合业务管理平台";
}

//获取主页面标题
function getMainPageTitle() {
    return "海南综合业务管理平台";
}

//@ sourceURL=uploadify.js
var editor;
var setMailPosition = 0;       // 添加邮件地址位置0：发送人 1：抄送人 默认为发送人
var serverPath;
var fileNames='';
//自定义表单验证规则
$.extend($.fn.validatebox.defaults.rules, {
    thisemailone: {
        validator: function (value, param) {
            var i;
            var zzbds = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            var thisvalue = value.split(";");
            var a ;
            for (i = 0; i < thisvalue.length; i++) {
                if (zzbds.test(thisvalue[i])) {
                    a = true
                }
                else{
                    return false
                }
            }
            return a
        },
        message: '请输入正确的邮箱地址'
    }
});
$(document).ready(function () {
    document.getElementById('uploadify_file').innerHTML = '';
    frameObject.ClearPicture();
    //getTXL("");
    // 界面标签样式设置及事件绑定
    case_import_marksInit();
    AddOperationLog('发送邮件');
});

// 界面标签样式设置及事件绑定
function case_import_marksInit() {
    

    var param = new UrlSearch();
    loadHtmlTemplete(param);

    // 初始化通讯录树
    initMailTree();

    $('#mail_lxr').textbox({
        icons: [{
            iconCls: 'icon-search',
            disabled: false,
            handler: function (e) {
                var mess = $(e.data.target).textbox('getValue');
                if (mess == '')
                    initMailTree();
                else {
                    getTXL(mess);
                }
                

            }
        }]

    });
    // 初始化上传控件
    init_case_uploadify();

    //点击上传过后
    $('#btn_case_excle_confirm').linkbutton({
        onClick: function () {
            upload_case_file();
        }
    });

}

var fileId = 0;
function init_case_uploadify() {

    $("#uploadify_case").uploadify({
        //限制文件大小
        'fileSizeLimit': "5000KB",
        //显示的高度和宽度，默认 height 30；width 120
        'height': 20,
        'width': 80,
        //上传文件的类型  默认为所有文件    'All Files'  ;  '*.*'
        //在浏览窗口底部的文件类型下拉菜单中显示的文本
//        'fileTypeDesc': 'Excel Files',
        //允许上传的文件后缀
//        'fileTypeExts': '*.xls;',
        //发送给后台的其他参数通过formData指定
        //'formData': { 'someKey': 'someValue', 'someOtherKey': 1 },
        //上传文件页面中，你想要用来作为文件队列的元素的id, 默认为false  自动生成,  不带#
        'queueID': 'fileQueue_case_upload',
        //选择文件后自动上传
        'auto': false,
        //设置为true将允许多文件上传
        'multi': true, //'swf': '/Script/uploadify/uploadify.swf',
        'swf': '../../Script/uploadify/uploadify.swf',
        'uploader': '/Handler/common.ashx?action=Upload',
        'uploadLimit': 3,
        'removeCompleted': true,
        //'buttonImage': '/Fun/Modules/24_y.png',
        'onCancel': function (file) {

        },
        'onUploadSuccess': function (file, data, response) {
            fileId++;
            var id = "file" + fileId;
            document.getElementById('uploadify_file').innerHTML += "<span id='" + id + "'><a class='fileName'>" + file.name + ";</a><a class='fileRemove' onClick=\"removeFile('" + id + "','" + file.name + "')\">&nbsp;X</a></span>";
            fileNames += file.name+";";
            serverPath = data;
            CloseProgress();
            //load_word(data);
        },
        'onQueueComplete': function (queueData) {

        },
        'onSelect': function (file) {
            //            console.log('上传文件' + file);
            ShowProgress();
            $('#uploadify_case').uploadify('upload', '*');
        },
        'onUploadError': function (file, errorCode, errorMsg, errorString) {
            CloseProgress();
            alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
        }
    });

    //$("#uploadify_case").uploadify('cancel', '*');
    var rows = $("#dg_excle_case_list").datagrid('getData');
    for (var i in rows) {
        //$("#dg_excle_case_list").datagrid('deleteRow', i);
    }
}


//根据邮件类型加载html模板
function loadHtmlTemplete(param) {
    var queryData = {
        emailType: param.sendMail,
        cbdwmc: param.cbdw,
        dwmc: param.dwmc,
        bmsah: param.bmsah,
        nr: param.nr,
        ywmc: param.ywmc,
        ajsl: param.ajsl,
        cbbm: param.cbbm
    };
    $.post('/Handler/AJXX/AJXXHandler.ashx?action=GetHtmlContent', queryData,
                function (result) {
                    //window.location.href = result;
                    CloseProgress();
                    KindEditor.html('#mail_Content', result);
                    //$('#mail_Content').textbox('setValue', result);
                });
}

//开始上传
function upload_case_file() {

    if ($(".uploadify-queue-item").length > 0) {
        $('#uploadify_case').uploadify('upload', '*');
    }
    else {
        Alert("请先选择文件!");
    }
}

function send_Email() {
    
    var queryData = { 
    reciver: $('#mail_Reciver').val(),
    content: encodeURI(content),
    subject: $('#mail_Subject').val(),
    copy: $('#mail_Copy').val(),
    file: serverPath, 
    fileName: fileNames };
    $.post('/Handler/AJXX/AJXXHandler.ashx?action=SendEmail', queryData,
        function(result) {
            if (result == "1") {
                $.messager.alert('警告', '发送成功');
            } else {
                $.messager.alert('警告', '发送失败');
            }
        });
}

function showMailAddress(address) {
    $('#mail_Reciver').textbox('setValue', address);


}

function getTXL(mc) {
    var queryData = {
        dwbm: unitCode,
        mc:mc
    };

    $.post('/Handler/TXL/TXLHandler.ashx?action=GetTXL', queryData,
    function (result) {

        var data = eval('(' + result + ')');
        var html = "";
        for (var i = 0; i < data.length; i++) {
            html += "<li style=\"cursor: pointer;font-size:14px;color:#00fdff\" onclick=\"showMailAddress('" + data[i].dzyx + ";')\">" + data[i].mc + "</li>";
        }

        $('#ullxr').html(html);
    });

}

function initMailTree() {
    // 初始化通讯录邮件联系人树 
    //alert(unitCode);
    $("#ullxr").tree({
        url: '/Handler/Mail/MailHandler.ashx?action=GetTXLTREE&dwbm=' + unitCode,
        method: 'post',
        lines: true,
        onLoadSuccess: function (node, data) {
            //加载成功，展开登录用户单位的子节点
            var dNode = $('#ullxr').tree('find', unitCode); //获取顶级节点
            $('#ullxr').tree('select', dNode.target);
            $('#ullxr').tree('expand', dNode.target);
        },
        onSelect: function (node) {
            var bm = node.id;
            setMailAddress(bm);
        }
    });

    // 添加邮件地址位置为发送人
    $('#mail_Reciver').textbox({
        inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
            click: function(event) {
                setMailPosition = 0;
            }
        })
    });
    // 添加邮件地址位置为抄送人
    $('#mail_Copy').textbox({
        inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
            click: function (event) {
                setMailPosition = 1;
            }
        })
    });
}

// 将邮件地址绑定到地址栏中
function setMailAddress(mailAddress) {
    //alert(setMailPosition);
    if (mailAddress.indexOf("@") < 0) {
        return;
    }

    var vMail;
    if (setMailPosition == 0) {
        vMail = $('#mail_Reciver').textbox('getValue');
        if (vMail.indexOf(mailAddress) < 0) {
            if (vMail == "") {
                vMail = mailAddress;
            } else {
                vMail = vMail + ";" + mailAddress;
            }
        }
        $('#mail_Reciver').textbox('setValue', vMail);
    } else {
        vMail = $('#mail_Copy').textbox('getValue');
        if (vMail.indexOf(mailAddress) < 0) {
            if (vMail == "") {
                vMail = mailAddress;
            } else {
                vMail = vMail + ";" + mailAddress;
            }
        }
        $('#mail_Copy').textbox('setValue', vMail);
    }
}

function removeFile(fileId,fileName) {
    $('#' + fileId).remove();
    fileNames=fileNames.replace(fileName, '');
}

$(document).ready(function () {
    if (CheckBrowser()) {
        $.ajax({
            type: "post",
            async: true,
            data: { type: "tyyw" },
            url: "/Handler/ZSK/ZSKHandler.ashx?action=GetFile",
            success: function (result) {
                var data = eval(result);
                AddBook(data);
            },
            error: function (data) {

            }
        });
    }
});

function AddBook(data) {
    for (var i = 0; i < data.length; i++) {
        var book = data[i];
        var name = book.FileName.substr(3,book.FileName.length);
        var html = "<div class=\"agzsk_xqk\"><div class=\"agzsk_xqk_tp_tow\" onClick=\"downLoadBook('" + book.Url + "')\">" +
            "<div class='tyyw_log'></div><br><br>" +
            "<p class=\"agzsk_xqk_mc\">全国检察机关</p>" +
            "<p class=\"agzsk_xqk_mc\">统一业务应用系统</p><br>" +
            "<p class=\"agzsk_xqk_mc\">使用指引手册</p>" +
            "<p class=\"agzsk_xqk_nr\"> " + name + "</p>" +
            "</div><div class=\"agzsk_xqk_wz_tow\" title=" +name + ">" +name + "</div></div>";
        $('#agzsk_div').append(html);
    }
}

function downLoadBook(url) {
    frameObject.DownFiles(baseUrl + url);
}
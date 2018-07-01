
$(function () {

    var $loginGo = $("#login_go");
    $loginGo.bind("click", function () {
        signIn();
    });

    // 读取Cookie值 (用户名)
    var username = decodeURI(getCookie("username"));
    $("#input_login_username").val(username)

});


/**
 * 登录
 */
function signIn() {

    var dwbm = $('#input_login_dwbm').combotree('getValue');
    var username = $("#input_login_username").val();
    var password = $("#input_login_password").val();

    if (!username) {
        $("#yhmcw").text("请输入用户名！");
        return;
    }
    if (!password) {
        $("#mmcw").text("请输入密码！");
        return;
    }


    $.ajax({
        url: getRootPath() + "/account/signIn",
        type: 'post',
        async: false,
        data: {
            "dwbm": dwbm,
            "username": username,
            "password": password
        },
        dataType: 'json',
        success: function (res) {
            if (res.status === 200) {
                window.location.href = "./index.html";
            } else {
              Alert(res.note);
            }
        },
        error: function () {
            alert("登录验证异常!");
        }
    });
}
//回车登录
$(document).keyup(function(event){
    if(event.keyCode == 13){
        $("#login_go").click()
    }
})

function goLogin() {
    window.location.href = "login.html";
}

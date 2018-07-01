
$(function() {
    $(".li_yjcd").click(function() {
        var thisstyle = $(this).siblings(".ul_two").css('display')
        if (thisstyle == 'none') {
            $(".ul_two").slideUp();
            $(this).siblings(".ul_two").slideDown();
        } else {
            $(this).siblings(".ul_two").slideUp();
        }
    });
    //三级菜单
    $(".sjcd_ul").hover(function () {
        $(this).parent(".ul_two_li").css("background", "#0967af");
    });
    $(".ul_two_li_text").click(function () {
        var thisstyle = $(this).siblings(".sjcd_ul").css('display');
        if (thisstyle == 'none') {
            $(".slideUpDown").css("background-image", "url(../images/index/slideUp.png)");
            $(this).children().css("background-image", "url(../images/index/slideDown.png)");
            $(".sjcd_ul").slideUp();
            $(this).siblings(".sjcd_ul").slideDown();

        }
        else {
            $(this).children().css("background-image", "url(../images/index/slideUp.png)");
            $(this).siblings(".sjcd_ul").slideUp();
        }
    });
    $(".li_yjcd").click(function() {
        $(".slideUpDown").css("background-image", "url(../images/index/slideUp.png)");
        $(".sjcd_ul").hide();

    });
})
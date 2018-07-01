
function init(){
    leef_widthClick();
    gbsyshow();
    close_click();
}
//tab点击样式添加f
function leef_widthClick(){
    $(".leef_width").click(function(){
        $(this).addClass("leef_width_click");
        $(this).siblings().removeClass("leef_width_click");
    });

}
//关闭所有样式
function gbsyshow(){
    $(".tab_menu").mouseover(function() {
        $(".gbsy").show();
    });
    $(".gbsy").mouseover(function() {
        $(".gbsy").show();
    });
    $(".gbsy").mouseout(function() {
        $(".gbsy").show();
    })
    $(".tab_menu").mouseout(function() {
        $(".gbsy").hide();
    });
    $(".gbsy_buttom").click(function() {
        $(".leef_width_onone").remove();
        $("#home").click();
    });
}

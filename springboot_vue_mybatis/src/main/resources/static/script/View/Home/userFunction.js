$(function () {
    var tree = setTree(userFuntions);
    $('#userFunction').append(tree);

})

/*function setTree(data) {
    var cate = '';
    for (var i = 0; i < data.length; i++) {
        var pro = data[i];
        if (!isNull(pro.fbm)) {
            continue;
        }
        if (pro.mc == "首页") {
            continue;
        }
        cate += "<li>";
        cate += "<div class='li_yjcd' style=\"background-image: url('" + pro.ct + "')\">" + pro.mc + "</div>";
        var j = 0, x = 0;
        cate += "<ul class='ul_two'>";
        for (j=0; j < data.length; j++) {
            var child = data[j];
            if (pro.bm == child.fbm) {
                if (child.cscs != "" && child.cscs != null) {
                    cate += "<li class='ul_two_li'>";
                    cate += "<div class='ul_two_li_text' onClick=\"opOnClick('" + child.mc + "','" + child.url + "','" + child.cscs + "','" + child.baseurl + "')\">●&nbsp;" + child.mc + "</div>";
                    cate += "</li>";
                } else {
                    var k = 0, z = 0;
                    cate += "<li class='ul_two_li'>";
                    if (child.cxj == null || child.cxj == '') {
                        cate += "<div class='ul_two_li_text'>●&nbsp;" + child.mc + "<div class='slideUpDown'></div></div>";

                    }
                    cate += "<ul class='sjcd_ul'>";
                    for (k; k < data.length; k++) {
                        var gn = data[k];
                        if (child.bm == gn.fbm) {
                            z++;
                            if (gn.cscs != "" && gn.cscs != null) {
                                cate += "<li class='sjcd_ul_li' onClick=\"opOnClick('" + gn.mc + "','" + gn.url + "','" + gn.cscs + "','" + gn.baseurl + "')\">" + gn.mc + "</li>";
                            }
                        }
                    }
                    cate += "</ul>";

                    cate += "</li>";
                }
            }
        }
        cate += "</ul>";
        cate += "</li>";
    }
    return cate;
}*/

function opOnClick(name, localurl, id,baseUrl) {
    if (localurl == "" || localurl == null) {
        Alert("正在建设中，敬请期待！");
        return;
    }
    else if ($('#' + id).length >= 1) {
        $('.leef_width_click').removeClass('leef_width_click');
        $("#" + id).click();
        $("#" + id).addClass('leef_width_click');
    }
    else {
        $(".leef_width").removeClass("leef_width_click");
        var lione = " <li class=\"leef_width leef_width_click leef_width_onone\" id='"+ id + "'> <div onClick=\"opOnClick('" + name + "','" + localurl + "','" + id + "')\">";
        var litwo = name == '首页' ? '</div></li>' : "</div><span class=\"close close_click\" onClick=\"tabClose('"+  id +"')\">×</span></li>";
        var litext = lione + name + litwo;
        $("#tabTop").append(litext);
    }
    selectedUrl = localurl;

    if (this.baseUrl == baseUrl || baseUrl == "" || baseUrl == undefined) {
        $.ajax({
            url: localurl,
            cache: false,
            success: function (html) {
                $('div.combo-p').remove();
                $('div.window').remove();
                $('div.panel').remove();
                $('div.window-mask').remove();
                $('div.window-shadow').remove();
                $('.tab_content_wrapper').html(html);
            }
        });
        close_click();
    } else {
        frameObject.OpenDialogWeb(3, baseUrl + localurl, '', '', name, '', false);
        frameObject.ClearPicture();
    }
}

function tabClose(id) {

    var tab = $('#' + id);
    //$('.tab_click').remove();
    $('div.combo-p').remove();
    $('div.window').remove();
    $('div.panel').remove();
    $('div.window-mask').remove();
    $('div.window-shadow').remove();
    if (tab.is(".leef_width_click")) {
        var prev = tab.prev();
        tab.remove();
        prev.children('div').click();
//        $(this).parent(".leefidth").remove();
    } else {
        tab.remove();
//        $(this).parent(".leef_width").remove();
//        opOnClick("首页", homeUrl, "home");
    }
}

//关闭选项卡
function close_click() {

    $(".close_click").click(function () {

        if ($(this).parent(".leef_width").is(".leef_width_click")) {
            $(this).parent(".leef_width").prev().click();
            $(this).parent(".leef_width").remove();
        } else {
            $(this).parent(".leef_width").remove();
        }
    });
}

/*function cancellation() {
    if (frameObject != null || frameObject != undefined) {
        frameObject.Cancellation();
    }
}*/

/*function setMin() {
    if (frameObject != null || frameObject != undefined) {
        frameObject.SetMin();
    }
}*/
/*
function setMax() {
    if (frameObject != null || frameObject != undefined) {
        frameObject.SetMax();
    }
}*/

/*function setClose() {
    if (frameObject != null || frameObject != undefined) {
        frameObject.Close();
    }
}*/


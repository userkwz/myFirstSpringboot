//@ sourceURL=index.js
$(document).ready(function () {
    var parm = new UrlSearch();
    $('#con_href').attr('href', 'tjfx_index.html');
    $('.menu-ul>li').eq(0).css('background-color', '#0774CC').css('color', '#fff').addClass('libg');
    $('.menu-ul>li').click(function () {
        $(this).css('background-color', '#0774CC').css('color', '#fff').addClass('libg');
        $('.menu-ul>li').not(this).css('background-color', '#ADD2EF').css('color', '#004782').removeClass('libg');
    });
});



function loadhome() {
    $('#con_href').panel({ href: 'View/tjsjjy/tjfx_index.html' });
}

function loadoperation() {
    $('#con_href').panel({ href: 'View/tjsjjy/operationAnalysis.html' });
}

function loadquestion() {
    $("#con_href").panel({ href: 'View/tjsjjy/questionAnalysis.html' });
}

function loadunit() {
    $('#con_href').panel({ href: 'View/tjsjjy/unitAnalysis.html' });
}

function loadvalidation() {
    $('#con_href').panel({ href: 'View/tjsjjy/validationReport.html' });
}

function loadbasechart() {
    $('#con_href').panel({ href: 'View/tjsjjy/basechart.html' });
}
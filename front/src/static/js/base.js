/**
 * Created by byhaejin on 2018. 4. 13..
 */
var pageNum1 = pageNum1 || '';
var pageNum2 = pageNum2 || '';
var fcObj = {
    jdom : [],
    pageStart: function () {
        //page navigation
        if (pageNum1) {
            $('.topmenu').find('.id-'+pageNum1).addClass('on');
            $('.sidemenu').find('.id-'+pageNum1).addClass('on');
            $('.id-'+pageNum1+'__'+pageNum2).addClass('on');

            //side menu
            $('#nav-mobile').sidenav();
            $('.collapsible').collapsible();
        }
    }
};
$(document).ready(function() {
    fcObj.pageStart();
});
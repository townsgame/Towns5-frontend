/**
 * @author ©Towns.cz
 * @fileOverview User interface initialization
 */
//======================================================================================================================


//------------------------------------------------------------------eu_cookies

$(function(){

    if(document.cookie.indexOf('eu_cookies=1')==-1){
        $('#eu_cookies').show();
    }


    $('#eu_cookies').click(function() {

        setCookie('eu_cookies',1);
        $('#eu_cookies').hide();
    });

});

//======================================================================================================================
//T.UISCRIPT

window.uiScript = function(){

    r('uiScript');


    //todo ??? $(document).on('contextmenu', function (event) { event.preventDefault(); });

    $('body').disableSelection();

/*    $('#selecting-distance').disableSelection();
    $('.menu').disableSelection();
    $('.menu-list-item').disableSelection();
    $('.menu-dlist-item').disableSelection();
    $('#objectmenu').disableSelection();
    $('.close').disableSelection();*/

    //==================================================================================================================popup action

    // kliknutie na .js-popup-action-open trigger...
    $('.js-popup-action-open').unbind('click').on('click', function(e){

        //e.preventDefault();
        //r('Kliknutí na nástroj');
        $('.active').removeClass('active');

        if($(this).attr('selectable')=='1') {


            if ($(this).hasClass('active') === false) {
                //---------------------------------Označení nástroje
                r('Označení nástroje');

                $(this).addClass('active');
                /* jshint ignore:start */
                eval($(this).attr('action'));
                /* jshint ignore:end */

                //---------------------------------
            } else {
                //---------------------------------Odznačení všeho
                r('Odznačení všeho');

                $('#popup-action').hide();
                mapSpecialCursorStop();

                //---------------------------------
            }

        }else{

            /* jshint ignore:start */
            eval($(this).attr('action'));
            /* jshint ignore:end */

        }

    });


    $('.js-popup-action-open').unbind('mouseenter').on('mouseenter', function(e){


        //---------------------------------Zobrazení nápovědy
        //r('Zobrazení nápovědy');
        var content=$(this).attr('content');
        var title=$(this).attr('popup_title');

        if(is(title) || is(content)) {

            var html='';

            if(is(title))
            html+='<h2>'+title+'</h2>';

            if(is(content))
            html+='<p>'+content+'</p>';

            var offset=$(this).offset();


            var max_top=T.Math.toInt($( window ).height())-T.Math.toInt($( '#popup-action' ).height())-20;

            var top=T.Math.toInt(offset.top);
            if(top>max_top)top=max_top;

            var arrow_top=T.Math.toInt(offset.top)-top+20;

            if(arrow_top<T.Math.toInt($( '#popup-action' ).height())){
                $('#popup-action .arrow').css('margin-top',arrow_top).css('visibility','visible');
            }else{
                $('#popup-action .arrow').css('visibility','hidden');
            }

            $('#popup-action').css('top',top);



            $('#popup-action .content').html(html);

            $('#popup-action').stop();
            $('#popup-action').css('opacity',1);
            $('#popup-action').show();


        }else{

            $('#popup-action').hide();
        }

        //---------------------------------

    });

    $('.js-popup-action-open, #popup-action').unbind('mouseleave').on('mouseleave', function(e){
        $('#popup-action').fadeOut(200);
    });


    $('#popup-action').unbind('mouseenter').on('mouseenter', function(e){
        $('#popup-action').stop();
        $('#popup-action').css('opacity',1);
        $('#popup-action').show();
    });





    //==================================================================================================================popup story




    // kliknutie na js-popup-window-open trigger zobrazí overlay a popup-window
    $('.js-popup-window-open').unbind('click').on('click', function(){

        var page=$(this).attr('page');
        T.Plugins.open(page);

    });

    // kliknutie na overlay schová overlay a popup-window
    $('.overlay').unbind('click').on('click', function(){
        T.UI.popupWindow.close();
    });

    // kliknutie na js-popup-window-close trigger schová overlay a popup-window
    $('.js-popup-window-close').unbind('click').on('click', function(){
        T.UI.popupWindow.close();
    });


    //==================================================================================================================popup notification



    // kliknutie na js-popup-notification-open trigger zobrazí popup-notification
    $('.js-menu-top-popup-open').unbind('click').on('click', function(event){
        event.stopPropagation();//todo wtf?

        var page=$(this).attr('page');


        var left = $(this).position().left-360;
        $('#menu-top-popup-'+page).css('left',left);


        $('.menu-top-popup').not('#menu-top-popup-'+page).hide();
        $('#menu-top-popup-'+page).toggle();

    });

    // kliknutie na otvorený popup-notification neurobí nič
    $('.popup-notification').unbind('click').on('click', function(event){
        event.stopPropagation();
    });


    //------------------------------------


    // kliknutie na document schová oba
    $(document).unbind('click').on('click', function(){

        $('.menu-top-popup').hide();

    });




    //==================================================================================================================esc keyup




    // ak sa klikne tlačítkom esc ...
    $(document).unbind('keyup').keyup(function(e) {

        // ... a ak to tlačítko je esc (27)...
        if (e.keyCode == 27) {
            // ... schovaj action-popup
            $('.action-wrapper').removeClass('active');

            // ... schovaj overlay
            $('.overlay').hide();

            // schovaj popup-window
            $('.popup-window').hide();

            // schovaj popup-notification
            $('.popup-notification').hide();
        }
    });

    //==================================================================================================================selecting_distance Click

    $('#selecting-distance-ctl .button-icon').off();


    //todo pri klikani na tyhle tlacitka vycentrovat selecting distance
    $('#selecting-distance-plus').unbind('click').click(function(){

    //todo sounds ion.sound.play("door_bump");

        if(building){
            building.getModel().size+=0.1;
            if(building.getModel().size>2.5)building.getModel().size=2.5;//todo funkce pro bounds

            r(building.getModel().size);

            T.UI.Menu.Building.redraw();
        }else{
            selecting_distance+=100;
            updateSelectingDistance();
        }
    });

    $('#selecting-distance-minus').unbind('click').click(function(){//todo refactor move to separate toolbox file

        //todo sounds ion.sound.play("door_bump");


        if(building){
            building.getModel().size-=0.1;
            if(building.getModel().size<0.5)building.getModel().size=0.5;

            r(building.getModel().size);

            T.UI.Menu.Building.redraw();
        }else{
            selecting_distance-=100;
            updateSelectingDistance();
        }
    });

    $('#selecting-distance-left').unbind('click').click(function(){
        //todo sounds ion.sound.play("door_bump");
        building.getModel().rotation+=10;
        T.UI.Menu.Building.redraw();
    });

    $('#selecting-distance-right').unbind('click').click(function(){
        //todo sounds ion.sound.play("door_bump");
        building.getModel().rotation-=10;
        T.UI.Menu.Building.redraw();
    });

    $('#selecting-distance-close').unbind('click').click(function(){
        //todo sounds ion.sound.play("door_bump");
        mapSpecialCursorStop();
        $('#popup-action').hide();
    });


    //==================================================================================================================




    //todo usages?
    $('.towns-window'/*todo all classes scss+js should be AllFirstLetters*/).unbind('click').click(function(e){
        e/*todo use e or event???*/.preventDefault();


        var html='<iframe src="'+$(this).attr('href')+'" class="popup-window-iframe"></iframe>';
        T.UI.popupWindow.open($(this).attr('title'),html);

    });


    //==================================================================================================================


    /*r(T.TownsAPI.townsAPI.online);
    if(T.TownsAPI.townsAPI.online){

        $('input.js-townsapi-online').prop('disabled',false);
        $('button.js-townsapi-online').animate({opacity:1});

    }else{

        $('input.js-townsapi-online').prop('disabled',true);
        $('button.js-townsapi-online').animate({opacity:0.4});

    }*/





    //==================================================================================================================




};


//======================================================================================================================
//SPECIAL CURSOR

var specialCursor=false;

//----------

window.mapSpecialCursorStart = function(){

    specialCursor=true;
    $('#map_drag').draggable('disable');
    map_selected_ids=[];

};

//----------

window.mapSpecialCursorStop = function(){

    specialCursor=false;

    $('#map_drag').draggable('enable');


    $('#selecting-distance-ctl').hide();
    $('#selecting-distance').hide();
    $('.active').removeClass('active');

    T.UI.Menu.Building.stop();
    T.UI.Menu.Building.dismantlingStop();
    T.UI.Menu.Terrains.stop();
    T.UI.Menu.Story.stop();
};

//======================================================================================================================
//LEFT MENU


window.showLeftMenu = function(html){

    for(i=0;i<5;i++)
        html+='<br>';

    $('#objectmenu-inner').html(html);
    $('#objectmenu').animate({left:0}, 200);

    uiScript();

};

//----------

window.hideLeftMenu = function(){

    $('.action-wrapper').removeClass('active');
    $('#objectmenu').animate({left:-60}, 200);
};





//======================================================================================================================
//ONLOAD

$(function(){


    mapSpecialCursorStop();
    uiScript();



});

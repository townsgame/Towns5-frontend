/**
 * @author ©Towns.cz
 * @fileOverview Creates Class Towns.Page
 */
//======================================================================================================================


/**
 * Creates page
 * @param {string} uri
 * @param {string|Array} title(s)
 * @param {string|Array} content(s)
 * @param {function} open_callback
 * @param {function} close_callback
 * @constructor
 */
Towns.Page=function(uri,title,content,open_callback=false,close_callback=false,format='NORMAL') {

    if(typeof title=='string')title=[title];
    if(typeof content=='string')content=[content];

    this.uri = uri;
    this.titles = title;
    this.contents = content;
    this.open_callback = open_callback;
    this.close_callback = close_callback;
    this.format = format;

};


/**
 * Open page in popup window
 */
Towns.Page.prototype.open = function(additional_callback=false,additional_parameters=false){


    //--------------------------------------------title
    if(this.titles.length==1){

        var title=this.titles[0];

    }else{


        var title=this.titles.map(
            function(title,i){

                title = title.text2html();
                title = '<li child="'+i+'">'+title+'</li>';//todo use XML namespaces

                return(title);

            }
        ).join('');
        title='<ul id="page-choose">'+title+'</ul>';

    }
    //--------------------------------------------


    //--------------------------------------------content
    if(this.contents.length==1){

        var content=this.contents[0];

    }else{


        var content=this.contents.map(
            function(content,i){

                content = '<article class="page-child" id="page-child-'+i+'" style="display: none;">'+content+'</article>';//todo use XML namespaces

                return(content);

            }
        ).join('');


    }

    //-----------------

    content=content.split('{{');


    for(var i=1,l=content.length;i<l;i++){

        content[i]=content[i].split('}}');



        content[i][0]=Locale.get(content[i][0]);
        content[i]=content[i].join('');


    }
    content=content.join('');
    //--------------------------------------------



    URI.plugin=this.uri;
    URI.write();


    var self=this;

    //--------------------------------------------UI.popupWindowOpen
    UI.popupWindowOpen(title,content,function(){

        if(self.close_callback){
            self.close_callback();
        }

        URI.plugin=false;
        URI.object=false;
        URI.write();
    },this.format);
    //--------------------------------------------


    //--------------------------------------------Subpage controler
    if(this.titles.length!=1) {

        $('#page-choose li:nth-child(1)').addClass('selected');
        $('#page-child-0').show();

        $('#page-choose li').click(function () {

            $(this).parent().find('.selected').removeClass('selected');
            $(this).addClass('selected');


            var page_child = $(this).attr('child');

            //todo effects
            $('.page-child').not('#page-child-' + page_child).hide(/*"slide", { direction: "left" }, 1000*/);//.hide();
            $('#page-child-' + page_child).show(/*"slide", { direction: "right" }, 1000*/);


        });

    }
    //--------------------------------------------



    if(this.open_callback) {
        setTimeout(function () {
            self.open_callback($('.popup-window .content')[0]/*
            todo use this
            todo better solution
            */);
        },IMMEDIATELY_MS);
    }

    if(additional_callback) {
        setTimeout(function () {
            additional_callback.apply(this,additional_parameters);
        },IMMEDIATELY_MS);
    }


    /*if(this.close_callback) {
        UI.popupWindowCloseCallback=this.close_callback;
    }*/

};

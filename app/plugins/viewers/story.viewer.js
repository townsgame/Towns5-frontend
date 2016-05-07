/**
 * @author ©Towns.cz
 * @fileOverview Story viewer
 */
//======================================================================================================================


T.Plugins.install(new T.Plugins.Viewer(
    'story'
    ,{
        type: 'story'
    }
    ,''
    ,`
        <article></article>

        <div class="author">
        </div>

    `//todo should js-story-edit be class or id(current) ???
    ,function(object,page){


        r(object);


        var content = $(markdown.toHTML(object.getMarkdown()));
    
        content.find('img').each(function(){
    
            var src = $(this).attr('src');
            src = URI(src)
                .removeSearch("width")
                .addSearch({ width: 800 })//todo constant maybe POPUP_WINDOW_NORMAL_WIDTH
                .toString()
            ;
    
            $(this).attr('src',src);
    
        });
    
        content=content.outerHTML();//todo use this

    
        $(page).find('article').html(content);


        /*T.User = class{
            constructor(){

            }
        };*/


        T.TownsAPI.townsAPI.get('users/'+object.owner,{},function(response){


            var name;

            if(response.profile.name || response.profile.surname){

                name = response.profile.name+' '+response.profile.surname;

            }else{

                name = response.profile.username;

            }


            var email_md5 = md5(response.profile.email);


            var signature_html = `

                <div class="user-signature">
                    <img class="user-image" src="https://1.gravatar.com/avatar/` + email_md5 + `?s=80&r=pg&d=mm">

                    <div class="user-signature-text">
                        <h1 class="user-name">`+name+`</h1>
                        <p>`+response.profile.description.html2text()+`</p>
                    </div>

                </div>

            `;



            $(page).find('.author').html(signature_html);

        });











    
    
        T.UI.popupWindow.setTitle(object.name);
    
    
    
    }


));
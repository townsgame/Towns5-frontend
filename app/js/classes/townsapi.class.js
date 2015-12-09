/**

     ████████╗ ██████╗ ██╗    ██╗███╗   ██╗███████╗     █████╗ ██████╗ ██╗
     ╚══██╔══╝██╔═══██╗██║    ██║████╗  ██║██╔════╝    ██╔══██╗██╔══██╗██║
        ██║   ██║   ██║██║ █╗ ██║██╔██╗ ██║███████╗    ███████║██████╔╝██║
        ██║   ██║   ██║██║███╗██║██║╚██╗██║╚════██║    ██╔══██║██╔═══╝ ██║
        ██║   ╚██████╔╝╚███╔███╔╝██║ ╚████║███████║    ██║  ██║██║     ██║
        ╚═╝    ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝    ╚═╝  ╚═╝╚═╝     ╚═╝
     © Towns.cz

 * @fileOverview Towns API Wrapper, Only temporary file

 */


//======================================================================================================================token


//todo refactor as class

//======================================================================================================================

function townsApiEscape(query){

    //----------------------Následující escapování se dá udělat výrazně elegantněji, tohle by ale mělo fungovat i ve starších verzích PHP
    var separator='';
    var i,l;
    for(i=0,l=query.length;i<l;i++){

        if(query[i] instanceof Array){

            for(ii=0,ll=query[i].length;ii<ll;ii++){

                query[i][ii]=query[i][ii].split('\\').join('\\\\');
                query[i][ii]=query[i][ii].split(',').join('\\,');
            }

            query[i]=query[i].join(',');

        }

        query[i]=query[i].split('\\').join('\\\\');
        query[i]=query[i].split(',').join('\\,');

    }
    //r(query);
    query=query.join(',');
    //----------------------

    return(query);

}


//======================================================================================================================

function townsApi(query,callback){
    //r('townsApi');

    //output=json - Některé funkce např ad nebo Model vrací přímo obrázek. Pokud je v GET parametrech output=json je místo toho vrácen json s klíčem url na daný obrázek.



    query=townsApiEscape(query);

    //r(query);

    var response;

    var request = $.ajax({
        type: 'POST',
        url: townsApiUrl,
        data: {q:query},
        dataType: 'jsonp',
        timeout: 4000000
    });



    request.done(function( data ){
        //r('done');
        //r(data);
        callback(data);
    });


    request.fail(function( jqXHR, textStatus ) {
        r('error');
        //r(data);
    });

    //----------------------

    return(request);
}

//======================================================================================================================

function townsApiMulti(querys,callback){

    var response,data={};

    for(var i= 0,l=querys.length;i<l;i++){
        data['q'+(i+1)]=townsApiEscape(querys[i]);
    }



    var request = $.ajax({
        type: 'POST',
        url: townsApiUrl,
        data: data,
        dataType: 'jsonp',
        timeout: 4000000
    });



    request.done(function( data ){
        //r('done');
        //r(data);
        callback(data);
    });


    request.fail(function( jqXHR, textStatus ) {
        r('error');
        //r(data);
    });

    //----------------------

    return(request);
}

//======================================================================================================================


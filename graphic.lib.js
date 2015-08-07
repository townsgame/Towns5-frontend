
//----------------

var map_loaded=false;

//----


var map_zoom=-3;
var map_rotation=0;//Math.random()*360;
var map_slope=30;


//var map_perspective= 0.02;
var map_perspective= 0;

var map_x=(Math.random()-0.5)*10000;
var map_y=map_x+(Math.random()-0.5)*2000;

//var map_x=0;
//var map_y=0;


//----

var map_zoom_delta=0;
var map_rotation_delta=0;
var map_slope_delta=0;
var map_perspective_delta= 0;

var map_x_delta=0;
var map_y_delta=0;
var map_size_delta=0;

//----------------

var canvas_mouse_x = 0;
var canvas_mouse_y = 0;
var map_mouse_x = 0;
var map_mouse_y = 0;

terrainCount=13;



//----------------
/*
seedCount=1;
//----

treeCount=1;
rockCount=1;*/

//----------------

seedCount=6;
//----

treeCount=6;
rockCount=6;

//----------------Odvozene hodnoty

var map_size;

var map_zoom_m;
var map_z_data;
var map_bg_data;

var size_water;
var size_spring;
var size_summer;
var size_autumn;
var size_winter;

var map_rotation_r;
var map_rotation_sin;
var map_rotation_cos;
var map_rotation_sin_minus;

var map_slope_m;
var map_slope_n;





//----------------Konstanty


pi=3.1415
gr=1.62;


//----------------------------------------------------------------------------------------------------------------------




//drawModel(ctx,res);




//----------------------------------------------------------------------------------------------------------------------Prednacitani


function imageLoad(){

    all_images_loaded++;


    //$('#loadbar').html(all_images_bg_loaded+'/'+all_images_bg_count);
    var percent=Math.floor((all_images_loaded/all_images_count)*100);

    $('#loadbar').html(percent+'%');



    if(all_images_loaded === all_images_count) {
        map_loaded=true;
        updateMap();
        $('#loadbar').remove();
    }

}


//----------------------------------------------------------------Pocet



var all_images_count=terrainCount*seedCount+treeCount+rockCount;
var all_images_loaded=0;


//----------------------------------------------------------------Podklad

var all_images_bg=[];
for(var terrain=0;terrain<terrainCount;terrain++) {


    all_images_bg[terrain] = [];
    for (var seed = 0; seed < seedCount; seed++) {


        all_images_bg[terrain][seed] = new Image();
        all_images_bg[terrain][seed].src = 'terrain.php?terrain=t' + (terrain+1)/*Teren 0 je temnota*/ + '&seed=' + seed + '&size=120';

        all_images_bg[terrain][seed].onload = imageLoad;


    }
}

//----------------------------------------------------------------Tree

var all_images_tree=[];
for (var seed = 0; seed < treeCount; seed++) {


    all_images_tree[seed] = new Image();
    all_images_tree[seed].src = 'treerock.php?type=tree&seed=' + seed + '&width=100';
    //all_images_tree[seed].src = 'ui/image/tree/' + seed + '.png';

    all_images_tree[seed].onload = imageLoad;


}
//----------------------------------------------------------------Rock

var all_images_rock=[];
for (var seed = 0; seed < rockCount; seed++) {


    all_images_rock[seed] = new Image();
    all_images_rock[seed].src = 'treerock.php?type=rock&seed=' + seed + '&width=133';

    all_images_rock[seed].onload = imageLoad;


}





//----------------------------------------------------------------------------------------------------------------------loadMap


function loadMap() {

    var map_data = getMap(Math.round(map_x-(map_size/2)), Math.round(map_y-(map_size/2)), map_size);

    //console.log(map_data);

    map_z_data = map_data[0];
    map_bg_data = map_data[1];

    delete map_data;

}

loadMap();

//----------------------------------------------------------------------------------------------------------------------


function drawMap(){
    //alert('drawMap');
    //console.log('drawMap');
    //----------------


    map_bg_ctx.clearRect ( 0 , 0 ,canvas_width , canvas_height );
    //map_bg_ctx.fillStyle = "#000000";
    //map_bg_ctx.fillRect( 0 , 0 ,canvas_width , canvas_height );




    /*
    var x_direction=1;
    var y_direction=1;
    if(map_rotation>0 && map_rotation<=90 ){
        var x_direction = -1;
        var y_direction = 1;
    }else
    if(map_rotation>90 && map_rotation<=180 ){
        var x_direction=-1;
        var y_direction=-1;
    }else
    if(map_rotation>180 && map_rotation<=270 ){
        var x_direction=1;
        var y_direction=-1;
    }else
    if(map_rotation>270 && map_rotation<=360 ) {
        var x_direction=1;
        var y_direction=1;
    }





    for(var y=(y_direction==1?0:map_size-1);y_direction*y<y_direction*(y_direction!=1?-1:map_size);y+=y_direction){



        for(var x=(x_direction==1?0:map_size-1);x_direction*x<x_direction*(x_direction!=1?-1:map_size);x+=x_direction){*/





    for(var view_y=Math.floor(-map_size/2);view_y<Math.ceil(map_size/2);view_y+=1){



        for(var view_x=Math.floor(-map_size/2);view_x<Math.ceil(map_size/2);view_x++){



            var x=Math.round(map_rotation_cos*view_x - map_rotation_sin_minus*view_y+(map_size/2));
            var y=Math.round(map_rotation_sin_minus*view_x + map_rotation_cos*view_y+(map_size/2));



            //var x=Math.round(0.4*50 - 0.4*50);
            //var y=Math.round(0.4*50 + 0.4*50);


            //console.log(map_rotation_cos);
            //console.log(x,y);

            if(x>=0 && y>=0 && x<map_size && y<map_size /*Math.pow(x-(map_size/2),2)+Math.pow(y-(map_size/2),2)<=Math.pow(map_size/2,2)*/) {

                //console.log(x,y);

                /*var x=view_y;
                 var y=view_y;*/


                var terrain = map_bg_data[y][x] - 1/*Teren 0 je temnota*/;
                //var terrain = 9;

                if (terrain != -1) {
                    var xc = x - map_x + Math.round(map_x) - (map_size - 1) / 2;
                    var yc = y - map_y + Math.round(map_y) - (map_size - 1) / 2;

                    var world_x = x + Math.round(map_x) - Math.round(map_size/2);
                    var world_y = y + Math.round(map_y) - Math.round(map_size/2);


                    if (terrain == 0 || terrain == 10){

                        map_z_data[y][x] = 0.1;
                        var size=size_water;

                    }
                    else
                    if(terrain == 8 || terrain == 11){//Jaro
                        var size=size_spring;
                    }
                    else
                    if(terrain == 12 || terrain == 3 || terrain == 7){//Leto
                        var size=size_summer;
                    }
                    else
                    if(/*terrain == 9 ||*/ terrain == 5){//Podzim
                        var size=size_autumn;
                    }
                    else
                    if(terrain == 2 || terrain == 6){//Zima
                        var size=size_winter;
                    }
                    else{
                        size=1

                    }




                    var z = (Math.pow(map_z_data[y][x], (1 / 12))-0.85) * -6000;

                    //z += 8000;
                    //z+=canvas_height-(map_size*160);


                    var width = Math.ceil(160 * size * 3 * map_zoom_m);
                    var height = Math.ceil(width  /* map_zoom_m*/);


                    screen_x = ((map_rotation_cos * xc - map_rotation_sin * yc ) * 160 - 160*size) * map_zoom_m;
                    screen_y = ((map_rotation_sin * xc + map_rotation_cos * yc ) * 160 - 160*size) / map_slope_m * map_zoom_m + z / map_slope_n * map_zoom_m;


                    var horizont = (map_rotation_sin * xc + map_rotation_cos * yc - 1);
                    horizont = Math.pow(1 + (map_perspective * (1 - (1 / map_slope_m))), horizont);


                    //(screen_y/canvas_height)

                    screen_x = screen_x * horizont;
                    screen_y = screen_y * horizont;
                    width = width * horizont;
                    height = height * horizont;

                    //Posuv Dolu//screen_y -= canvas_height*(Math.pow(map_slope_m,map_perspective)-1)*10;

                    screen_x += (canvas_width / 2);
                    screen_y += (canvas_height / 2);


                    if(screen_x>-(width/2) && screen_y>-(height/2) && screen_x<canvas_width && screen_y<canvas_height+(160*size)){

                        var seed = numberOfPrimes(world_x * world_y - 1, seedCount - 1) % seedCount;



                        if(Math.pow(screen_x-canvas_mouse_x,2)+Math.pow(screen_y-canvas_mouse_y,2)<10){
                            map_mouse_x=world_x;
                            map_mouse_y=world_y;
                        }


                        map_bg_ctx.drawImage(
                            all_images_bg[terrain][seed],
                            screen_x,
                            screen_y,
                            width,
                            height);


                        /*console.log(
                            all_images_bg[terrain][seed],
                            screen_x,
                            screen_y,
                            width,
                            height);
                        return;*/



                        //----------------------------------------------------------------------------------------------Virtuální objekty
                        if((terrain==9 /*&& map_data[y+1][x]!=4 && map_data[y-1][x]!=4 && map_data[y][x+1]!=4 && map_data[y][x-1]!=4*/ ) || terrain==4) {



                            var object_seed=(Math.pow(world_x,2)+Math.pow(world_y,2))%(terrain==9?treeCount:rockCount);

                            var object=(terrain==9?all_images_tree[object_seed]:all_images_rock[object_seed]);


                            if(terrain==9){
                                var size=1;
                            }else{
                                var size=1*(Math.sin((Math.pow(world_x,4)+Math.pow(world_y,2))/10)+1);
                             }


                            var object_width=object.width*(width/100)*size;
                            var object_height=object.height*(width/100)*size;


                            object_xc=xc;
                            object_yc=yc;

                            object_xc+=Math.sin((Math.pow(world_x,2)+Math.pow(world_y,2))/10)/1.41;
                            object_yc+=Math.sin((Math.pow(world_x,4)+Math.pow(world_y,1))/10)/1.41;


                            object_screen_x = ((map_rotation_cos * object_xc - map_rotation_sin * object_yc ) * 160 - 160*size) * map_zoom_m;
                            object_screen_y = ((map_rotation_sin * object_xc + map_rotation_cos * object_yc ) * 160 - 160*size) / map_slope_m * map_zoom_m + (z-300) / map_slope_n * map_zoom_m;


                            var horizont = (map_rotation_sin * object_xc + map_rotation_cos * object_yc - 1);
                            horizont = Math.pow(1 + (map_perspective * (1 - (1 / map_slope_m))), horizont);


                            object_screen_x = object_screen_x * horizont;
                            object_screen_y = object_screen_y * horizont;

                            object_screen_x += (canvas_width / 2)  + (width/2)  - (object_width/2);
                            object_screen_y += (canvas_height / 2) + (height/2) - (object_height)+(object_width/2)/*-40+object_deep*/;

                            //Posuv Dolu//object_screen_y -= canvas_height*(Math.pow(map_slope_m,map_perspective)-1)*10;


                            map_bg_ctx.drawImage(
                                object,

                                object_screen_x,
                                object_screen_y,

                                /*screen_x+(width/2)-(object_width/2),
                                screen_y+(height/2)-(object_height)+(object_width/4),*/

                                object_width,
                                object_height);


                        }
                        //----------------------------------------------------------------------------------------------
                        if(terrain==4){



                            /*for(var i=0;i<2000;i++){

                                xx=(s*100)+(x*s);
                                yy=(s*330)+(y*s*0.5);

                                dist2=Math.sqrt(Math.pow(x-cx,2)+Math.pow(y-cy,2));

                                a=(127-lvl);
                                if(a<1)a=1;if(a>127)a=127;


                                tmpcolor=  imagecolorallocatealpha(img, round(gr/32)*32, round(gr/32)*32, round(gr/32)*32,a);

                                imagefilledellipse(img, xx+posuvx, yy+posuvy-lvl, rx, ry+(lvl/5), tmpcolor);
                                imagefilledellipse(img2, xx+posuvx+(lvl*Math.sqrt(2)*0.4)+4, yy+posuvy+(lvl*Math.sqrt(2)*0.1), rx, ry+(lvl/5), shade);



                                imagecolordeallocate(img, tmpcolor);

                                px=x;py=y;
                                x+=rand(-1,1);
                                y+=rand(-1,1);
                                gr+=(rand(-1,1)+2*(-x+px))/2;

                                dist1=Math.sqrt(Math.pow(x-cx,2)+Math.pow(y-cy,2));

                                distq=dist1-dist2;

                                tmp=Math.abs(x-px)*rand(0,10)*-ceil(distq)+vv;
                                if(tmp>maxk)tmp=maxk;if(tmp<-maxk)tmp=-maxk;
                                lvl+=tmp;
                                rx+=rand(-1,1);
                                ry+=rand(-1,1);

                                bounds=80;
                                if(dist1>bounds){x=px;y=py;}

                                if(gr<30)gr=30;if(gr>130)gr=130;
                                if(lvl<-5)lvl=-5;if(lvl>200)lvl=200;
                                if(rx<2)rx=2;if(rx>11)rx=11;
                                if(ry<2)ry=2;if(ry>11)ry=11;

                            }*/

                        }
                        //----------------------------------------------------------------------------------------------






                    }


                }
            }

        }


        //map_bg_ctx.fillStyle = 'rgba(200,200,250,'+(0.3/(y))+')';
        //map_bg_ctx.fillRect( 0 , 0 ,canvas_width , canvas_height );


    }






}




//----------------------------------------------------------------------------------------------------------------------updateMap



function updateMap(ms){


    if(typeof ms=='undefined'){


        var timeLast=time;
        tmp = new Date();
        time = (new Date()).getTime();
        delete tmp;

        if(timeLast==0){
            var ms=0;
            fps=0;
        }else{
            var ms=time-timeLast;
            fps=Math.round(100000/ms)/100;

        }



    }

    console.log(ms);


    //if(!map_loaded)return
    if(!ms)ms=1000;

    //----------------

    map_zoom+=map_zoom_delta*ms/1000;
    map_rotation+=map_rotation_delta*ms/1000;
    map_slope+=map_slope_delta*ms/1000;
    map_perspective+=map_perspective_delta*ms/1000;

    map_x+=map_x_delta*ms/1000;
    map_y+=map_y_delta*ms/1000;
    map_size+=map_size_delta;//Tady se ms neuplatnuji



    //----------------


    map_zoom=Math.round(map_zoom*100)/100;
    map_rotation=Math.round(map_rotation*10)/10;
    map_slope=Math.round(map_slope*10)/10;
    map_perspective=Math.round(map_perspective*10000)/10000;

    map_x=Math.round(map_x*100)/100;
    map_y=Math.round(map_y*100)/100;
    map_size=Math.round(map_size);

    //----

    if(map_rotation<0)map_rotation+=360;
    if(map_rotation>360)map_rotation-=360;

    if(map_slope<20)map_slope=20;
    if(map_slope>90)map_slope=90;

    if(map_zoom>-1.5)map_zoom=-1.5;
    if(map_zoom<-4)map_zoom=-4;


    if(map_perspective<0)map_perspective=0;
    if(map_perspective>0.5)map_perspective=0.5;


    //----------------Zm


    if(map_zoom_delta || !map_zoom_m){
        map_zoom_m=Math.pow(2,map_zoom);
    }

    if(map_rotation_delta || !map_rotation_r) {

        map_rotation_r = map_rotation / 180 * pi;
        map_rotation_sin = Math.sin(map_rotation_r);
        map_rotation_cos = Math.cos(map_rotation_r);
        map_rotation_sin_minus = Math.sin(-map_rotation_r);
    }

    if(map_slope_delta || !map_slope_m){
        map_slope_m=Math.abs(1/Math.sin(map_slope/180*pi));
        map_slope_n=Math.abs(1/Math.cos(map_slope/180*pi));
    }


    if(map_x_delta || map_y_delta || map_size_delta || map_zoom_delta || !map_size){


        map_size=Math.max((canvas_height/80/*1.4*/),(canvas_width/160/*1.4*/))/map_zoom_m;
        map_size=Math.ceil(map_size/2)*2;



        if(map_size<4)map_size=4;
        if(map_size>120)map_size=120;//160;

        //console.log(map_size);

        //console.log('loadMap');
        loadMap();

    }




    //----------------Vynulovani hodnot

    map_zoom_delta=0;
    map_rotation_delta=0;
    map_slope_delta=0;
    map_perspective_delta= 0;
    map_x_delta=0;
    map_y_delta=0;
    map_size_delta=0;

    //----------------


    /*size_water = (Math.sin(time / 1000) + 1) / 1 + 2;

    size_spring = (Math.sin(time/10000+(pi*(0/4)))+1)/3+1;
    size_summer = (Math.sin(time/10000+(pi*(1/4)))+1)/3+1;
    size_autumn = (Math.sin(time/10000+(pi*(2/4)))+1)/3+1;
    size_winter = (Math.sin(time/10000+(pi*(3/4)))+1)/3+1;


    size_water=Math.round(size_water*1000)/1000;
    size_spring=Math.round(size_spring*100)/100;
    size_summer=Math.round(size_summer*100)/100;
    size_autumn=Math.round(size_autumn*100)/100;
    size_winter=Math.round(size_winter*100)/100;*/

    size_water=1.6;
    size_spring=1;
    size_summer=1;
    size_autumn=1;
    size_winter=1;

    //----------------

    $('#fps').html(fps);

    $('#size_water').html(size_water);
    $('#size_spring').html(size_spring);

    $('#canvas_mouse').html(canvas_mouse_x+','+canvas_mouse_y);
    $('#map_mouse').html(map_mouse_x+','+map_mouse_y);


    $('#map_levels').html(fps);
    $('#map_zoom').html(map_zoom);
    $('#map_rotation').html(map_rotation);
    $('#map_slope').html(map_slope);
    $('#map_perspective').html(map_perspective);
    $('#map_x').html(map_x);
    $('#map_y').html(map_y);
    $('#map_size').html(map_size);

    //----------------

    $('#map_bg').css('left',-canvas_width/3);
    $('#map_bg').css('top',-canvas_height/3);

    //----------------

    drawMap();



}


//----------------------------------------------------------------------------------------------------------------------Frames


var fps=0;
var time=0;

var map_bg =false;
var map_bg_ctx =false;

    $( document ).ready(function() {

    map_bg = document.getElementById("map_bg");
    map_bg_ctx = map_bg.getContext("2d");



    /*setInterval(function() {

            //--------------------------------FPS


            var timeLast=time;
            tmp = new Date();
            time = (new Date()).getTime();
            delete tmp;

            if(timeLast==0){
                var ms=0;
                fps=0;
            }else{
                var ms=time-timeLast;
                fps=Math.round(100000/ms)/100;

            }
            //--------------------------------Actions

            //Brutal//updateMap(ms);

            updateMap(ms);

            //--------------------------------

    },500);*/

        //setTimeout(function() {
           // fps=1;
           // updateMap();
        //},1000);


});




//----------------------------------------------------------------------------------------------------------------------


function mapMove(deltaX,deltaY,noUpdate) {

    //----------------

    var x_delta = -Math.sin(map_rotation / 180 * pi) * deltaY / 180 / map_zoom_m*map_slope_m;
    var y_delta = -Math.cos(map_rotation / 180 * pi) * deltaY / 180 / map_zoom_m*map_slope_m;


    x_delta += -Math.cos(map_rotation / 180 * pi) * deltaX / 180 / map_zoom_m;
    y_delta += Math.sin(map_rotation / 180 * pi) * deltaX / 180 / map_zoom_m;

    x_delta = x_delta*1.133;
    y_delta = y_delta*1.133;


    map_x_delta+=x_delta/100000;
    map_y_delta+=y_delta/100000;


    map_x+=x_delta;
    map_y+=y_delta;


    //----------------

    var map_bg_x = parseInt($('#map_bg').css('left'));
    var map_bg_y = parseInt($('#map_bg').css('top'));

    //console.log($('#map_bg').css('left'),map_bg_x,map_bg_y);

    map_bg_x += deltaX;
    map_bg_y += deltaY;

    $('#map_bg').css('left', map_bg_x);
    $('#map_bg').css('top', map_bg_y);



        ///console.log(Math.pow(map_bg_x,2)+Math.pow(map_bg_y/2,2),(Math.pow(screen_x,2)+Math.pow(screen_y/2,2))/2    );

        if(!noUpdate)
        if(Math.pow(map_bg_x+canvas_width/3,2)+Math.pow(map_bg_y+canvas_width/3/2,2)>(Math.pow(screen_x,2)+Math.pow(screen_y/2,2))/32){

            //alert(Math.pow(map_bg_x,2)+Math.pow(map_bg_y/2,2));
            updateMap();

    }

    //----------------
}


































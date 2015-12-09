/*
 ███╗   ███╗ █████╗ ████████╗██╗  ██╗
 ████╗ ████║██╔══██╗╚══██╔══╝██║  ██║
 ██╔████╔██║███████║   ██║   ███████║
 ██║╚██╔╝██║██╔══██║   ██║   ██╔══██║
 ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║
 ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
 */


Math.sign = Math.sign || function(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
};

//-------------------------

Math.angleDiff = function(deg1,deg2){
    var a = deg1 - deg2;
    var a = (a + 180) % 360 - 180;
    return(a);
};

//-------------------------

Math.rad2deg = function(radians){
    return(radians * (180/Math.PI));
};

//-------------------------

Math.deg2rad = function(degrees){
    return(degrees * (Math.PI/180));
};

//-------------------------

Math.xy2dist = function(x,y){
    return(Math.sqrt(Math.pow(x,2)+Math.pow(y,2)));
};


//-------------------------

Math.xy2distDeg = function(x,y){

    var output={};

    output['dist'] = Math.xy2dist(x,y);
    output['deg'] = Math.rad2deg(Math.atan2(y,x));

    return(output);

};

//-------------------------

Math.distDeg2xy = function(dist,deg){

    var rad=Math.deg2rad(deg);

    var output={};

    output['x'] = Math.cos(rad)*dist;
    output['y'] = Math.sin(rad)*dist;

    return(output);

};

//-------------------------

Math.xyRotate = function(x,y,deg){

    //nevyuzivam funkce Math.xy2distDeg a Math.distDeg2xy, abych nedelal zbytecny prevod do stupnu a spatky
    var dist = Math.xy2dist(x,y);
    var rad = Math.atan2(y,x);

    rad += Math.deg2rad(deg);

    var output={};
    output['x'] = Math.cos(rad)*dist;
    output['y'] = Math.sin(rad)*dist;

    return(output);

};

//======================================================================================================================

//todo stejny prevod string na int v celem projektu
//todo vyhledat v projektu, kde by se to dalo pouzit a nahradit

Math.toFloat = function(value,defval){

    if(typeof(value)==='undefined')return(defval);

    value=parseFloat(value);
    if(value===NaN){
        return(defval);
    }else{
        return(value);
    }

};

//----------------------------------------------------------


Math.toInt = function(value,defval){

    if(typeof(value)==='undefined')return(defval);

    value=parseInt(value);
    if(value===NaN){
        return(defval);
    }else{
        return(value);
    }

};


//----------------------------------------------------------


Math.lineCollision = function(a1x,a1y,a2x,a2y,b1x,b1y,b2x,b2y){


    var denominator = ((a2x - a1x) * (b2y - b1y)) - ((a2y - a1y) * (b2x - b1x));
    var numerator1 = ((a1y - b1y) * (b2x - b1x)) - ((a1x - b1x) * (b2y - b1y));
    var numerator2 = ((a1y - b1y) * (a2x - a1x)) - ((a1x - b1x) * (a2y - a1y));

    // Detect coincident lines (has a problem, read below)
    if (denominator == 0) return numerator1 == 0 && numerator2 == 0;

    var r = numerator1 / denominator;
    var s = numerator2 / denominator;

    return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);

};
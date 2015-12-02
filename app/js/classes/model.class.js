//todo headers


var Model = function (json){
    this.particles=json.particles;
    this.rotation=json.rotation;
    this.size=json.size;

    if(is(this.rotation))this.rotation=0;
    if(is(this.size))this.size=1;
};
//==================================================


Model.prototype.addRotationSize = function(rotation,size){

    rotation=cParam(rotation,0);
    size=cParam(size,1);

    this.rotation+=rotation;
    this.size=this.size*size;

};


//==================================================


Model.prototype.compileRotationSize = function(){

    //todo
    this.rotation=0;
    this.size=0;

};


//==================================================


Model.prototype.joinModel = function(model){

    this.compileRotationSize();
    model.compileRotationSize();

    this.particles=this.particles.concat(model.particles);

};





//======================================================================================================================



/**
 * Draw model on canvas
 * @param ctx Canvas context
 * @param {number} s Size of 1 virtual px
 * @param {number} x_begin Canvas left
 * @param {number} y_begin Canvas top
 * @param {number} rotation 0-360 Angle in degrees
 * @param {number} slope 0-90 Angle in degrees
 * @param {string} force color - format #ff00ff
 */
Model.prototype.draw = function(ctx, s, x_begin, y_begin, rotation, slope, force_color) {


    force_color=cParam(force_color,false);

    //todo delat kontrolu vstupnich parametru u funkci???


    var slope_m = Math.abs(Math.sin(slope / 180 * Math.PI));
    var slope_n = Math.abs(Math.cos(slope / 180 * Math.PI)) * 1.4;
    var slnko = 50;

    this.addRotationSize(rotation-45,s);
    this.compileRotationSize();

    //---------------------------------------------Create empty Towns4 3DModel Array

    var resource={
        points: [],
        polygons: [],
        colors: []
    };

    //---------------------------------------------Convert particles to Towns4 3DModel Array


    this.particles.forEach(function(particle){

        r(particle);

        if(particle.shape=='cube'){


            var x=particle.position.x;
            var y=particle.position.y;
            var z=particle.position.z;

            var x_=Math.sin(Math.deg2rad(particle.rotation.xy))*particle.size.x;
            var y_=Math.cos(Math.deg2rad(particle.rotation.xy))*particle.size.y;
            var z_=particle.size.z;


            var addPoints=[
                [x+x_,y+y_,z],
                [x-x_,y+y_,z],
                [x-x_,y-y_,z],
                [x+x_,y-y_,z],
                [x+x_,y+y_,z+z_],
                [x-x_,y+y_,z+z_],
                [x-x_,y-y_,z+z_],
                [x+x_,y-y_,z+z_]
            ];
            var addPolygns=[
                //[1234]
                [5,6,7,8],
                [1,2,6,5],
                [2,3,7,6],
                [3,4,8,7],
                [4,1,5,8]

            ];

            var i=resource.points;
            addPoints.forEach(function(point){
                resource.points.push(point);
            });

            for(var poly_i in addPolygns){
                for(var point_i in addPolygns[poly_i])
                    addPolygns[poly_i][point_i]+=i;

                resource.polygons.push(addPolygns[poly_i]);
                resource.color.push(particle.color);
            }





        }else{

            throw 'Unknown particle shape '+particle.shape;
        }


        resource.points.push([]);


    });

    //------------------------Prirazeni barev k polygonum pred serazenim

    if(force_color==false){

        for(var i= 0,l=resource['polygons'].length;i<l;i++){

            resource['polygons'][i]['color']=resource['colors'][i];
        }

    }else{

        var color = force_color;
        color = hexToRgb(color);

    }


    //------------------------Seřazení bodů

    res['polygons'].sort(function (a, b) {
        var sum,cnt;

        var polygons=[a,b];
        var zindex=[0,0];

        for(var polygon in polygons){

            sum = 0;
            cnt = 0;
            for (var i in polygons[polygon]) {

                if(i!='color' && is(res['points'][polygons[polygon][i]])) {

                    sum += res['points'][polygons[polygon][i]][0] * slope_m
                    +  res['points'][polygons[polygon][i]][1] * slope_m
                    +  res['points'][polygons[polygon][i]][2] * slope_n;
                    cnt++;
                }

            }
            //r(sum,cnt);
            zindex[polygon] = sum / cnt;

        }

        //-------------------
        if (zindex[0] > zindex[1]) {
            return 1;
        }
        if (zindex[1] > zindex[0]) {
            return -1;
        } else {
            return 0;
        }
    });


    //==========================================================================================stín


    for (var i2 = 0, l2 = res['polygons'].length; i2 < l2; i2++) {


        var tmppoints = [];

        for (var i3 = 0, l3 = res['polygons'][i2].length; i3 < l3; i3++) {


            if (typeof resource['points'][resource['polygons'][i2][i3]] !== 'undefined') {

                var z = Math.abs(resource['points'][resource['polygons'][i2][i3]][2]);
                var x =          resource['points'][resource['polygons'][i2][i3]][0]-50 + z / 1.5;
                var y =          resource['points'][resource['polygons'][i2][i3]][1]-50 - z / 1.5 / 2;


                var xx = x * 1 - (y * 1);
                var yy = x * slope_m + y * slope_m;


                tmppoints.push({x: xx, y: yy});


            }
        }

        ctx.fillStyle = 'rgba(0,0,0,0.2)';

        //------------------------Vykreslení­ bodů

        if(tmppoints.length>0){
            ctx.beginPath();

            for (var i = 0, l = tmppoints.length; i < l; i++) {

                ctx.lineTo(tmppoints[i].x + x_begin, tmppoints[i].y + y_begin);

            }
            ctx.closePath();
            ctx.fill();

        }

    }

    //==========================================================================================Vykreslení­ polygonů
    for (var i2 = 0, l2 = res['polygons'].length; i2 < l2; i2++) {

        tmppoints = [];
        i = 0;
        for (var i3 = 0, l3 = res['polygons'][i2].length; i3 < l3; i3++) {
            if (is(resource['points'][resource['polygons'][i2][i3]])) {

                x = resource['points'][resource['polygons'][i2][i3]][0]-50;
                y = resource['points'][resource['polygons'][i2][i3]][1]-50;
                z = resource['points'][resource['polygons'][i2][i3]][2];
                xx = x * 1 - (y * 1);
                yy = x * slope_m + y * slope_m - (z * slope_n);


                tmppoints.push({x: xx, y: yy});
            }
        }

        if(force_color==false){
            var color = resource['polygons'][i2]['color'];
            color = hexToRgb(color);
        }


        //------------------------Vystínování podle sklonu polygonu

        if ((resource['points'][resource['polygons'][i2][0]] != null) && (resource['points'][resource['polygons'][i2][2]] != null)) {
            var x1 = resource['points'][resource['polygons'][i2][0]][0],
                y1 = resource['points'][resource['polygons'][i2][0]][1],
                x2 = resource['points'][resource['polygons'][i2][2]][0],
                y2 = resource['points'][resource['polygons'][i2][2]][1];

            var x = Math.abs(x1 - x2) + 1,
                y = Math.abs(y1 - y2) + 1;

            var plus = Math.log(x / y) * slnko;

            if (plus < -20) {
                plus = -20;
            }
            if (plus > 20) {
                plus = 20;
            }
            plus = Math.round(plus);
        } else {
            plus = 0;
        }

        //--------------
        color.r = color.r + plus;
        color.g = color.g + plus;
        color.b = color.b + plus;

        //--------------
        if (color.r > 255) {
            color.r = 255;
        }
        if (color.r < 0) {
            color.r = 0;
        }
        if (color.g > 255) {
            color.g = 255;
        }
        if (color.g < 0) {
            color.g = 0;
        }
        if (color.b > 255) {
            color.b = 255;
        }
        if (color.b < 0) {
            color.b = 0;
        }
        ctx.fillStyle = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';

        //------------------------Vykreslení bodů

        if(tmppoints.length>0){

            ctx.beginPath();

            for (var i = 0, l = tmppoints.length; i < l; i++) {

                ctx.lineTo(tmppoints[i].x + x_begin, tmppoints[i].y + y_begin);

            }

            ctx.closePath();
            ctx.fill();

        }


    }
}


//======================================================================================================================


/**
 * Create icon of Towns model
 * @param {number} size Size of returned image
 * @returns {string} image data in base64
 */
Model.prototype.createIcon = function(size){

    var canvas = document.createElement('canvas');
    canvas.height=size;
    canvas.width = size;
    var context = canvas.getContext('2d');

    this.draw(context, 0.3, size/2, size*(4/5), 10, 35);

    return(canvas.toDataURL());

}

//==================================================


Model.prototype.createSrc = function( s, x_begin, y_begin, x_size, y_size, rot, slope){

    var canvas = document.createElement('canvas');
    canvas.width=x_size;
    canvas.height = y_size;
    var context = canvas.getContext('2d');

    this.draw(context, s, x_begin, y_begin,  rot, slope);

    return(canvas.toDataURL());

}





//======================================================================================================================



/**
 * Convert HTML HEX Color to {r:...,g:...,b:...}
 * @param {string} hex code of color
 * @returns {*}
 */
function hexToRgb(hex) {
    var result, shorthandRegex;
    if (hex == null) {
        hex = '000000';
    }
    shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    } else {
        return {
            r: 0,
            g: 0,
            b: 0
        };
    }
};


//---------------------------

/**
 * Convert r,g,b to Hex HTML color
 * @param {number} r 0-255
 * @param {number} g 0-255
 * @param {number} b 0-255
 * @returns {string} Hex code of HTML color eg. #FF0000
 */
function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};




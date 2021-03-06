/**
 * @author ©Towns.cz
 * @fileOverview Creates method draw3D in Class Model
 */
//======================================================================================================================
//todo maybe in 2d canvas

T.Model.prototype.create3D = function(gl, s, x_begin, y_begin, rotation, slope, selected=false, shadow=true) {


    //var slope_m = Math.abs(Math.sin(slope / 180 * Math.PI));
    //var slope_n = Math.abs(Math.cos(slope / 180 * Math.PI));
    var slnko = 50;


    var this_=this.clone();
    //r(this_);

    s=s*5;

    this_.addRotationSize(/*rotation+45*/0,s);
    //this_.compileRotationSize();

    //---------------------------------------------Create empty Towns4 3DModel Array

    var resource={
        points: [],
        polygons: [],
        materials: [],
        particles: []
    };


    var particlesLinear=this_.getLinearParticles();
    //todo strict mode//delete this_;

    //---------------------------------------------Convert particles to Towns4 3DModel Array


    //this_.particles
    particlesLinear.forEach(function(particle,particle_i){

        var addResource= T.Model.Particles.get3D(particle);

        //r(addResource);


        var i=resource.points.length;
        addResource.points.forEach(function(point){
            resource.points.push(point);
        });


        for(var poly_i in addResource.polygons){

            for(var point_i in addResource.polygons[poly_i]){
                addResource.polygons[poly_i][point_i]+=i-1;
            }

            resource.materials.push(particle.material);
            resource.polygons.push(addResource.polygons[poly_i]);

            resource.particles.push(particle_i);

        }


        //resource.points.push([]);


    });


    //==========================================================================================Draw

    var polygons3D=[];


    for (var i2 = 0, l2 = resource.polygons.length; i2 < l2; i2++) {

        var polygon3D=[];

        for (var i3 = 0, l3 = resource.polygons[i2].length; i3 < l3; i3++) {



            if (typeof resource.points[resource.polygons[i2][i3]] !== 'undefined') {

                var x = resource.points[resource.polygons[i2][i3]][0];
                var y = resource.points[resource.polygons[i2][i3]][1];
                var z = resource.points[resource.polygons[i2][i3]][2];

                /*var DistDeg=T.T.Math.xy2distDeg(x,z);//todo all DistDeg via capital

                 DistDeg.deg+=slope;

                 var XY = T.Math.distDeg2xy(DistDeg.dist,DistDeg.deg);

                 x=XY.x;
                 x=XY.y;*/

                var position3D=new T.Position3D(x,y,z);
                polygon3D.push(position3D);

            }

            polygons3D.push({
                shape: polygon3D,
                texture: resource.materials[i2]
            });


        }

    }

    var rotations=[
        {deg:slope-90, vector:[1, 0, 0]},
        {deg:rotation+45, vector:[0, 0, -1]}
    ];


    return new T.WebGL(gl,polygons3D,rotations,shadow);


    //-------------------------------------




};

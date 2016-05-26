




Model = function(name, model, scene, materials, shadowGenerator) {

   var  sizeBranch=20, sizeTrunk=5, radius=1;

    // Call the super class BABYLON.Mesh
    BABYLON.Mesh.call(this, name, scene);

    this._init(sizeBranch);

    var whole=this;
    this.rotation.y = Math.PI/4;

    var linear_particles = model.getLinearParticles();

    linear_particles.forEach(function(particle){

        /*{
         "name":"",
         "shape":{
         "type":"prism",
         "n":6,
         "top":1,
         "bottom":1,
         "rotated":false
         },
         "material":"wood_raw",
         "position":{"x":0,"y":0,"z":35},
         "size":{"x":5,"y":15,"z":5},
         "rotation":0,
         "skew":{"z":{"x":0,"y":0}}
         }*/



        if(typeof materials[particle.material] === 'undefined') {

            r('Initializing new material '+particle.material);

            //Creation of a material with an image texture
            materials[particle.material] = new BABYLON.StandardMaterial("texture3", scene);
            materials[particle.material].diffuseTexture = new BABYLON.Texture(T.Cache.textures.get(particle.material).src, scene);
            materials[particle.material].freeze();
        }


        var material = materials[particle.material];



        particle=T.Model.Particles.addMissingParams(particle);

        if (particle.shape.type == 'prism') {


            var path_bottom=[];
            var path_top=[];

            //-------------------------------------------------------------------prism

            var x = particle.position.x;
            var y = particle.position.y;
            var z = particle.position.z;// * 2;


            var x_ = particle.size.x;
            var y_ = particle.size.y;
            var z_ = particle.size.z;

            var x__, y__, z__;

            for (var n = 0; n<=particle.shape.n; n++) {


                //--------
                for (var level = 0; level < 2; level++) {

                    if (level === 0) {
                        base = particle.shape.bottom;

                    } else {
                        base = particle.shape.top;
                    }


                    //------------------XYZ ratio

                    if (!is(particle.shape.rotated)) {

                        x__ = 0.5 * x_ * Math.cos(-n / particle.shape.n * Math.PI * 2 + T.Math.deg2rad(180 + 180 / particle.shape.n)) * base + x_ * (level * particle.skew.z.x);
                        y__ = 0.5 * y_ * Math.sin(-n / particle.shape.n * Math.PI * 2 + T.Math.deg2rad(180 + 180 / particle.shape.n)) * base + y_ * (level * particle.skew.z.y);
                        z__ = z_ * level;

                    } else {

                        var tmp = (2 - (Math.cos(T.Math.deg2rad(180 / particle.shape.n))));//todo better

                        x__ = x_ * ((level * 2) - 1);//*(level-0.5);//+x_*(level*particle.skew.z.x),

                        y__ = 0.5 * y_ * Math.sin(n / particle.shape.n * Math.PI * 2 + T.Math.deg2rad(180 + 180 / particle.shape.n));//+y_*(level*particle.skew.z.y),


                        z__ = (1) * 0.5 * (

                                z_ * Math.cos(n / particle.shape.n * Math.PI * 2 + T.Math.deg2rad(180 + 180 / particle.shape.n)) * tmp +
                                z_ * ((Math.cos(T.Math.deg2rad(180 / particle.shape.n)))) * tmp

                            );


                        z__-=z_/2;

                    }


                    //------------------ XY Rotation

                    var DistDeg_ = T.Math.xy2distDeg(x__, y__);//todo refactor all like DistDeg, etc...
                    DistDeg_.deg += particle.rotation;
                    var xy_ = T.Math.distDeg2xy(DistDeg_.dist, DistDeg_.deg);

                    x__ = xy_.x;
                    y__ = xy_.y;


                    //------------------




                    x__=x__*MAP_BUILDING_SIZE;
                    y__=y__*MAP_BUILDING_SIZE;
                    z__=z__*MAP_BUILDING_SIZE;


                    if (level === 0) {

                        path_bottom.push( new BABYLON.Vector3(x__, z__, y__) );

                    } else {

                        path_top.push( new BABYLON.Vector3(x__, z__, y__) );

                    }


                    //resource.points.push([x + x__, y + y__, z + z__]);


                    /*if (level === 0) {

                     //r(n,1,particle.shape.n,(n+1+particle.shape.n));
                     resource.polygons[0].push(n + 1);
                     resource.polygons[1].push(n + 1 + particle.shape.n);

                     resource.polygons2D[0].push(n + 1);
                     resource.polygons2D[1].push(n + 1 + particle.shape.n);


                     resource.polygons.push([
                     (n !== 0 ? n : particle.shape.n),
                     n + 1,
                     n + 1 + particle.shape.n,
                     (n !== 0 ? n : particle.shape.n) + particle.shape.n

                     ]);

                     }*/

                }
            }


            if(is(particle.shape.rotated)) {
                z+=z_/2;
            }


            var particle_ribbon = BABYLON.Mesh.CreateRibbon("ribbon", [path_bottom, path_top], false, false, 0, scene);
            particle_ribbon.parent = whole;
            particle_ribbon.position.x = x*MAP_BUILDING_SIZE;
            particle_ribbon.position.y = z*MAP_BUILDING_SIZE;
            particle_ribbon.position.z = y*MAP_BUILDING_SIZE;
            particle_ribbon.material = material;
            shadowGenerator.getShadowMap().renderList.push(particle_ribbon);
            particle_ribbon.convertToUnIndexedMesh();

            /*if(particle.name=='wheel'){
                scene.registerBeforeRender(function () {
                    particle_ribbon.rotation.x += 0.02;
                });
            }*/


            [path_bottom,path_top].forEach(function(path,i){


                var small_length = Math.ceil(path.length/2);
                var path_1 = path.slice(0, small_length);
                var path_2 = path.slice(small_length);
                if(path_2.length+1===path_1.length){
                    path_2.push(path[0]);
                }
                if(i===1){
                    path_1.reverse();
                }else{
                    path_2.reverse();
                }


                var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", [path_2,path_1], false, false, 0, scene);
                ribbon.parent = particle_ribbon;
                //ribbon.position.x = x;
                //ribbon.position.y = z;
                //ribbon.position.z = y;
                ribbon.material = material;
                ribbon.convertToUnIndexedMesh();
                //shadowGenerator.getShadowMap().renderList.push(ribbon_top);

            });








            //-------------------------------------------------------------------
        } else {

            throw 'Unknown particle shape ' + particle.shape.type;

        }


        /*var shape = BABYLON.Mesh.CreateCylinder("cylinder", particle.size.z,particle.shape.top, particle.shape.bottom, particle.shape.n, 1, scene, false);
        shape.parent = whole;


        shape.arc= 0.5;
        shape.position = new BABYLON.Vector3(particle.position.x,particle.position.z,particle.position.y);

        shape.material = new BABYLON.StandardMaterial("Mat", scene);
        shape.material.diffuseTexture = new BABYLON.Texture("/app/babylon-sample/textures/crate.png", scene);
        shape.material.diffuseTexture.hasAlpha = true;*/




     });



    /*var branchColor = randomColor({hue: 'green', luminosity: 'darl', format: 'rgbArray'});
    var trunkColor = randomColor({hue: 'orange',luminosity: 'dark', format: 'rgbArray'});

    this.material = new BABYLON.StandardMaterial("mat", scene);
    this.material.diffuseColor = BABYLON.Color3.FromInts(branchColor[0],branchColor[1],branchColor[2]);
    this.material.specularColor = BABYLON.Color3.Black();
    this.position.y = sizeTrunk+sizeBranch/2-2;

    var trunk = BABYLON.Mesh.CreateCylinder("trunk", sizeTrunk, radius-2<1?1:radius-2, radius, 7, 2, scene );
    trunk.parent = this;
    trunk.position.y = (-sizeBranch/2+2)-sizeTrunk/2;

    trunk.material = new BABYLON.StandardMaterial("trunk", scene);
    trunk.material.diffuseColor = BABYLON.Color3.FromInts(trunkColor[0],trunkColor[1],trunkColor[2]);
    trunk.material.specularColor = BABYLON.Color3.Black();
    trunk.convertToFlatShadedMesh();

    this.trunk = trunk;

    sd.getShadowMap().renderList.push(this);
    sd.getShadowMap().renderList.push(this.trunk);*/

};



// Our object is a BABYLON.Mesh
Model.prototype = Object.create(BABYLON.Mesh.prototype);
// And its constructor is the Ship function described above.
Model.prototype.constructor = Model;


Model.prototype._init = function(sizeBranch) {

    var vertexData = BABYLON.VertexData.CreateSphere(2,sizeBranch);
    vertexData.applyToMesh(this, false);

    /*var positions = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var indices = this.getIndices();
    var numberOfPoints = positions.length/3;

    var map = [];

    // The higher point in the sphere
    var v3 = BABYLON.Vector3;
    var max = [];

    for (var i=0; i<numberOfPoints; i++) {
        var p = new v3(positions[i*3], positions[i*3+1], positions[i*3+2]);

        if (p.y >= sizeBranch/2) {
            max.push(p);
        }

        var found = false;
        for (var index=0; index<map.length&&!found; index++) {
            var array = map[index];
            var p0 = array[0];
            if (p0.equals (p) || (p0.subtract(p)).lengthSquared() < 0.01){
                array.push(i*3);
                found = true;
            }
        }
        if (!found) {
            var array = [];
            array.push(p, i*3);
            map.push(array);
        }

    }

    /*var randomNumber = function (min, max) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    };

    var that = this;
    map.forEach(function(array) {
        var index, min = -sizeBranch/10, max = sizeBranch/10;
        var rx = randomNumber(min,max);
        var ry = randomNumber(min,max);
        var rz = randomNumber(min,max);

        for (index = 1; index<array.length; index++) {
            var i = array[index];
            positions[i] += rx;
            positions[i+1] += ry;
            positions[i+2] += rz;
        }
    });*/

    /*this.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    var normals = [];
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
    this.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
    this.convertToFlatShadedMesh();*/

};
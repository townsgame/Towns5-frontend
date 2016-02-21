/**
 * @author ©Towns.cz
 * @fileOverview Creates method draw3D in Class Model
 */
//======================================================================================================================


Model.prototype.draw3D = function(ctx, s, x_begin, y_begin, rotation, slope, force_color=false, selected=false, simple=false) {


    //force_color=cParam(force_color,false);
    //todo delat kontrolu vstupnich parametru u funkci???






    //var slope_m = Math.abs(Math.sin(slope / 180 * Math.PI));
    //var slope_n = Math.abs(Math.cos(slope / 180 * Math.PI));
    var slnko = 50;


    var this_=deepCopyModel(this);
    //r(this_);

    this_.addRotationSize(/*rotation+45*/0,s);
    //this_.compileRotationSize();

    //---------------------------------------------Create empty Towns4 3DModel Array

    var resource={
        points: [],
        polygons: [],
        colors: [],
        particles: []
    };


    var particlesLinear=this_.getLinearParticles();
    delete this_;

    //---------------------------------------------Convert particles to Towns4 3DModel Array


    //this_.particles
    particlesLinear.forEach(function(particle,particle_i){

        var addResource=ModelParticles.get3D(particle);

        //r(addResource);


        var i=resource.points.length;
        addResource.points.forEach(function(point){
            resource.points.push(point);
        });


        for(var poly_i in addResource.polygons){

            for(var point_i in addResource.polygons[poly_i]){
                addResource.polygons[poly_i][point_i]+=i-1;
            }

            resource.colors.push(particle.color);
            resource.polygons.push(addResource.polygons[poly_i]);

            resource.particles.push(particle_i);

        }


        //resource.points.push([]);


    });

    //"use strict"//delete this_;//todo deep delete


    //r(resource);

    //------------------------Prirazeni barev a cisel castecek k polygonum pred serazenim //todo delete

    if(force_color==false){

        for(var i= 0,l=resource.polygons.length;i<l;i++){

            resource.polygons[i].color=resource.colors[i];
            resource.polygons[i].particle=resource.particles[i];
        }

    }else{

        var color = force_color;
        color = hexToRgb(color);

    }

    //r(resource);


    //==========================================================================================Draw


    var canvas = createCanvasViaFunction(/*range.max.x-range.min.x,range.max.y-range.min.y*/300,300,function(gl){



        //-------------------------------------


        //var canvas;
        //var gl;

        var cubeVerticesBuffer;
        var cubeVerticesTextureCoordBuffer;
        var cubeVerticesIndexBuffer;
        var cubeVerticesNormalBuffer;
//var cubeVerticesIndexBuffer;
        var cubeRotation = 0.0;
        var lastCubeUpdateTime = 0;

        var cubeTextures=[];

        var mvMatrix;
        var shaderProgram;
        var vertexPositionAttribute;
        var vertexNormalAttribute;
        var textureCoordAttribute;
        var perspectiveMatrix;

        var cubeVertexIndicesGroups;


        //
        // initBuffers
        //
        // Initialize the buffers we'll need. For this demo, we just have
        // one object -- a simple two-dimensional cube.
        //
        function initBuffers() {

            //-------------------------


            // Now create an array of vertices for the cube.
            var vertices = [/*
             -1.0, 1.0, -1.0,
             -1.0, 1.0, 1.0,
             1.0, 1.0, 1.0,
             1.0, 1.0, -1.0
             */];


            var vertexNormals = [/*
             0.0, 1.0, 0.0,
             0.0, 1.0, 0.0,
             0.0, 1.0, 0.0,
             0.0, 1.0, 0.0
             */];

            var textureCoordinates = [/*
             0.0, 0.0,
             1.0, 0.0,
             1.0, 1.0,
             0.0, 1.0
             */];


            // This array defines each face as two triangles, using the
            // indices into the vertex array to specify each triangle's
            // position.
            var cubeVertexIndices = [/*
             0, 1, 2, 0, 2, 3
             */];

            cubeVertexIndicesGroups=[];

            var addPolygon = function(polygon,texture){

                var i = vertices.length/3;


                if(polygon.length>=3){

                    vector_ab={};
                    vector_ac={};

                    vector_ab.x = polygon[0].x-polygon[1].x;
                    vector_ab.y = polygon[0].y-polygon[1].y;
                    vector_ab.z = polygon[0].z-polygon[1].z;

                    vector_ac.x = polygon[0].x-polygon[2].x;
                    vector_ac.y = polygon[0].y-polygon[2].y;
                    vector_ac.z = polygon[0].z-polygon[2].z;

                    vector_normal.x = vector_ab.y*vector_ac.z - vector_ab.z*vector_ac.y;
                    vector_normal.y = vector_ab.z*vector_ac.x - vector_ab.x*vector_ac.z;
                    vector_normal.z = vector_ab.x*vector_ac.y - vector_ab.y*vector_ac.x;

                    var distance = Math.sqrt(
                    Math.pow(vector_normal.x,2)+
                    Math.pow(vector_normal.y,2)+
                    Math.pow(vector_normal.z,2));

                    vector_normal.x = vector_normal.x/distance;
                    vector_normal.y = vector_normal.y/distance;
                    vector_normal.z = vector_normal.z/distance;

                }else{

                    vector_normal={x:0,y:1,z:0};

                }



                polygon.forEach(function(point,point_i){

                    vertices.push(point.x/100,point.y/100,point.z/100);

                    vertexNormals.push(vector_normal.x,vector_normal.y,vector_normal.z);

                    switch(point_i%4) {
                        case 0:
                            textureCoordinates.push(0,0);
                            break;
                        case 1:
                            textureCoordinates.push(1,0);
                            break;
                        case 2:
                            textureCoordinates.push(1,1);
                            break;
                        case 3:
                            textureCoordinates.push(0,1);
                            break;

                    }

                });


                var count=0;

                for(var nn=1;nn<=polygon.length-2;nn++){

                    cubeVertexIndices.push(i+0);
                    cubeVertexIndices.push(i+nn);
                    cubeVertexIndices.push(i+nn+1);

                    count+=3;

                }


                cubeVertexIndicesGroups.push({
                    count: count,
                    texture: texture
                });


            };

            //-------------------------


            for (var i2 = 0, l2 = resource['polygons'].length; i2 < l2; i2++) {

                var polygon3D=[];

                for (var i3 = 0, l3 = resource['polygons'][i2].length; i3 < l3; i3++) {



                    if (typeof resource['points'][resource['polygons'][i2][i3]] !== 'undefined') {

                        var x = resource['points'][resource['polygons'][i2][i3]][0];
                        var y = resource['points'][resource['polygons'][i2][i3]][1];
                        var z = resource['points'][resource['polygons'][i2][i3]][2];

                        /*var DistDeg=Math.xy2distDeg(x,z);//todo all DistDeg via capital

                        DistDeg.deg+=slope;

                        var XY = Math.distDeg2xy(DistDeg.dist,DistDeg.deg);

                        x=XY.x;
                        x=XY.y;*/

                        var position3D=new Position3D(x,z,y);
                        polygon3D.push(position3D);

                    }

                    addPolygon(polygon3D,0);


                }
                //var color = hexToRgb(resource['polygons'][i2]['color']);

            }

            /*addPolygon([
                {x:-100,y:-100,z:0},
                {x:-100,y:100,z:0},
                {x:100,y:100,z:0},
                {x:150,y:-100,z:0},
                {x:100,y:-150,z:0},


            ],0);

            addPolygon([
                {x:-100,y:-100,z:100},
                {x:-100,y:100,z:100},
                {x:100,y:100,z:100},
                {x:100,y:-100,z:100},

            ],1);

            addPolygon([
                {x:-100,y:-100,z:-50},
                {x:-100,y:100,z:-50},
                {x:100,y:100,z:-50},
                {x:100,y:-100,z:-50},

            ],1);*/

            /*r('vertices',vertices);
            r('vertexNormals',vertexNormals);
            r('textureCoordinates',textureCoordinates);
            r('cubeVertexIndices',cubeVertexIndices);
            r('cubeVertexIndicesGroups',cubeVertexIndicesGroups);*/

            //-------------------------


            // Create a buffer for the cube's vertices.
            cubeVerticesBuffer = gl.createBuffer();

            // Select the cubeVerticesBuffer as the one to apply vertex
            // operations to from here out.
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);


            // Now pass the list of vertices into WebGL to build the shape. We
            // do this by creating a Float32Array from the JavaScript array,
            // then use it to fill the current vertex buffer.
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            // Set up the normals for the vertices, so that we can compute lighting.
            cubeVerticesNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);


            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
                gl.STATIC_DRAW);

            // Map the texture onto the cube's faces.
            cubeVerticesTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);



            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);


            // Build the element array buffer; this specifies the indices
            // into the vertex array for each face's vertices.
            cubeVerticesIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);



            // Now send the element array to GL
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);



        }

        //
        // initTextures
        //
        // Initialize the textures we'll be using, then initiate a load of
        // the texture images. The handleTextureLoaded() callback will finish
        // the job; it gets called each time a texture finishes loading.
        //
        function initTextures() {


            cubeTextures[0] = gl.createTexture();
            handleTextureLoaded(textures[0], cubeTextures[0]);


            cubeTextures[1] = gl.createTexture();
            handleTextureLoaded(textures[1], cubeTextures[1]);


        }

        function handleTextureLoaded(image, texture) {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        //
        // drawScene
        //
        // Draw the scene.
        //
        function drawScene() {
            // Clear the canvas before we start drawing on it.

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Establish the perspective with which we want to view the
            // scene. Our field of view is 45 degrees, with a width/height
            // ratio of 640:480, and we only want to see objects between 0.1 units
            // and 100 units away from the camera.

            //perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
            //r(gl.canvas.width,gl.canvas.height);
            perspectiveMatrix = makeOrtho(
                gl.canvas.width/-200,
                gl.canvas.width/200,
                gl.canvas.height/-200,
                gl.canvas.height/200,
                -10,10);

            // Set the drawing position to the "identity" point, which is
            // the center of the scene.

            loadIdentity();
            // Now move the drawing position a bit to where we want to start
            // drawing the cube.

            mvTranslate([0.0, 0.0, -6.0]);
            // Save the current matrix, then rotate before we draw.

            mvPushMatrix();
            mvRotate(slope, [1, 0, 0]);
            mvRotate(rotation+45, [0, -1, 0]);


            // Draw the cube by binding the array buffer to the cube's vertices
            // array, setting attributes, and pushing it to GL.
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            // Set the texture coordinates attribute for the vertices.
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
            gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

            // Bind the normals buffer to the shader attribute.
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);



            // Draw the cube.

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
            setMatrixUniforms();
            //gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);


            // Specify the texture to map onto the faces.

            gl.activeTexture(gl.TEXTURE0);


            //cubeVertexIndicesGroups=[cubeVertexIndicesGroups[1]];

            var i=0;
            cubeVertexIndicesGroups.forEach(function(group){

                gl.bindTexture(gl.TEXTURE_2D, cubeTextures[group.texture]);
                gl.drawElements(gl.TRIANGLES, group.count, gl.UNSIGNED_SHORT, i*2);

                i+=group.count;

            });


            /*gl.bindTexture(gl.TEXTURE_2D, cubeTextures[1]);
            gl.drawElements(gl.TRIANGLES, 9, gl.UNSIGNED_SHORT, 0)/


            gl.bindTexture(gl.TEXTURE_2D, cubeTextures[0]);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 18);*/



            /*gl.bindTexture(gl.TEXTURE_2D, cubeTextures[1]);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 12);*/




            gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);



            // Restore the original matrix

            mvPopMatrix();

            // Update the rotation for the next draw, if it's time to do so.

            /*var currentTime = (new Date).getTime();
            if (lastCubeUpdateTime) {
                var delta = currentTime - lastCubeUpdateTime;

                cubeRotation += (100 * delta) / 1000.0;
            }

            lastCubeUpdateTime = currentTime;*/



        }

        //
        // initShaders
        //
        // Initialize the shaders, so WebGL knows how to light our scene.
        //
        function initShaders() {
            var fragmentShader = getShader(gl, "shader-fs");
            var vertexShader = getShader(gl, "shader-vs");

            // Create the shader program

            shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            // If creating the shader program failed, alert

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert("Unable to initialize the shader program.");
            }

            gl.useProgram(shaderProgram);

            vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);

            textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
            gl.enableVertexAttribArray(textureCoordAttribute);

            vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
        }

        //
        // getShader
        //
        // Loads a shader program by scouring the current document,
        // looking for a script with the specified ID.
        //
        function getShader(gl, id) {
            var shaderScript = document.getElementById(id);

            // Didn't find an element with the specified ID; abort.

            if (!shaderScript) {
                return null;
            }

            // Walk through the source element's children, building the
            // shader source string.

            var theSource = "";
            var currentChild = shaderScript.firstChild;

            while(currentChild) {
                if (currentChild.nodeType == 3) {
                    theSource += currentChild.textContent;
                }

                currentChild = currentChild.nextSibling;
            }

            // Now figure out what type of shader script we have,
            // based on its MIME type.

            var shader;

            if (shaderScript.type == "x-shader/x-fragment") {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else if (shaderScript.type == "x-shader/x-vertex") {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else {
                return null;  // Unknown shader type
            }

            // Send the source to the shader object

            gl.shaderSource(shader, theSource);

            // Compile the shader program

            gl.compileShader(shader);

            // See if it compiled successfully

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
                return null;
            }

            return shader;
        }

        //
        // Matrix utility functions
        //

        function loadIdentity() {
            mvMatrix = Matrix.I(4);
        }

        function multMatrix(m) {
            mvMatrix = mvMatrix.x(m);
        }

        function mvTranslate(v) {
            multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
        }

        function setMatrixUniforms() {
            var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
            gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

            var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
            gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));

            var normalMatrix = mvMatrix.inverse();
            normalMatrix = normalMatrix.transpose();
            var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
            gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
        }

        var mvMatrixStack = [];

        function mvPushMatrix(m) {
            if (m) {
                mvMatrixStack.push(m.dup());
                mvMatrix = m.dup();
            } else {
                mvMatrixStack.push(mvMatrix.dup());
            }
        }

        function mvPopMatrix() {
            if (!mvMatrixStack.length) {
                throw("Can't pop from an empty matrix stack.");
            }
            mvMatrix = mvMatrixStack.pop();
            return mvMatrix;
        }

        function mvRotate(angle, v) {
            var inRadians = angle * Math.PI / 180.0;
            var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
            multMatrix(m);
        }


        //---------------------

        //canvas = gl.canvas;

        //gl=document.getElementById("glcanvas").getContext("webgl");

        // Only continue if WebGL is available and working
        if (gl) {


            gl.clearColor(0.1, 0.1, 0.1, 1.0);  // Clear to black, fully opaque
            gl.clearDepth(1.0);                 // Clear everything
            gl.enable(gl.DEPTH_TEST);           // Enable depth testing
            gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

            // Initialize the shaders; this is where all the lighting for the
            // vertices and so forth is established.
            initShaders();

            // Here's where we call the routine that builds all the objects
            // we'll be drawing.
            initBuffers();

            // Next, load and set up the textures we'll be using.
            initTextures();

            // Set up to draw the scene periodically.
            drawScene();
            //setInterval(drawScene, 15);
        }

        //-------------------------------------

        /*for (var i2 = 0, l2 = resource['polygons'].length; i2 < l2; i2++) {

            var polygon3D=[];

            for (var i3 = 0, l3 = resource['polygons'][i2].length; i3 < l3; i3++) {



                if (typeof resource['points'][resource['polygons'][i2][i3]] !== 'undefined') {

                    var x = resource['points'][resource['polygons'][i2][i3]][0];
                    var y = resource['points'][resource['polygons'][i2][i3]][1];
                    var z = resource['points'][resource['polygons'][i2][i3]][2];

                    var DistDeg=Math.xy2distDeg(x,z);//todo all DistDeg via capital

                    DistDeg.deg+=slope;

                    var XY = Math.distDeg2xy(DistDeg.dist,DistDeg.deg);

                    x=XY.x;
                    x=XY.y;

                    var position3D=new Position3D(y+150,x+150,z);
                    polygon3D.push(position3D);

                }


            }
            var color = hexToRgb(resource['polygons'][i2]['color']);


            //r(polygon3D);


            gl.uniform4f(shaderProgram.colorLoc, color.r/255, color.g/255, color.b/255, 1.0);
            DrawUtils.drawPolygon(polygon3D, gl, shaderProgram.vertexPositionLoc);

        }*/



        //-------------------------------------


        /*gl.viewport(0, 0,
            gl.drawingBufferWidth, gl.drawingBufferHeight);

        var vertices = [
            0.5,0.5,  //Vertex 1
            0.5,-0.5, //Vertex 2
            -0.5,-0.5, //Vertex 3
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);*/


        /*gl.enable(gl.SCISSOR_TEST);
        gl.scissor(30, 10, 60, 60);
        gl.clearColor(1.0, 1.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);*/


    },/*experimental-*/'webgl');


    //$('html').append(canvas);

    //setTimeout(function(){

        ctx.drawImage(canvas,/*range.min.x,range.min.y*/0,0);

    //},100);




};

/**
 * @author ©Towns.cz
 * @fileOverview Block editor
 */
//======================================================================================================================


T.Plugins.install(new T.Editor(
    'building-editor',
    {
        type: 'building',
    },
    'Editor budov',
    `<div class="page-column-2">
<form onsubmit="return false;" id="block-editing-form">
<table>


  <tr><th colspan="2">{{block choose}}</th></tr>
  <tr>
    <td colspan="2" id="block-choose"></td>
  </tr>

  <tr><th colspan="2">{{block actions}}</th></tr>
  <tr>
    <td colspan="2" id="block-actions"></td>
  </tr>

  <tr><th colspan="2">{{block position}}</th></tr>
  <tr>
    <td>{{block position x}}:</td>
    <td><input id="block-editing-position-x" type="range" min="-100" max="100" step="1" /></td>
  </tr>
  <tr>
    <td>{{block position y}}:</td>
    <td><input id="block-editing-position-y" type="range" min="-100" max="100" step="1" /></td>
  </tr>
  <tr>
    <td>{{block position z}}:</td>
    <td><input id="block-editing-position-z" type="range" min="0" max="100" step="1" /></td>
  </tr>



  <tr><th colspan="2">{{block shape}}</th></tr>
  <tr>
    <td>{{block shape n}}:</td>
    <td><input id="block-editing-shape-n" type="range" min="3" max="20" step="1" /></td>
  </tr>
  <tr>
    <td>{{block shape rotated}}:</td>
    <td><input id="block-editing-shape-rotated" type="range" min="0" max="1" step="1" /></td>
  </tr>
  <tr>
    <td>{{block shape top}}:</td>
    <td><input id="block-editing-shape-top" type="range" min="0" max="2" step="0.05" /></td>
  </tr>
  <tr>
    <td>{{block shape bottom}}:</td>
    <td><input id="block-editing-shape-bottom" type="range" min="0" max="2" step="0.05" /></td>
  </tr>




  <tr><th colspan="2">{{block skew}}</th></tr>
  <tr>
    <td>{{block skew z x}}:</td>
    <td><input id="block-editing-skew-z-x" type="range" min="-5" max="5" step="0.05" /></td>
  </tr>
  <tr>
    <td>{{block skew z y}}:</td>
    <td><input id="block-editing-skew-z-y" type="range" min="-5" max="5" step="0.05" /></td>
  </tr>




  <tr><th colspan="2">{{block size}}</th></tr>
  <tr>
    <td>{{block size x}}:</td>
    <td><input id="block-editing-size-x" type="range" min="1" max="100" step="1" /></td>
  </tr>
  <tr>
    <td>{{block size y}}:</td>
    <td><input id="block-editing-size-y" type="range" min="1" max="100" step="1" /></td>
  </tr>
  <tr>
    <td>{{block size z}}:</td>
    <td><input id="block-editing-size-z" type="range" min="1" max="100" step="1" /></td>
  </tr>




  <tr><th colspan="2">{{block rotation}}</th></tr>
  <tr>
    <td>{{block rotation}}:</td>
    <td><input id="block-editing-rotation" type="range" min="0" max="360" step="10" /></td>
  </tr>


  <tr><th colspan="2">{{block material}}</th></tr>
  <tr>
    <td colspan="2"><div id="farbtastic-color-box"></div></td>
  </tr>


</table>
</form>
</div>


<div class="page-column-2">

    <div id="model-canvas"></div>

</div>


    `,function(object){


        var model_canvas= new ModelCanvas('model-canvas',object.design.data,380,600);
        var farbtastic = $.farbtastic('#farbtastic-color-box')

        var blockChoose_i,
            block_lock=false;


        var blockChoose = function(i){

            blockButtons();

            i = Math.toInt(i);

            block_lock=true;


            blockChoose_i = i;

            model_canvas.selected_polygon=Math.toInt(i);
            model_canvas.draw();

            $('.block-choose').removeClass('selected');
            $('#block-choose-'+i).addClass('selected');

            var particle=ModelParticles.cParams(object.design.data.particles[blockChoose_i]);

            $('#block-editing-position-x').val(particle.position.x);
            $('#block-editing-position-y').val(particle.position.y);
            $('#block-editing-position-z').val(particle.position.z);

            $('#block-editing-shape-n').val(particle.shape.n);

            $('#block-editing-shape-top').val(particle.shape.top);
            $('#block-editing-shape-bottom').val(particle.shape.bottom);

            $('#block-editing-skew-z-x').val(particle.skew.z.x);
            $('#block-editing-skew-z-y').val(particle.skew.z.y);

            $('#block-editing-size-x').val(particle.size.x);
            $('#block-editing-size-y').val(particle.size.y);
            $('#block-editing-size-z').val(particle.size.z);

            $('#block-editing-rotation').val(particle.rotation);

            farbtastic.setColor(object.design.data.particles[0].color);

            block_lock=false;



        };

        //---------------------------------------------------------------------------

        var blockCreate = function(){

            var particle=deepCopy(object.design.data.particles[blockChoose_i]);

            particle.position.z=particle.position.z+particle.size.z;

            object.design.data.particles.push(particle);

            return(object.design.data.particles.length-1);

        };

        //---------------------------------------------------------------------------

        var blockDelete = function(i){

            object.design.data.particles.splice(i,1);

        };

        //---------------------------------------------------------------------------

        var blockButtons = function(particles,html_id) {

            r(particles);


            $('#'+html_id).addClass('model-dir');
            //$('#'+html_id).html('particles');


            /*$('#'+html_id).html(`
                <div class="model-dir-particles" id="`+html_id+`-base">
                    <i class="fa fa-sitemap"></i>
                </div>
            `);*/

            particles.forEach(function (particle,i) {

                r(particle);

                var html_id_i = html_id+'-'+i;
                var name;

                $('#'+html_id).append(`<div id="`+html_id_i+`"></div>`);
                $('#'+html_id_i).addClass('model-dir-label');

                //---------------------------shape
                if(is(particle.shape)){

                    $('#'+html_id_i).addClass('model-dir-shape');
                    $('#'+html_id_i).addClass('model-dir-label');
                    name = Locale.get('model dir shape');

                }else
                //---------------------------link
                if(is(particle.link)){
                    $('#'+html_id_i).addClass('model-dir-link');
                    $('#'+html_id_i).addClass('model-dir-label');
                    name = Locale.get('model dir shape');


                    /*$('#'+html_id).append(`
                        <div class="model-dir-link" id="`+html_id+`-`+i+`">
                            <i class="fa fa-link"></i>
                        </div>
                    `);*/
                }else
                //---------------------------particles
                if(is(particle.particles)){


                    $('#'+html_id_i).addClass('model-dir-particles');

                    $('#'+html_id).append(`<div id="`+html_id_i+`-dir"></div>`);


                    //r(particle.particles);
                    //r(is(particle.particles));
                    blockButtons(particle.particles,html_id_i+'-dir');


                }
                //---------------------------


                if(is(particle.name)){
                    name=particle.name
                }

                $('#'+html_id_i).prepend(name);


                $('#'+html_id_i).click(function(){

                    $('.model-dir-label').removeClass('model-dir-selected');
                    $(this).addClass('model-dir-selected');

                });

            });





        };



        blockButtons(object.design.data.particles,'block-choose');


        //---------------------------------------------------------------------------


        /*var blockButtons = function(i) {
            $('#block-choose').html('');

            
            
            //-----------------------Blocks
            /*object.design.data.particles.forEach(function (particle, block_i) {

                var particle_on_ground = deepCopy(particle);

                particle_on_ground.position.z=0;

                var particle_model = new Model({
                    particles: [
                        particle_on_ground
                    ]
                });

                //r(particle_model);

                var particle_icon = particle_model.createIcon(50);


                var particle_button = $('<img>');
                particle_button.attr('src', particle_icon);
                particle_button.attr('block_i', block_i);
                particle_button.attr('id', 'block-choose-' + block_i);
                particle_button.attr('class', 'block-choose');

                //r(blockChoose);
                particle_button.click(function () {

                    var block_i = $(this).attr('block_i');

                    blockChoose(block_i);


                });

                $('#block-choose').append(particle_button);


            });


        };*/

        //---------------------------------------------------------------------------


        //-----------------------

        $('#block-actions').html('');

        //-----------------------New

        var button = $(`<button>`+Locale.get('building editor duplicate block')+`</button>`);

        button.attr('class', 'block-button');
        button.click(function () {

            blockChoose(blockCreate());

        });
        $('#block-actions').append(button);

        //-----------------------

        //-----------------------Delete

        var button = $(`<button>`+Locale.get('building editor delete block')+`</button>`);

        button.attr('class', 'block-button');
        button.click(function () {

            blockDelete(blockChoose_i);
            blockChoose(blockChoose_i-1);

        });
        $('#block-actions').append(button);

        //-----------------------


        blockChoose(0);


        //---------------------------------------------------------------------------



        farbtastic.linkTo(Interval.maxRunPerMs(function (color) {

            if(block_lock)return;

            var i = blockChoose_i;

            object.design.data.particles[i].color=color;
            model_canvas.setModel(object.design.data);

        }, 200));


        $('#block-editing-form').find('input').mousemove(function(){

                if(block_lock)return;

                var i = blockChoose_i;


                object.design.data.particles[i].position.x = Math.toInt($('#block-editing-position-x').val());
                object.design.data.particles[i].position.y = Math.toInt($('#block-editing-position-y').val());
                object.design.data.particles[i].position.z = Math.toInt($('#block-editing-position-z').val());

                object.design.data.particles[i].shape.n = Math.toInt($('#block-editing-shape-n').val());

                object.design.data.particles[i].shape.top = Math.toFloat($('#block-editing-shape-top').val());
                object.design.data.particles[i].shape.bottom = Math.toFloat($('#block-editing-shape-bottom').val());

                object.design.data.particles[i].skew={z:{}};
                object.design.data.particles[i].skew.z.x = Math.toFloat($('#block-editing-skew-z-x').val());
                object.design.data.particles[i].skew.z.y = Math.toFloat($('#block-editing-skew-z-y').val());


                object.design.data.particles[i].size.x = Math.toInt($('#block-editing-size-x').val());
                object.design.data.particles[i].size.y = Math.toInt($('#block-editing-size-y').val());
                object.design.data.particles[i].size.z = Math.toInt($('#block-editing-size-z').val());

                object.design.data.particles[i].rotation = Math.toInt($('#block-editing-rotation').val());

                model_canvas.setModel(object.design.data);

                r(block_lock);


            }

        );

        //---------------------------------------------------------------------------


    },
    {

        name: "ttttttttt",
        type: "building",
        subtype: "main",
        design: {
            type: "model",
            data: new Model(/*{
                particles: [
                    {
                        shape:{
                            type: 'prism',
                            n:4,
                            top: 0
                        },
                        color: "#cccccc",
                        position: {x:0,y:0,z:0},
                        size: {x:40,y:40,z:40},
                        rotation: 0

                    },{
                        shape:{
                            type: 'prism',
                            n:4,
                            bottom: 0
                        },
                        color: "#cccccc",
                        position: {x:0,y:0,z:0},
                        size: {x:40,y:40,z:40},
                        rotation: 0

                    }
                ]
            }*/
                {
                    particles: [
                        {
                            name: 'top',
                            particles:[
                                {
                                    shape:{
                                        type: 'prism',
                                        n:4
                                    },
                                    color: "#cccccc",
                                    position: {x:10,y:10,z:0},
                                    size: {x:10,y:10,z:10},
                                    rotation: 10
                                },{
                                    name: 'chimney',
                                    particles:[
                                        {
                                            shape:{
                                                type: 'prism',
                                                n:5,
                                                rotated:true
                                            },
                                            color: "#cccccc",
                                            position: {x:-10,y:-10,z:0},
                                            size: {x:10,y:10,z:10},
                                            rotation: 20
                                        },{
                                            shape:{
                                                type: 'prism',
                                                n:7,
                                                rotated:true
                                            },
                                            color: "#00ff00",
                                            position: {x:-10,y:-10,z:10},
                                            size: {x:5,y:5,z:20},
                                            rotation: 20
                                        }
                                    ],
                                    size:2

                                },
                                {
                                    link: 'chimney',
                                    size:1,
                                    position: {x:-20,y:20,z:0},
                                    rotation: -20

                                }

                            ],
                            position: {x:0,y:0,z:40},
                            size: 1,
                            rotation: 20

                        },{
                            name: 'basement',
                            shape:{
                                type: 'prism',
                                n:4,
                                bottom:0.3
                            },
                            color: "#7799ff",
                            position: {x:0,y:0,z:0},
                            size: {x:40,y:40,z:40},

                        }
                    ]
                }
            )

        }
    }



));
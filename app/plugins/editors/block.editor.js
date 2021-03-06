/**
 * @author ©Towns.cz
 * @fileOverview Block editor
 */
//======================================================================================================================


T.Plugins.install(new T.Plugins.Editor(
    'building-block-editor',
    {
      type: 'building',
      subtype: 'block'
    },
    'Stavební bloky',
    `<div class="page-column-2">
<form onsubmit="return false;" id="block-editing-form">
<table>

  <tr><th colspan="2">{{block shape}}</th></tr>
  <tr>
    <td>{{block shape n}}:</td>
    <td><input id="block-editing-shape-n" type="range" min="3" max="20" step="1" /></td>
  </tr>
    <tr>
    <td>{{block shape rotated}}:</td>
    <td><input id="block-editing-shape-rotated" type="checkbox" /></td>
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
    <td colspan="2">
        `+
        T.Cache.textures.getInput('block-editing-material')+
        `
    </td>
  </tr>


</table>
</form>
</div>


<div class="page-column-2">

    <div id="model-canvas"></div>

</div>


    `,function(object){


        T.UI.Html.Form.addRangeNumber(false);


        var model_canvas= new T.ModelCanvas('model-canvas',object.design.data,380,600);

        var particle= T.Model.Particles.addMissingParams(object.getModel().particles[0]);

        $('#block-editing-shape-n').val(particle.shape.n);

        if(particle.shape.rotated){
            $('#block-editing-shape-rotated').attr('checked','checked');
        }


        $('#block-editing-shape-top').val(particle.shape.top);
        $('#block-editing-shape-bottom').val(particle.shape.bottom);

        $('#block-editing-skew-z-x').val(particle.skew.z.x);
        $('#block-editing-skew-z-y').val(particle.skew.z.y);

        $('#block-editing-size-x').val(particle.size.x);
        $('#block-editing-size-y').val(particle.size.y);
        $('#block-editing-size-z').val(particle.size.z);

        $('#block-editing-rotation').val(particle.rotation);


        $("input[name='block-editing-material']").filter("[value='"+particle.material+"']").attr('checked', true);



        $('#block-editing-form').find('input').mousemove(function(){

                object.getModel().particles[0].shape.n = T.Math.toInt($('#block-editing-shape-n').val());

                object.getModel().particles[0].shape.top = T.Math.toFloat($('#block-editing-shape-top').val());
                object.getModel().particles[0].shape.bottom = T.Math.toFloat($('#block-editing-shape-bottom').val());

                object.getModel().particles[0].skew={z:{}};
                object.getModel().particles[0].skew.z.x = T.Math.toFloat($('#block-editing-skew-z-x').val());
                object.getModel().particles[0].skew.z.y = T.Math.toFloat($('#block-editing-skew-z-y').val());


                object.getModel().particles[0].size.x = T.Math.toInt($('#block-editing-size-x').val());
                object.getModel().particles[0].size.y = T.Math.toInt($('#block-editing-size-y').val());
                object.getModel().particles[0].size.z = T.Math.toInt($('#block-editing-size-z').val());

                object.getModel().particles[0].rotation = T.Math.toInt($('#block-editing-rotation').val());


                model_canvas.setModel(object.design.data);


        });

        $('#block-editing-shape-rotated').click(function(){

            object.getModel().particles[0].shape.rotated = $('#block-editing-shape-rotated').is(':checked');

            model_canvas.setModel(object.design.data);

        });



        $('#block-editing-material').change(function(){

            object.getModel().particles[0].color = $('#block-editing-color').val();
            model_canvas.setModel(object.design.data);


        });


        $("input[name='block-editing-material']").click(function() {

            r(this.value);
            object.getModel().particles[0].material=this.value;
            model_canvas.setModel(object.design.data);

        });




    },
    new T.Objects.Building({

        name: "",
        type: "building",
        subtype: "block",
        design: {
            type: "model",
            data: new T.Model({
                particles: [
                    {
                        shape:{
                            type: 'prism',
                            n:4
                        },
                        material: "clay_bricks",
                        position: {x:0,y:0,z:0},
                        size: {x:40,y:40,z:40},
                        rotation: 0

                    }
                ]
            })

        }
    })



));
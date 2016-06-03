/**
 * @author Towns.cz
 * @fileOverview Additional methods to HTMLCanvasElement prototype
 */
//======================================================================================================================


/**
 * Open window with downloadable image
 */
HTMLCanvasElement.prototype.downloadCanvas = function(){


    var name='mapX'+Math.round(map_center.x)+'Y'+Math.round(map_center.y);
    var src=this.toDataURL();
    //download(src,name,'image/png');



    var download_window = window.open("", "download_window", "toolbar=no, scrollbars=yes, resizable=yes, top=100, left=100, width=800, height=600");

    //r('downloadCanvas',download_window);
    download_window.document.write('<title>'+name+'</title><img src="'+src+'" width="100%"><br><a href="'+src+'">Download</a> - <a onclick="window.prompt(\'Copy to clipboard: Ctrl+C, Enter\', \''+src+'\');">Source</a>');


};


//======================================================================================================================



//todo should it be in this file?

/**
 * Creates base64 source of image via inserted 2D canvas context manipulation function
 * @param {number} width
 * @param {number} height
 * @param {function} manipulationFunction
 * @returns {string} image source in base 64
 */
function createCanvasViaFunctionAndConvertToSrc(width,height,manipulationFunction,contextType='2d'){

    //if(contextType=='webgl')contextType='experimental-webgl';

    var canvas = document.createElement('canvas');
    canvas.width=width;
    canvas.height = height;

    r(contextType);
    var context = canvas.getContext(contextType);

    manipulationFunction(context);

    return(canvas.toDataURL());


}

//======================================================================================================================

/**
 * Creates canvas via inserted 2D canvas context manipulation function
 * @param {number} width
 * @param {number} height
 * @param {function} manipulationFunction
 * @returns canvas
 */
function createCanvasViaFunction(width,height,manipulationFunction,contextType='2d'){

    var canvas = document.createElement('canvas');
    canvas.width=width;
    canvas.height = height;
    var context = canvas.getContext(contextType);

    manipulationFunction(context);

    return(canvas);


}



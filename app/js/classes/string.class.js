/**
 * @author �Towns.cz
 * @fileOverview Additional methods to String prototype
 */
//======================================================================================================================



String.prototype.htmlEncode = function(){
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(this).html();
};


String.prototype.htmlDecode = function(){
    return $('<div/>').html(this).text();
};
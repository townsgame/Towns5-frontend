/**
 * @author Towns.cz
 * @fileOverview Action deleteObject
 */
//======================================================================================================================
//todo create T.UI.Actions or solve actions in towns-shared



function dismantle(id){

    deleteObject(id);

}




//todo create static class fro actions and T.UI actions
function dismantleUI(id){

    if(confirm(T.Locale.get('deleteObject '+T.ArrayFunctions.id2item(objects_external,id).type+' confirm'))){//todo create better confirm

        deleteObject(id);
        T.UI.Map.loadMapAsync();
        hideLeftMenu();
        T.UI.popupWindow.close();

    }

}


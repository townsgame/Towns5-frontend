/**
 * @author Towns.cz
 * @fileOverview Towns API initialization
 */
//======================================================================================================================


T.TownsAPI.townsAPI = new T.TownsAPI(TOWNS_API_URL,T.Storage.load('token'));
//townsAPI = new TownsAPIOffline(TOWNS_API_URL,'"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2ZmZkMjdiNGQ0ZDM5YTkwMjA5ODMwNyIsInVzZXJuYW1lIjoieHh4In0.26MjO5pk1I4o2GP7B8nED1SeNw-x5moA2ZTr741p1H0"');


$(function(){//todo maybe in other file

    T.UI.Status.logged();

});

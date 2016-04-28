/**
 * @author Towns.cz
 * @fileOverview Creates object Locale with static methods
 */
//======================================================================================================================


//todo ?? maybe rename to Messages or Locale.Messages???
var Locale=class {//set en, cs here
    


    /**
     * @param {string} key
     * @param {string} key2
     * ...
     * @return {string} message
     */
    static get() {//todo refactor useges use more params not ' '

        var key = [].slice.call(arguments).join(' ');

        if (!is(key))return 'MESSAGE';

        key = key.split(' ').join('_');
        key = key.split('-').join('_');


        var message;

        try {
            eval('message=MESSAGES.' + key + ';');
        }
        catch (err) {
        }

        if (!is(message)) {

            if (environment == 'develop') {

                MESSAGES[key] = key;
                Locale.keys_write.push(key);

                var count = T.Math.toInt($('#locale-write-count').html()) + 1;
                $('#locale-write-count').html(count);


                clearTimeout(Locale.keys_write_interval);
                Locale.keys_write_interval = setTimeout(function () {

                    $('#menu-list-item-data').effect('shake');

                }, 400);


            }

            message = key;
        }

        return (message);

    };

};
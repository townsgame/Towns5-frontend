<?php
/**
 * @author ©Towns.cz
 * @fileOverview This PHP file generates HTML skeleton for browser...
 */
//======================================================================================================================




error_reporting(E_ALL & ~E_NOTICE);


//----------------------------------------load $language and $MESSAGES


//---------------------------Initialization

require __DIR__ . '/php/neon/neon.php';

if(isset($_COOKIE['language'])) {
    $language = $_COOKIE['language'];
}else{
    $language = substr($_SERVER['HTTP_ACCEPT_language'], 0, 2);
}



$language_file=__DIR__ ."/locale/$language.neon";
if(!file_exists($language_file)) {
    $language='cs';//todo in future default language should be english
    $language_file=__DIR__ ."/locale/$language.neon";
}


function locale_init(){
    global $MESSAGES,$language_file;
    $MESSAGES = Nette\Neon\Neon::decode(file_get_contents($language_file));
}

locale_init();

//---------------------------Locale.get equivalent in PHP

function locale($key){
    global $MESSAGES,$language_file;

    $key=str_replace(array(' ','-'),'_',$key);

    if(isset($MESSAGES[$key])){

        $value=$MESSAGES[$key];

    }else {

        if(1/*todo only in develop*/){

            if(is_writable($language_file)){

                file_put_contents(
                    $language_file,
                    file_get_contents($language_file) . "\n$key: " . Nette\Neon\Neon::encode($key)
                );
                locale_init();

            }else{
                $key.='(err)';
            }



        }
        $value=$key;

    }


    return $value;

}

//----------------------------------------




//todo zde by se mela analyzovat T.URI - poslat dotaz do towns API a pote naplnit informace nize podle toho.

$page=[];
$page['title'] = locale('page title');
$page['description'] = locale('page description');
$page['meta_og'] = [
    'site_name' => locale('page title'),
    'title' => $page['title'],
    'description' => $page['description'],
    'type' => 'game'
    //'url' =>
    //'image' =>
];



$inner_window=[];

if($config['app']['environment'] == "production" and false){

    $inner_page='home';
    $inner_page_content=file_get_contents(__DIR__.'/js/ui/pages/'.$inner_page.'.page.js');

    function getFromJs($content,$val,$quote){
        $pos=strpos($content,$val);
        $content=substr($content,$pos);
        $pos=strpos($content,$quote);
        $content=substr($content,$pos+1);
        $pos=strpos($content,$quote);
        $content=substr($content,0,$pos);
        return $content;
    }


    $inner_window['header']=getFromJs($inner_page_content,'Pages.'.$inner_page.'.header','\'');
    $inner_window['content']=getFromJs($inner_page_content,'Pages.'.$inner_page.'.content','`');
    //$inner_window['openJS']=getFromJs($inner_page_content,'Pages.'.$inner_page.'.openJS','`');


    $inner_window['content']=explode('{{', $inner_window['content']);


    for($i=1;$i<count($inner_window['content']);$i++){


        $inner_window['content'][$i]=explode('}}',$inner_window['content'][$i]);




        $inner_window['content'][$i][0]=locale($inner_window['content'][$i][0]);
        $inner_window['content'][$i]=implode('',$inner_window['content'][$i]);


    }
    $inner_window['content']=implode('', $inner_window['content']);


}else{


    $inner_window['display'] = 'none';
    $inner_window['header'] = '';
    $inner_window['content'] = '';
    //$inner_window['openJS'] = '';

}





http_response_code(200);



if(isset($config['app']['environment']) && $config['app']['environment'] != "production"){

    $page['title'].=' - '.ucfirst($config['app']['environment']).' enviroment';

}


//------------------------------------------------Nice HTML

function tidyHTML($buffer) {
    // load our document into a DOM object
    $dom = new DOMDocument();
    // we want nice output
    $dom->preserveWhiteSpace = false;
    $dom->loadHTML($buffer);
    $dom->formatOutput = true;
    return($dom->saveHTML());
}

// start output buffering, using our nice
// callback function to format the output.
//ob_start("tidyHTML");//todo Deploy tidyHTML

//------------------------------------------------


?>
<!DOCTYPE html>
<html>
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Basic Information|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <title><?= htmlspecialchars($page['title']) ?></title>
    <meta name="description" content="<?= addslashes($page['description']) ?>">
    <link rel="icon" href="/favicon.ico">

    <?php
    //--------------------------------Dodatecne hlavicky
    if (isset($config['app']['facebook']['app_id'])) {
        echo '<meta property="fb:app_id" content="' . $config['app']['facebook']['app_id'] . '" >'."\r\n    ";
    }

    //--------------------------------Open Graph informace

    foreach ($page['meta_og'] as $key => $value) {
        echo('<meta property="fb:' . addslashes($key) . '" content="' . addslashes($value) . '" >'."\r\n    ");

    }

    //--------------------------------var language
    ?>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->




    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Language|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <script>
        var language='<?=$language?>';
    </script>
    <script src="/<?=(isset($config['app']['environment']) && $config['app']['environment'] != "production"?'app':'app-build')?>/php/locale.php?language=<?=$language?>"></script>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->




    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Libraries|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <?php
    //--------------------------------Includes
    //tady je podminka zda jde o testovaci verzi
    if (isset($config['app']['environment']) && $config['app']['environment'] != "production") {

        $js_files=array();
        $css_files=array();

        //-----------------------------------------------------

        foreach ($config['includes']['js'] as $include) {


            if(is_array($include)){
                foreach($include as $environment=>$file){
                    if($environment==$config['app']['environment']){
                        $js_files=array_merge($js_files,glob($file));
                    }
                }
            }elseif(is_string($include)){

                $js_files=array_merge($js_files,glob($include));

            }

        }

        foreach ($config['includes']['css'] as $include) {

            if(is_array($include)){
                foreach($include as $environment=>$file){
                    if($environment==$config['app']['environment']){
                        $css_files=array_merge($css_files,glob($file));
                    }
                }
            }elseif(is_string($include)) {

                $css_files=array_merge($css_files,glob($include));

            }
        }
        //-----------------------------------------------------

        $js_files=array_unique($js_files);
        $css_files=array_unique($css_files);

        foreach($js_files as $js_file){
            echo '<script src="/' . addslashes($js_file) . '"></script>'."\r\n    ";
        }
        foreach($css_files as $css_file){
            echo '<link rel="stylesheet" href="/' . addslashes($css_file) . '"/>'."\r\n    ";
        }

        //-----------------------------------------------------

    }else{
        echo '<script src="/app-build/js/towns.min.js"></script>'."\r\n    ";
        echo '<link rel="stylesheet" href="/app-build/css/towns.min.css" async/>'."\r\n";

        /*?>
            <link rel="stylesheet" type="text/css" href="/app-build/css/towns.min.css"/>
            <script src="/app-build/js/towns.min.js" async></script>
        <?php*/
    }
    //--------------------------------

    ?>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->



    <link rel="alternate" type="application/rss+xml" title="RSS" href="<?=addslashes($config['app']['blog']['rss_feed'])?>">


</head>
<body>


<?php if (isset($config['app']['google']['tracking_id'])) : ?>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Tracking|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', '<?= $config['app']['google']['tracking_id'] ?>', 'auto');
        ga('send', 'pageview');
    </script>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
<?php endif; ?>



    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Tracking|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <script type="text/javascript">
        window.smartlook||(function(d) {
            var o=smartlook=function(){ o.api.push(arguments)},s=d.getElementsByTagName('script')[0];
            var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
            c.charset='utf-8';c.src='//rec.getsmartlook.com/bundle.js';s.parentNode.insertBefore(c,s);
        })(document);
        smartlook('init', '1c0e43faacf49eba3de68d138e0d42646399d313');
    </script>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->



    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Messages|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <div id="loading">
        <i class="fa fa-spinner faa-spin animated"></i>
    </div>



    <div id="message-zone">



    <div id="message" style="display: none;"><?php /*todo remove inner*/ ?><div id="message_inner"></div></div>


    <div id="eu-cookies" style="display: none;">
        <div class="inner">
            <?=locale('ui prompts cookies')?>

            <button class="micro-button"><?=locale('ui buttons agree')?></button>
        </div>
    </div>


    <?php /*todo better solution*/ ?>
    <div id="townsapi-offline" style="display: none;">
        <div class="inner">
            <?=locale('ui warnings offline')?>

            <button class="micro-button" id="townsapi-reconnect"><?=locale('ui buttons reconnect')?></button>
            <button class="micro-button js-popup-window-open" page="offline"><?=locale('ui buttons offline')?></button>

        </div>
    </div>



    <div id="compatibility" style="display: none;">
        <div class="inner">
            <?=locale('ui warnings compatibility')?>

            <button class="micro-button js-popup-window-open" page="browser-compatibility"><?=locale('ui buttons compatibility')?></button>

        </div>
    </div>



    <div id="loadbar" style="display: block;">
        <div class="inner">

            Načítání grafických podkladů

            <div class="load-percent">0%</div>

        </div>
    </div>




    </div>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->




    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Map|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <div id="map_drag"></div>



    <canvas id="map_buffer" width="100" height="100"></canvas>
    <div id="map-move"></div>
    <div id="map-stories"></div>
    <div id="map-out"></div>
    <canvas id="map_bg" width="100" height="100"></canvas><!--todo Maybe refactor map_bg to map?-->
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->




    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Tool control|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->

    <div id="selecting-distance">
        <canvas id="selecting-distance-2d" width="100" height="50"></canvas>
        <canvas id="selecting-distance-3d" width="100" height="50"></canvas>
    </div>

    <div id="selecting-distance-ctl" style="display: none;">
        <div id="selecting-distance-plus" class="button-icon" title="<?=locale('ui tool controls plus')?>"><i class="fa fa-plus"></i></div>
        <div id="selecting-distance-minus" class="button-icon" title="<?=locale('ui tool controls minus')?>"><i class="fa fa-minus"></i></div>
        <div id="selecting-distance-left" class="button-icon" title="<?=locale('ui tool controls left')?>"><i class="fa fa-angle-double-left"></i></i></div>
        <div id="selecting-distance-right" class="button-icon" title="<?=locale('ui tool controls right')?>"><i class="fa fa-angle-double-right"></i></i></div>
        <div id="selecting-distance-close" class="button-icon" title="<?=locale('ui tool controls close')?>"><i class="fa fa-times"></i></div>
    </div>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->




    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Map control|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <div id="map-ctl">
        <div id="map-plus" class="button-icon" title="<?=locale('ui map controls plus')?>"><i class="fa fa-plus"></i></div>
        <div id="map-minus" class="button-icon" title="<?=locale('ui map controls minus')?>"><i class="fa fa-minus"></i></div>
        <div id="map-left" class="button-icon" title="<?=locale('ui map controls left')?>"><i class="fa fa-undo"></i></i></div>
        <div id="map-right" class="button-icon" title="<?=locale('ui map controls right')?>"><i class="fa fa-repeat"></i></i></div>
    </div>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->




    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Shortcut plugins|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <div id="macros">

        <!--<div onclick="objectPrototypesMenu('building','main');T.Plugins.open('building-editor',0,-1);return false;" class="button-icon" title="<?/*=locale('ui macros create building')*/?>"><i class="fa fa-building-o"></i></div>


        <div onclick="objectPrototypesMenu('building','wall');T.Plugins.open('building-block-editor',0,-1);return false;" class="button-icon" title="<?/*=locale('ui macros create building block')*/?>"><i class="fa fa-cube"></i></div>-->

        <div class="button-icon js-popup-window-open" page="feedback"><i class="fa fa-comment"></i></div>

    </div>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->




    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Main menu|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <nav class="menu">

        <!--todo [PH] vyřešit nějak lépe lokacizaci v aplikaci-->
        <div class="menu-logo">
            <img class="js-popup-window-open" page="home" src="/media/image/icons/logo.png" alt="<?=locale('ui logo')?>"/>

        </div>


        <ul class="menu-list menu-list-left">

            <li class="menu-list-item logged-in" style="display:none">
                <a><?=locale('ui menu nature')?></a>

                <ul class="menu-dlist">
                    <li class="menu-dlist-item"><a onclick="T.UI.Menu.Prototypes.menu('terrain');return false;"><?=locale('ui menu nature main')?></a></li>
                </ul>
            </li>

            <li class="menu-list-item logged-in" style="display:none">
                <a><?=locale('ui menu buildings')?></a>

                <ul class="menu-dlist">
                    <li class="menu-dlist-item"><a onclick="T.UI.Menu.Prototypes.menu('building','main');return false;"><?=locale('ui menu buildings main')?></a></li>
                    <li class="menu-dlist-item"><a onclick="T.UI.Menu.Prototypes.menu('building','wall');return false;"><?=locale('ui menu buildings wall')?></a></li>
                    <li class="menu-dlist-item"><a onclick="T.UI.Menu.Prototypes.menu('building','path');return false;"><?=locale('ui menu buildings path')?></a></li>
                    <!--<li class="menu-dlist-item"><a onclick="T.UI.Menu.Prototypes.menu('building','block');return false;"><?=locale('ui menu buildings block')?></a></li>-->
                    <li class="menu-dlist-item"><a onclick="T.UI.Menu.Building.dismantlingStart();return false;"><?=locale('ui menu buildings dismantle')?></a></li>
                </ul>
            </li>

            <li class="menu-list-item logged-in" style="display:none">
                <a><?=locale('ui menu stories')?></a>

                <ul class="menu-dlist">
                    <li class="menu-dlist-item">

                        <a onclick="T.UI.Menu.Story.start(T.User.object_prototypes.filterTypes('story').getAll()[0].id);T.UI.Messages.info(T.Locale.get('story hint'));return false;"><?=locale('ui menu stories write')?></a>



                    </li>
                </ul>
            </li>


            <?php if (isset($config['app']['environment']) && $config['app']['environment'] != "production"): ?>
            <li class="menu-list-item" id="menu-list-item-data">
                <a><?=locale('ui menu develop')?></a>



                <ul class="menu-dlist">

                    <li class="menu-dlist-info"><?=locale('ui menu develop info')?></li>
                    <li class="menu-dlist-item"><a onclick="map_bg.downloadCanvas();"><?=locale('ui menu develop screenshot')?></a></li>
                    <li class="menu-dlist-item"><a class="js-popup-window-open" page="locale-write"><?=locale('ui menu develop locale write')?> (<span id="locale-write-count">0</span>)</a></li>
                    <li class="menu-dlist-item"><a onclick="window.open( './', 'Towns', 'channelmode=no, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, titlebar=no, width=800, height=600, left=100, top=100' );"><?=locale('ui menu develop window')?></a></li>
                    <li class="menu-dlist-item"><a class="js-popup-window-open" page="deleting"><?=locale('ui menu develop deleting')?></a></li>

                </ul>
            </li>
            <?php endif; ?>



        </ul>




        <ul class="menu-list menu-list-right">


            <li class="menu-list-item" id="resources">
            </li>

            <li class="menu-list-item">
                <button class="width-middle pale js-popup-window-open logged-out" style="display:none" page="home"><?=locale('ui buttons about game')?></button><!--todo refactor atribute content to ?page-->
                <button class="width-middle js-popup-window-open logged-out js-townsapi-online" style="display:none" page="register"><?=locale('ui buttons register')?></button><!--todo refactor atribute content to ?page-->
                <button class="width-middle pale js-popup-window-open logged-out js-townsapi-online" style="display:none" page="login"><?=locale('ui buttons login')?></button><!--todo refactor atribute content to ?page-->

            </li>


            <?php /*<li class="menu-list-item menu-list-item-icon js-menu-top-popup-open faa-parent animated-hover" page="notifications" >
                <i class="fa fa-flag fa-lg faa-shake"></i>
            </li>*/ ?>


            <li class="menu-list-item menu-list-item-icon faa-parent animated-hover">

                <i id="server-loading" style="display: none;" class="fa fa-spinner faa-spin animated"></i>
                <i id="server-ok" class="fa fa-check-circle"></i>
                <i id="server-error" style="display: none;" class="fa fa-exclamation-triangle"></i>

            </li>


            <li class="menu-list-item menu-list-item-icon js-menu-top-popup-open logged-in" page="user" style="display:none"><!--faa-parent animated-hover-->

                <i class="fa fa-user"></i>

            </li>




        </ul>

        <div class="cleaner"></div>
    </nav>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->




    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Left menu|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <aside id="objectmenu">
        <div id="objectmenu-inner">
        </div>
    </aside>


    <div id="popup-action">
        <div class="arrow"></div>
        <div class="content"></div>
    </div>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->




    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Window popup|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <div class="overlay" style="display: <?= addslashes($inner_window['display']) ?>;"></div>
    <div class="popup-window" style="display: <?= addslashes($inner_window['display']) ?>;">
        <div class="header"></div>
        <div class="content"><?= ($inner_window['content']) ?></div>


        <div class="close js-popup-window-close"><i class="fa fa-times"></i></div>
    </div>
    <?php if($inner_window['content']):/*todo this JS is duplicite*/ ?>
        <script>
            $(function(){
                $('.popup-window .content').mousedown(function(){
                    $('body').enableSelection();
                });
                $('body').enableSelection();
                window_opened=true;
            });
        </script>
    <?php endif; ?>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->




    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|Top menu popup|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
    <?php

    $menu_top_popups = array(/*'notifications','server',*/'user');

    foreach($menu_top_popups as $menu_top_popup){
    ?>
    <div class="menu-top-popup" id="menu-top-popup-<?=$menu_top_popup?>"><!--todo  unify ui names-->
        <div class="arrow"></div>
        <div class="header"></div>
        <div class="content">


        </div>
        <div class="footer">
            <a href="#"><?=locale('ui menu top popup '.$menu_top_popup.' footer')?></a>
        </div>
    </div>
    <?php } ?>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->




</body>
</html>


<?php
// this will be called implicitly, but we'll
// call it manually to illustrate the point.
ob_end_flush();
?>
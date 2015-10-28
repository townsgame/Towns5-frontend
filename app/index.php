<?php


    //todo zde by se mela analyzovat URI - poslat dotaz do towns API a pote naplnit informace nize podle toho.

    $title = 'Towns';
    $description = '';

    $meta_og = [
        'site_name' => 'Towns',
        'title' => $title,
        'description' => $description,
        'type' => 'game'
        //'url' =>
        //'image' =>
    ];


    $window_display = 'none';
    $window_header = '';
    $window_content = '';

    $notifications_content = '';


    http_response_code(200);



?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">


        <title><?=htmlspecialchars($title)?></title>
        <meta name="description" content="<?=addslashes($description)?>">







        <?php

        //--------------------------------Dodatecne hlavicky

        if(isset($config['add_head'])) echo($config['add_head']);

        //--------------------------------Open Graph informace

        foreach($meta_og as $key=>$value){
            echo('<meta property="fb:'.addslashes($key).'" content="'.addslashes($value).'" >');

        }

        //--------------------------------

        ?>



        <!--<meta xml:base="http://towns.local">
        <base href="http://towns.local" target="_blank">-->
        <!--todo base je to vubec potreba ???-->

        <link rel="icon" href="/favicon.ico">



        <meta name="viewport" content="width=device-width, initial-scale=1">

        <?php

        if(isset($config['nomin'])/*tady je podminka zda jse o testovaci verzi*/) {
            ?>

            <link rel="stylesheet" type="text/css" href="/app/css/style.css"/>

            <link rel="stylesheet" type="text/css"
                  href="https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,latin-ext">
            <link rel="stylesheet" type="text/css" href="/app/css/font-awesome-4.4.0/css/font-awesome.css">
            <link rel="stylesheet" type="text/css" href="/app/css/font-awesome-animation.css">


            <script src="/app/lib/jquery-1.11.3.js"></script>
            <script src="/app/lib/jquery-ui.js"></script>

            <!--<script src="/app/lib/touch-punch.js"></script>-->
            <script src="/app/lib/mousewheel.js"></script>
            <script src="/app/lib/hammer.min.js"></script>
            <script src="/app/lib/fullscreen.min.js"></script>


            <script src="/app/js/func.lib.js"></script>
            <script src="/app/js/main.js"></script>
            <script src="/app/js/lang.lib.js"></script>
            <script src="/app/locale/cs.js"></script>


            <script src="/app/js/townsapi.lib.js"></script>
            <script src="/app/js/townsapi.fake.lib.js"></script>


            <script src="/app/js/functions/create.js"></script>
            <script src="/app/js/functions/terrain.js"></script>


            <script src="/app/js/map.lib.js"></script>
            <script src="/app/js/model.lib.js"></script>
            <script src="/app/js/graphic.js"></script>
            <script src="/app/js/events.js"></script>
            <script src="/app/js/objectmenu.js"></script><!--todo soubory podle funkci-->
            <script src="/app/js/terrainmenu.js"></script>
            <script src="/app/js/uniquemenu.js"></script>
            <script src="/app/js/ui.js"></script>


            <script src="app/js/localstorage.fake.js.php"></script>



            <script src="/app/coffeehtml/debug.js"></script>
            <!--<script src="app/coffeehtml/loginform.js"></script>-->
            <script src="/app/coffeehtml/projects.js"></script>


            <script src="/app/js/functions/login.js"></script>


            <!--<script async src='/browser-sync/browser-sync-client.2.9.8.js'></script>-->


        <?php
        }else{

            //todo tady by mel byt odkaz na 2 minifikovane soubory towns.js a towns.css

        }
        ?>




    </head>
    <body>


        <?php
            if(isset($config['add_body'])) echo($config['add_body']);
        ?>



        <div id="loading">
            <i class="fa fa-spinner faa-spin animated"></i>
        </div>



        <!--start of map-->

            <div id="map_drag"></div>


            <div id="loadbar_outer">
                <div id="loadbar"></div>
            </div>

            <canvas id="map_buffer" width="100" height="100"></canvas>
            <canvas id="map_bg" width="100" height="100"></canvas>


        <!--end of mapy-->


        <canvas id="selecting-distance" width="100" height="50"></canvas>


        <div id="selecting-distance-ctl">
            <div id="selecting-distance-plus" class="mini-button"><i class="fa fa-plus"></i></div>
            <div id="selecting-distance-minus" class="mini-button"><i class="fa fa-minus"></i></div>
            <div id="selecting-distance-left" class="mini-button"><i class="fa fa-angle-double-left"></i></i></div>
            <div id="selecting-distance-right" class="mini-button"><i class="fa fa-angle-double-right"></i></i></div>
            <div id="selecting-distance-close" class="mini-button"><i class="fa fa-times"></i></div>

        </div>




        <nav class="menu">

                <!--todo [PH] vyřešit nějak lépe lokacizaci v aplikaci-->
                <div class="menu-logo">
                    <img src="media/image/icon/logo1.png" alt="Towns.cz logo"/>

                </div>



                <ul class="menu-list menu-list-left">

                    <li class="menu-list-item">
                        <a href="#">Příroda</a>

                        <ul class="menu-dlist">
                            <li class="menu-dlist-item"><a href="#" onclick="objectMenuTerrainChange();">Typy</a></li>
                            <li class="menu-dlist-item"><a href="#" onclick="objectMenuLevelChange();">Výška</a></li>
                        </ul>
                    </li>

                    <li class="menu-list-item">
                        <a href="#">Budovy</a>

                        <ul class="menu-dlist">
                            <li class="menu-dlist-item"><a href="#" onclick="objectMenuUnique('main');">Zakladni</a></li>
                            <li class="menu-dlist-item"><a href="#" onclick="objectMenuUnique('wall');">Hradby</a></li>
                            <li class="menu-dlist-item"><a href="#" onclick="dismantlingStart();">Zbourat</a></li>
                        </ul>
                    </li>

                    <li class="menu-list-item">
                        <a href="#">Příběhy</a>

                        <ul class="menu-dlist">
                        </ul>
                    </li>

                    <li class="menu-list-item">
                        <a href="#">Zprávy</a>

                        <ul class="menu-dlist">
                        </ul>
                    </li>


                    <li class="menu-list-item">
                        <a href="#">Mapa</a>

                        <ul class="menu-dlist">
                        </ul>
                    </li>



                </ul>

                <ul class="menu-list menu-list-right">


                    <li class="menu-list-item menu-list-item-registration">
                        <a class="js-popup-window-open" header="Towns 5" content="projects_html" href="#">O hře</a>
                    </li>


                    <li class="menu-list-item menu-list-item-icon js-popup-notification-open faa-parent animated-hover"><i class="fa fa-flag fa-lg faa-shake"></i></li>
                    <li class="menu-list-item menu-list-item-icon faa-parent animated-hover"><i class="fa fa-wrench fa-lg faa-wrench"></i></li>
                    <li class="menu-list-item menu-list-item-icon faa-parent animated-hover" onclick="$(document).fullScreen(!$(document).fullScreen());"><i class="fa fa-arrows-alt fa-lg faa-pulse"></i></li><!--todo tohle neni ciste reseni js by mel byt mimo html dokumentu v tomhle pripade v ui.js-->



                </ul>

                <div class="cleaner"></div>
            </nav>







            <aside id="objectmenu">
                <div id="objectmenu-inner">
                    <div class="action-wrapper">

                        <div class="action js-popup-action-open" style="background: url('%icon');background-size: cover;" title="%title" content="%content" onclick="%action"></div>
                        <!--todo [PH] Nevím jak jinak donutit css aby brala v úvahu background-size: cover;-->
                        <!--todo background: url('%icon') nakonec funguje, ale je v logicky spatne, sice to prebere JS ale prohlezec se jednou pokusi nacist nesmyslny obrazek-->

                    </div>
                <div>

            </aside>



            <div id="popup-action">
                <div class="arrow"></div>
                <div class="content"></div>
                <div class="close js-popup-action-close"><i class="fa fa-times"></i></div>
            </div>



            <div class="overlay" style="display: <?=addslashes($window_display)?>;"></div>

            <div class="popup-window" style="display: <?=addslashes($window_display)?>;">
                <div class="header"><?=addslashes($window_header)?></div>
                <div class="content"><?=addslashes($window_content)?></div>


                <div class="close js-popup-window-close"><i class="fa fa-times"></i></div>
            </div>




            <div class="popup-notification">
                <div class="arrow"></div>
                <div class="header"></div>
                <div class="content">

                    <?=htmlspecialchars($notifications_content)?>

                </div>
                <div class="footer">
                    <a href="#">Všetky notifikácie</a>
                </div>
            </div>



    </body>
</html>
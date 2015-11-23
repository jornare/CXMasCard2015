window.cx = window.cx || {};
(function (document, window, ns) {
    var card,
        scene;

//set up events

    window.addEventListener('resize', function () {
        card.resize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('DOMContentLoaded', function () {
        window.card = card  = new ns.Card();
        scene = card.scene;
        card.resize(window.innerWidth, window.innerHeight);
        hideAddressBar();
        scene.start();
        /*
        setTimeout(function () {
            card.flip(false, true);
        }, 5000);

        setTimeout(function () {
            
        }
        , 500);*/
    });


    window.addEventListener('devicemotion', ondevicemotion, true);

    document.addEventListener("touchstart", function () {
        event.preventDefault();
        startTouch(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    }, false);

    document.addEventListener('mousedown', function (event) {
        startTouch(event.clientX, event.clientY);

    }, false);

    document.addEventListener('touchmove', function (event) {
        event.preventDefault();
        var touch = event.touches[0];
        touchMove(touch.pageX, touch.pageY);
    }, false);

    document.addEventListener('touchend', endTouch, false);

    document.addEventListener('mousemove', function (event) {
        scene.onMouseMove && scene.onMouseMove(event.clientX, event.clientY, event.buttons);
        if (!scene.touch) {
            return;
        }
        touchMove(event.clientX, event.clientY);
    }, false);

    document.addEventListener('mouseup', endTouch, false);



    function ondevicemotion(event) {
        if (event.accelerationIncludingGravity.y === null) {
            return;
        }
        var ax = event.acceleration.x / 9.81,
            ay = -event.acceleration.y / 9.81,
            az = -event.acceleration.z / 9.81,
            gx = event.accelerationIncludingGravity.x / 9.81,
            gy = -event.accelerationIncludingGravity.y / 9.81,
            gz = -event.accelerationIncludingGravity.z / 9.81,
            landscape = scene.width > scene.height;

        if (landscape) {
            if (gx - ax < 0) {
                scene.gravx = gy;
                scene.gravy = -gx - 2 * ax;
            } else {
                scene.gravx = gy;
                scene.gravy = gx + 2 * ax;
            }
        } else {
            scene.gravx = gx;
            scene.gravy = gy + 2 * ay;
            /*if(gy-ay>0){
                scene.gravx = gx;
                scene.gravy = gy;			
            }else{
                scene.gravx = gx;
                scene.gravy = -gy;
            }*/
        }
    };

    function startTouch(x, y) {
        ns.editMode && scene.addPoint(x,y);
        scene.stuckFlakes = [];
        scene.touch = { x: x, y: y, time: scene.lastFrameTime };
    }
    function touchMove(x, y) {
        scene.touch = { x: x, y: y, time: scene.lastFrameTime, dx: x - scene.touch.x, dy: y - scene.touch.y };
    }

    function endTouch() {
        card.flip(false);
        scene.touch = false;
    }


    function hideAddressBar() {
        if (!window.location.hash) {
            if (document.height < window.outerHeight) {
                document.body.style.height = (window.outerHeight + 50) + 'px';
            }
            setTimeout(function () { window.scrollTo(0, 1); }, 50);
        }
    }


}(document, window, window.cx));


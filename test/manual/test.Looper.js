( function () {
    "use strict";

    var AudioContext = webkitAudioContext || AudioContext;
    var context = new AudioContext();

    require( [ "models/Looper" ], function ( Looper ) {

        var workout = "https://dl.dropboxusercontent.com/u/2117088/WorkoutTrack.mp3";

        var drums = "https://dl.dropboxusercontent.com/u/77191118/sounds/drum.mp3";
        // var guitar = "https://dl.dropboxusercontent.com/u/77191118/sounds/guitar.mp3";
        // var piano = "https://dl.dropboxusercontent.com/u/77191118/sounds/piano.mp3";

        var looper = new Looper( context, null, function ( progressEvent, sound ) {
            console.log( "Loading.. ", sound, ( progressEvent.loaded / progressEvent.total ) );
        }, function () {
            //looper.playSpeed.setValueAtTime(0.00000000001,context.currentTime);
            console.log( "Loaded..." );
            looper.setSources( [ workout, "https://dl.dropboxusercontent.com/u/77191118/sounds/Hit5.mp3" ], function ( progressEvent, sound ) {
                console.log( "Loading Sources.. ", sound, ( progressEvent.loaded / progressEvent.total ) );
            }, function () {
                looper.maxLoops.value = 1;
                looper.start( context.currentTime + 2 );
            } );
        }, function () {
            console.log( "Starting...", context.currentTime );
        }, function () {
            console.log( "Ended...", context.currentTime );
        }, function ( event, track ) {
            console.log( "Track end... ", track );
        } );

        setTimeout( function () {
            looper.stop( context.currentTime + 2 );
        }, 30000 );

    } );
} )();
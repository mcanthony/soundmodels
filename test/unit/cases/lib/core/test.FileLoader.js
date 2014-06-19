require( [ 'core/FileLoader' ], function ( FileLoader ) {
    "use strict";
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var mp3File = "audio/bullet.mp3";
    var markedWavFile = "audio/sineloopstereomarked.wav";
    var markedStereoMp3File = "audio/sineloopstereomarked.mp3";
    var markedMonoMp3File = "audio/sineloopmonomarked.mp3";
    var unmarkedMonoWavFile = "audio/sineloopmono.wav";
    var unmarkedStereoWavFile = "audio/sineloopstereo.wav";

    describe( 'FileLoader.js', function () {

        var customMatchers = {
            toBeInstanceOf: function () {
                return {
                    compare: function ( actual, expected ) {
                        var result = {};
                        result.pass = actual instanceof expected;
                        if ( result.pass ) {
                            result.message = 'Expected ' + actual + ' to be an instance of ' + expected;
                        } else {
                            result.message = 'Expected ' + actual + ' to be an instance of ' + expected + ', but it is not';
                        }
                        return result;
                    }
                };
            }
        };

        beforeEach( function () {
            jasmine.addMatchers( customMatchers );
        } );

        describe( '#new FileLoader( URL, context, onloadCallback )', function () {

            it( "should return true on callback function if url supplied is valid", function () {
                var fileLoader = new FileLoader( 'audio/sineloopstereo.wav', context, function ( response ) {
                    expect( response )
                        .toEqual( true );
                } );
            } );

            it( "should return false on callback function if url supplied is blank", function () {
                var fileLoader = new FileLoader( '', context, function ( response ) {
                    expect( response )
                        .toEqual( false );
                } );
            } );

            it( "should return false on callback function if url supplied is not a url", function () {
                var fileLoader = new FileLoader( 'abcdef', context, function ( response ) {
                    expect( response )
                        .toEqual( false );
                } );
            } );

            it( "should return false on callback function if url supplied is broken", function () {
                var fileLoader = new FileLoader( 'audio/doesnotexist.wav', context, function ( response ) {
                    expect( response )
                        .toEqual( false );
                } );
            } );

            it( "should be able to accept a file/blob object", function () {

                var context = new AudioContext();
                var request = new XMLHttpRequest();

                request.open( 'GET', 'audio/sineloopstereo.wav', true );
                request.responseType = 'blob';

                request.onload = function () {
                    var fileloader = new FileLoader( request.response, context, function ( response ) {
                        expect( response )
                            .toEqual( true );
                    } );
                };
                request.send();
            } );
        } );

        describe( '#getBuffer', function () {

            it( "should return a buffer if file is loaded", function ( done ) {
                var fileLoader = new FileLoader( mp3File, context, function ( response ) {
                    expect( fileLoader.getBuffer() )
                        .toBeInstanceOf( AudioBuffer );
                    done();
                } );

            } );

            it( "should throw an error if no buffer is available", function ( done ) {
                var fileLoader = new FileLoader( '', context, function ( response ) {
                    expect( function () {
                        fileLoader.getBuffer();
                    } )
                        .toThrowError();
                    done();
                } );
            } );

        } );

        describe( '#getRawBuffer', function () {

            it( "should return the original unsliced buffer", function ( done ) {
                var fileLoader = new FileLoader( mp3File, context, function () {
                    expect( fileLoader.getBuffer()
                        .length )
                        .not.toEqual( fileLoader.getRawBuffer()
                            .length );
                    expect( fileLoader.getRawBuffer() )
                        .toBeInstanceOf( AudioBuffer );
                    done();
                } );
            } );

            it( "should have a buffer length greater than the sliced buffer", function ( done ) {
                var fileLoader = new FileLoader( mp3File, context, function () {
                    var buffer = fileLoader.getBuffer();
                    var rawBuffer = fileLoader.getRawBuffer();
                    expect( buffer.length )
                        .not.toBeGreaterThan( rawBuffer.length );
                    done();
                } );

            } );

            it( "should throw an error if no buffer is available", function ( done ) {
                var fileLoader = new FileLoader( '', context, function ( response ) {
                    expect( function () {
                        fileLoader.getBuffer();
                    } )
                        .toThrowError();
                    done();
                } );
            } );
        } );

        describe( '#isLoaded', function () {
            it( "should return true if buffer is loaded", function ( done ) {
                var fileLoader = new FileLoader( mp3File, context, function ( response ) {
                    expect( response )
                        .toEqual( true );
                    expect( fileLoader.isLoaded() )
                        .toEqual( true );
                    done();
                } );
            } );
        } );

    } );
} );
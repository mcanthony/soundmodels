/*javascript-sound-models - v1.0.0 - 2014-06-05 */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library.");

define("core/Config",[],function(){function e(){}return e.ZERO=parseFloat("1e-37"),e.MAX_VOICES=8,e.NOMINAL_REFRESH_RATE=60,e.WINDOW_LENGTH=512,e}),define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/AudioContextMonkeyPatch"],function(){function e(e){void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,this.numberOfInputs=0,this.numberOfOutputs=0,this.maxSources=0,this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.modelName="Model",this.releaseGainNode.connect(this.audioContext.destination)}return e.prototype.connect=function(e,t,n){if(e instanceof AudioNode)this.releaseGainNode.connect(e,t,n);else{if(!(e.inputNode instanceof AudioNode))throw{name:"No Input Connection Exception",message:"Attempts to connect "+typeof t+" to "+typeof this,toString:function(){return this.name+": "+this.message}};this.releaseGainNode.connect(e.inputNode,t,n)}},e.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e)},e.prototype.start=function(){this.isPlaying=!0},e.prototype.stop=function(e){this.isPlaying=!1,"undefined"==typeof e&&(e=0),this.releaseGainNode.gain.cancelScheduledValues(e)},e.prototype.release=function(e,t){if(this.isPlaying){var n=.5,o=1/this.audioContext.sampleRate;"undefined"==typeof e&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),this.stop(e+t+o)}},e.prototype.play=function(){this.start(0)},e.prototype.pause=function(){this.isPlaying=!1},e.prototype.listParams=function(){var e=[];for(var t in this){var n=this[t];n&&n.hasOwnProperty("value")&&n.hasOwnProperty("minValue")&&n.hasOwnProperty("maxValue")&&e.push(n)}return e},e}),define("core/WebAudioDispatch",[],function(){function e(e,t,n){if(n){var o=n.currentTime;o>=t||.005>t-o?e():(console.log("Dispatching in ",1e3*(t-o)),window.setTimeout(function(){e()},1e3*(t-o)))}}return e}),define("core/SPAudioParam",["core/WebAudioDispatch"],function(e){function t(t,n,o,a,i,r,u,c){var s,l=1e-4,f=500,p=0;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",Object.defineProperty(this,"value",{enumerable:!0,set:function(e){if(typeof e!=typeof a)throw{name:"Incorrect value type Exception",message:"Attempt to set a "+typeof a+" parameter to a "+typeof e+" value",toString:function(){return this.name+": "+this.message}};"number"==typeof e&&(e>o?(console.log(this.name+" clamping to max"),e=o):n>e&&(console.log(this.name+" clamping to min"),e=n)),"function"==typeof r&&(e=r(e)),"function"==typeof u&&c?u(i,e,c):i?i instanceof AudioParam?i.value=e:i instanceof Array&&i.forEach(function(t){t.value=e}):window.clearInterval(s),p=e},get:function(){if(i){if(i instanceof AudioParam)return i.value;if(i instanceof Array)return i[0].value}return p}}),i&&(i instanceof AudioParam||i instanceof Array)){var d=i[0]||i;this.defaultValue=d.defaultValue,this.minValue=d.minValue,this.maxValue=d.maxValue,this.value=d.defaultValue,this.name=d.name}t&&(this.name=t),"undefined"!=typeof a&&(this.defaultValue=a,this.value=a),"undefined"!=typeof n&&(this.minValue=n),"undefined"!=typeof o&&(this.maxValue=o),this.setValueAtTime=function(t,n){if("function"==typeof r&&(t=r(t)),i)i instanceof AudioParam?i.setValueAtTime(t,n):i instanceof Array&&i.forEach(function(e){e.setValueAtTime(t,n)});else{var o=this;e(function(){o.value=t},n,c)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof r&&(e=r(e)),i)i instanceof AudioParam?i.setTargetAtTime(e,t,n):i instanceof Array&&i.forEach(function(o){o.setTargetAtTime(e,t,n)});else{var o=this,a=o.value,u=c.currentTime;s=window.setInterval(function(){c.currentTime>=t&&(o.value=e+(a-e)*Math.exp(-(c.currentTime-u)/n),Math.abs(o.value-e)<l&&window.clearInterval(s))},f)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof r)for(var o=0;o<e.length;o++)e[o]=r(e[o]);if(i)i instanceof AudioParam?i.setValueCurveAtTime(e,t,n):i instanceof Array&&i.forEach(function(o){o.setValueCurveAtTime(e,t,n)});else{var a=this,u=c.currentTime;s=window.setInterval(function(){if(c.currentTime>=t){var o=Math.floor(e.length*(c.currentTime-u)/n);o<e.length?a.value=e[o]:window.clearInterval(s)}},f)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),i)i instanceof AudioParam?i.exponentialRampToValueAtTime(e,t):i instanceof Array&&i.forEach(function(n){n.exponentialRampToValueAtTime(e,t)});else{var n=this,o=n.value,a=c.currentTime;0===o&&(o=.001),s=window.setInterval(function(){var i=(c.currentTime-a)/(t-a);n.value=o*Math.pow(e/o,i),c.currentTime>=t&&window.clearInterval(s)},f)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),i)i instanceof AudioParam?i.linearRampToValueAtTime(e,t):i instanceof Array&&i.forEach(function(n){n.linearRampToValueAtTime(e,t)});else{var n=this,o=n.value,a=c.currentTime;s=window.setInterval(function(){var i=(c.currentTime-a)/(t-a);n.value=o+(e-o)*i,c.currentTime>=t&&window.clearInterval(s)},f)}},this.cancelScheduledValues=function(e){i?i instanceof AudioParam?i.cancelScheduledValues(e):i instanceof Array&&i.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(s)}}return t.createPsuedoParam=function(e,n,o,a,i){return new t(e,n,o,a,null,null,null,i)},t}),define("core/SPPlaybackRateParam",[],function(){function e(e,t){this.defaultValue=e.defaultValue,this.maxValue=e.maxValue,this.minValue=e.minValue,this.name=e.name,this.units=e.units,Object.defineProperty(this,"value",{enumerable:!0,set:function(n){e.value=n,t.value=n},get:function(){return e.value}}),this.linearRampToValueAtTime=function(n,o){e.linearRampToValueAtTime(n,o),t.linearRampToValueAtTime(n,o)},this.exponentialRampToValueAtTime=function(n,o){e.exponentialRampToValueAtTime(n,o),t.exponentialRampToValueAtTime(n,o)},this.setValueCurveAtTime=function(n,o,a){e.setValueCurveAtTime(n,o,a),t.setValueCurveAtTime(n,o,a)},this.setTargetAtTime=function(n,o,a){e.setTargetAtTime(n,o,a),t.setTargetAtTime(n,o,a)},this.setValueAtTime=function(n,o){e.setValueAtTime(n,o),t.setValueAtTime(n,o)},this.cancelScheduledValues=function(n){e.cancelScheduledValues(n),t.cancelScheduledValues(n)}}return e}),define("core/SPAudioBufferSourceNode",["core/SPPlaybackRateParam","core/WebAudioDispatch"],function(e,t){function n(n){function o(e){for(var t=new Float32Array(e.length),o=n.createBuffer(1,e.length,44100),a=0;a<e.length;a++)t[a]=a;return o.getChannelData(0).set(t),o}function a(){u.connect(c),c.onaudioprocess=i}function i(e){var t=e.inputBuffer.getChannelData(0);s=t[t.length-1]||0}var r=n.createBufferSource(),u=n.createBufferSource(),c=n.createScriptProcessor(256,1,1),s=0;this.audioContext=n,this.channelCount=r.channelCount,this.channelCountMode=r.channelCountMode,this.channelInterpretation=r.channelInterpretation,this.numberOfInputs=r.numberOfInputs,this.numberOfOutputs=r.numberOfOutputs,this.playbackState=r.playbackState,this.playbackRate=new e(r.playbackRate,u.playbackRate),Object.defineProperty(this,"loopEnd",{enumerable:!0,set:function(e){r.loopEnd=e,u.loopEnd=e},get:function(){return r.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,set:function(e){r.loopStart=e,u.loopStart=e},get:function(){return r.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,set:function(e){r.onended=e},get:function(){return r.onended}}),Object.defineProperty(this,"loop",{enumerable:!0,set:function(e){r.loop=e,u.loop=e},get:function(){return r.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,get:function(){return s}}),Object.defineProperty(this,"buffer",{enumerable:!0,set:function(e){r.buffer=e,u.buffer=o(e)},get:function(){return r.buffer}}),this.connect=function(e,t,n){r.connect(e,t,n),c.connect(e,t,n)},this.disconnect=function(e){r.disconnect(e),c.disconnect(e)},this.start=function(e,t,n){"undefined"==typeof n&&(n=r.buffer.duration),r.start(e,t,n),u.start(e,t,n)},this.stop=function(e){var t=r.playbackState;void 0!==t&&t===r.PLAYING_STATE&&r.stop(e),t=u.playbackState,void 0!==t&&t===r.PLAYING_STATE&&u.stop(e)},this.resetBufferSource=function(o,a){var i=this;t(function(){i.disconnect(a);var t=i.audioContext.createBufferSource();t.buffer=r.buffer,t.loopStart=r.loopStart,t.loopEnd=r.loopEnd,t.onended=r.onended,r=t;var o=n.createBufferSource();o.buffer=u.buffer,o.connect(c),u=o,i.playbackRate=new e(r.playbackRate,u.playbackRate),i.connect(a)},o,this.audioContext)},a()}return n}),define("core/DetectLoopMarkers",[],function(){function e(e){var t=0,n=0,o=5e3,a=.5,i=2e4,r=.01,u=1024,c=16,s=[],l=0,f=function(e,t){for(var n=0,o=t+c;t+c+u>o;++o)n+=Math.abs(e[o]);return r>n/u},p=function(e){return function(t,n,o){var i;return i=o%2===0?n[e]>a:n[e]<-a,t&&i}},d=function(e){var a=null,r=null;t=0,n=l;for(var u=0;null===a&&l>u&&i>u;){if(e.reduce(p(u),!0)&&(1!==e.length||f(e[0],u))){a=u;break}u++}for(u=l;null===r&&u>0&&i>l-u;){if(e.reduce(p(u),!0)){r=u;break}u--}return null!==a&&null!==r&&r>a+o?(t=a+o/2,n=r-o/2,!0):!1},h=function(e){return function(t,n){return t&&Math.abs(n[e])<r}},m=function(e){var o=!0;for(t=0;i>t&&l>t&&(o=e.reduce(h(t),!0));)t++;for(n=l;i>l-n&&n>0&&(o=e.reduce(h(n),!0));)n--;t>n&&(t=0)};l=e.length;for(var y=0;y<e.numberOfChannels;y++)s.push(new Float32Array(e.getChannelData(y)));return d(s)||m(s),{start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,o,a,i){function r(){var e=Object.prototype.toString.call(n),t=/[^.]+$/.exec(n);if("[object String]"===e){var o=new XMLHttpRequest;o.open("GET",n,!0),o.responseType="arraybuffer",o.addEventListener("progress",i,!1),o.onload=function(){u(o.response,t)},o.send()}else if("[object File]"===e){var a=new FileReader;a.addEventListener("progress",i,!1),a.onload=function(){u(a.result,t)},a.readAsArrayBuffer(n)}}function u(t,i){o.decodeAudioData(t,function(t){if(f=!0,c=t,s=0,l=c.length,"wav"!==i[0]){var n=e(c);n&&(s=n.start,l=n.end)}a&&"function"==typeof a&&a(!0)},function(){console.log("Error Decoding "+n),a&&"function"==typeof a&&a(!1)})}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var c,s=0,l=0,f=!1,p=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},d=function(e,t){if("undefined"==typeof t&&(t=c.length),!p(e))throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter is not an integer",toString:function(){return this.name+": "+this.message}};if(!p(t))throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer end parameter is not an integer",toString:function(){return this.name+": "+this.message}};if(e>t)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter should be smaller than end parameter",toString:function(){return this.name+": "+this.message}};if(e>l||s>e)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter should be within the buffer size : 0-"+c.length,toString:function(){return this.name+": "+this.message}};if(t>l||s>t)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer end parameter should be within the buffer size : 0-"+c.length,toString:function(){return this.name+": "+this.message}};for(var n=t-e,a=o.createBuffer(c.numberOfChannels,n,c.sampleRate),i=0;i<c.numberOfChannels;i++){var r=new Float32Array(c.getChannelData(i));a.getChannelData(i).set(r.subarray(e,t))}return a};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=l-s),d(s+e,s+t)},this.getRawBuffer=function(){return c},this.isLoaded=function(){return f},r()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,o,a){function i(){var e=Object.prototype.toString.call(t);"[object Array]"===e?(s=t.length,t.forEach(function(e){r(e,u)})):void 0!==t&&null!==t&&(s=1,r(t,u))}function r(t,n){var o=Object.prototype.toString.call(t);if("[object String]"===o||"[object File]"===o)var i=new e(t,c.audioContext,function(e){e&&n(e,i.getBuffer())},function(e){a&&"function"==typeof a&&a(e,t)});else{if("[object AudioBuffer]"!==o)throw{name:"Incorrect Parameter type Exception",message:"Looper argument is not a URL or AudioBuffer",toString:function(){return this.name+": "+this.message}};n(!0,t)}}function u(e,t){s--,l.push(t),0===s&&o(e,l)}var c=this,s=0,l=[];i()}return t}),define("models/Looper",["core/Config","core/BaseSound","core/SPAudioParam","core/SPAudioBufferSourceNode","core/MultiFileLoader"],function(e,t,n,o,a){function i(r,u,c,s,l){function f(e){var t=Object.prototype.toString.call(e);if(y=[],d.forEach(function(e){e.disconnect()}),d=[],"[object Array]"===t&&e.length>p.maxSources)throw{name:"Unsupported number of sources",message:"This sound only supports a maximum of "+p.maxSources+" sources.",toString:function(){return this.name+": "+this.message}};"[object AudioBuffer]"===t?g(!0,[e]):a.call(p,e,p.audioContext,g,s)}if(!(this instanceof i))throw new TypeError("Looper constructor cannot be called as a function.");t.call(this,u),this.maxSources=e.MAX_VOICES,this.numberOfInputs=1,this.numberOfOutputs=1,this.modelName="Looper";var p=this,d=[],h=[],m=[],y=[],A=c,g=function(e,t){t.forEach(function(e,t){m.push(0),T(e,t)}),p.playSpeed=new n("playSpeed",0,10,1,y,null,b,p.audioContext),p.isInitialized=!0,"function"==typeof A&&A(e)},v=function(e,t,n){p.isPlaying=!1;var o=p.audioContext.currentTime;n.resetBufferSource(o,h[t]),"function"==typeof l&&l(p,t)},T=function(e,t){var a=new o(p.audioContext);a.buffer=e,a.loopEnd=e.duration,a.onended=function(e){v(e,t,a)};var i;if(h[t])i=h[t];else{i=p.audioContext.createGain(),h[t]=i;var r=new n("gain",0,1,1,i.gain,null,null,p.audioContext);p.multiTrackGain.push[t]=r}a.connect(i),i.connect(p.releaseGainNode),d.push(a),y.push(a.playbackRate)},b=function(e,t,n){if(p.isInitialized){var o=6.90776,a=d[0]?d[0].playbackRate.value:1;t>a?d.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,p.riseTime.value/o)}):a>t&&d.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,p.decayTime.value/o)})}},x=function(e,t){d.forEach(function(e){e.loopStart=t*e.buffer.duration})};this.playSpeed=null,this.riseTime=n.createPsuedoParam("riseTime",.05,10,1,this.audioContext),this.decayTime=n.createPsuedoParam("decayTime",.05,10,1,this.audioContext),this.startPoint=new n("startPoint",0,.99,0,null,null,x,this.audioContext),this.multiTrackGain=[],this.maxLoops=n.createPsuedoParam("maxLoops",-1,1,-1,this.audioContext),this.setSources=function(e,t){this.isInitialized=!1,A=t,f(e)},this.play=function(){this.isPlaying||d.forEach(function(e,t){var n=m&&m[t]?m[t]:p.startPoint.value*e.buffer.duration;e.loop=1!==p.maxLoops.value,e.start(0,n)}),t.prototype.start.call(this,0)},this.start=function(e,n,o,a){this.isPlaying||d.forEach(function(t){if(("undefined"==typeof n||null===n)&&(n=p.startPoint.value*t.buffer.duration),("undefined"==typeof o||null===o)&&(o=t.buffer.duration),t.loop=1!==p.maxLoops.value,"undefined"!=typeof a){var i=p.audioContext.currentTime;p.releaseGainNode.gain.cancelScheduledValues(i),p.releaseGainNode.gain.setValueAtTime(0,i),p.releaseGainNode.gain.linearRampToValueAtTime(1,i+a)}else p.releaseGainNode.gain.setValueAtTime(1,p.audioContext.currentTime);t.start(e,n,o)}),t.prototype.start.call(this,e,n,o)},this.stop=function(e){d.forEach(function(t,n){p.isPlaying&&t.stop(e),m[n]=0}),t.prototype.stop.call(this,e)},this.pause=function(){d.forEach(function(e,t){p.isPlaying&&e.stop(0),m[t]=e.playbackPosition/e.buffer.sampleRate}),t.prototype.stop.call(this,0)},r&&f(r)}return i.prototype=Object.create(t.prototype),i});
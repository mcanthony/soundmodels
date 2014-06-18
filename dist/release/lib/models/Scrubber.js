/*javascript-sound-models - v1.0.0 - 2014-06-18 */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library.");

define("core/Config",[],function(){function e(){}return e.ZERO=parseFloat("1e-37"),e.MAX_VOICES=8,e.NOMINAL_REFRESH_RATE=60,e.WINDOW_LENGTH=512,e}),define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/AudioContextMonkeyPatch"],function(){function e(e){void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,this.numberOfInputs=0,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,get:function(){return this.releaseGainNode.numberOfOutputs}});var t=0;Object.defineProperty(this,"maxSources",{enumerable:!0,set:function(e){0>e&&(e=0),t=Math.round(e)},get:function(){return t}}),this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.modelName="Model",this.releaseGainNode.connect(this.audioContext.destination)}return e.prototype.connect=function(e,t,n){if(e instanceof AudioNode)this.releaseGainNode.connect(e,t,n);else{if(!(e.inputNode instanceof AudioNode))throw new Error("No Input Connection - Attempts to connect "+typeof t+" to "+typeof this);this.releaseGainNode.connect(e.inputNode,t,n)}},e.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e)},e.prototype.start=function(){this.isPlaying=!0},e.prototype.stop=function(e){var t=1/this.audioContext.sampleRate;this.isPlaying=!1,"undefined"==typeof e&&(e=0),this.releaseGainNode.gain.cancelScheduledValues(e),this.releaseGainNode.gain.setValueAtTime(1,e+t)},e.prototype.release=function(e,t){if(this.isPlaying){var n=.5,r=1/this.audioContext.sampleRate;"undefined"==typeof e&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),this.stop(e+t+r)}},e.prototype.play=function(){this.start(0)},e.prototype.pause=function(){this.isPlaying=!1},e.prototype.listParams=function(){var e=[];for(var t in this){var n=this[t];n&&n.hasOwnProperty("value")&&n.hasOwnProperty("minValue")&&n.hasOwnProperty("maxValue")&&e.push(n)}return e},e}),define("core/WebAudioDispatch",[],function(){function e(e,t,n){if(n){var r=n.currentTime;r>=t||.005>t-r?e():(console.log("Dispatching in ",1e3*(t-r)),window.setTimeout(function(){e()},1e3*(t-r)))}}return e}),define("core/SPAudioParam",["core/WebAudioDispatch"],function(e){function t(t,n,r,o,a,i,u,c){var s,f=1e-4,l=500,d=0;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",Object.defineProperty(this,"value",{enumerable:!0,set:function(e){if(typeof e!=typeof o)throw new Error(0/0+typeof o+" parameter to a "+typeof e+" value");"number"==typeof e&&(e>r?(console.log(this.name+" clamping to max"),e=r):n>e&&(console.log(this.name+" clamping to min"),e=n)),"function"==typeof i&&(e=i(e)),"function"==typeof u&&c?u(a,e,c):a?a instanceof AudioParam?a.value=e:a instanceof Array&&a.forEach(function(t){t.value=e}):window.clearInterval(s),d=e},get:function(){if(a){if(a instanceof AudioParam)return a.value;if(a instanceof Array)return a[0].value}return d}}),a&&(a instanceof AudioParam||a instanceof Array)){var p=a[0]||a;this.defaultValue=p.defaultValue,this.minValue=p.minValue,this.maxValue=p.maxValue,this.value=p.defaultValue,this.name=p.name}t&&(this.name=t),"undefined"!=typeof o&&(this.defaultValue=o,this.value=o),"undefined"!=typeof n&&(this.minValue=n),"undefined"!=typeof r&&(this.maxValue=r),this.setValueAtTime=function(t,n){if("function"==typeof i&&(t=i(t)),a)a instanceof AudioParam?a.setValueAtTime(t,n):a instanceof Array&&a.forEach(function(e){e.setValueAtTime(t,n)});else{var r=this;e(function(){r.value=t},n,c)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof i&&(e=i(e)),a)a instanceof AudioParam?a.setTargetAtTime(e,t,n):a instanceof Array&&a.forEach(function(r){r.setTargetAtTime(e,t,n)});else{var r=this,o=r.value,u=c.currentTime;s=window.setInterval(function(){c.currentTime>=t&&(r.value=e+(o-e)*Math.exp(-(c.currentTime-u)/n),Math.abs(r.value-e)<f&&window.clearInterval(s))},l)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof i)for(var r=0;r<e.length;r++)e[r]=i(e[r]);if(a)a instanceof AudioParam?a.setValueCurveAtTime(e,t,n):a instanceof Array&&a.forEach(function(r){r.setValueCurveAtTime(e,t,n)});else{var o=this,u=c.currentTime;s=window.setInterval(function(){if(c.currentTime>=t){var r=Math.floor(e.length*(c.currentTime-u)/n);r<e.length?o.value=e[r]:window.clearInterval(s)}},l)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof i&&(e=i(e)),a)a instanceof AudioParam?a.exponentialRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.exponentialRampToValueAtTime(e,t)});else{var n=this,r=n.value,o=c.currentTime;0===r&&(r=.001),s=window.setInterval(function(){var a=(c.currentTime-o)/(t-o);n.value=r*Math.pow(e/r,a),c.currentTime>=t&&window.clearInterval(s)},l)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof i&&(e=i(e)),a)a instanceof AudioParam?a.linearRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.linearRampToValueAtTime(e,t)});else{var n=this,r=n.value,o=c.currentTime;s=window.setInterval(function(){var a=(c.currentTime-o)/(t-o);n.value=r+(e-r)*a,c.currentTime>=t&&window.clearInterval(s)},l)}},this.cancelScheduledValues=function(e){a?a instanceof AudioParam?a.cancelScheduledValues(e):a instanceof Array&&a.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(s)}}return t.createPsuedoParam=function(e,n,r,o,a){return new t(e,n,r,o,null,null,null,a)},t}),define("core/DetectLoopMarkers",[],function(){function e(e){var t=0,n=0,r=!0,o=5e3,a=.5,i=2e4,u=.01,c=1024,s=16,f=[],l=0,d=function(e,t){for(var n=0,r=t+s;t+s+c>r;++r)n+=Math.abs(e[r]);return u>n/c},p=function(e){return function(t,n,r){var o;return o=r%2===0?n[e]>a:n[e]<-a,t&&o}},h=function(e){var r=null,a=null;t=0,n=l;for(var u=0;null===r&&l>u&&i>u;){if(e.reduce(p(u),!0)&&(1!==e.length||d(e[0],u))){r=u;break}u++}for(u=l;null===a&&u>0&&i>l-u;){if(e.reduce(p(u),!0)){a=u;break}u--}return null!==r&&null!==a&&a>r+o?(t=r+o/2,n=a-o/2,!0):!1},y=function(e){return function(t,n){return t&&Math.abs(n[e])<u}},m=function(e){var r=!0;for(t=0;i>t&&l>t&&(r=e.reduce(y(t),!0));)t++;for(n=l;i>l-n&&n>0&&(r=e.reduce(y(n),!0));)n--;t>n&&(t=0)};l=e.length;for(var v=0;v<e.numberOfChannels;v++)f.push(new Float32Array(e.getChannelData(v)));return h(f)||(m(f),r=!1),{marked:r,start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,r,o,a){function i(){var e=Object.prototype.toString.call(n),t=/[^.]+$/.exec(n);if("[object String]"===e){var r=new XMLHttpRequest;r.open("GET",n,!0),r.responseType="arraybuffer",r.addEventListener("progress",a,!1),r.onload=function(){u(r.response,t)},r.send()}else if("[object File]"===e||"[object Blob]"===e){var o=new FileReader;o.addEventListener("progress",a,!1),o.onload=function(){u(o.result,t)},o.readAsArrayBuffer(n)}}function u(t,a){r.decodeAudioData(t,function(t){if(l=!0,c=t,s=0,f=c.length,"wav"!==a[0]){var n=e(c);n&&(s=n.start,f=n.end)}o&&"function"==typeof o&&o(!0)},function(){console.warn("Error Decoding "+n),o&&"function"==typeof o&&o(!1)})}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var c,s=0,f=0,l=!1,d=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},p=function(e,t){if("undefined"==typeof t&&(t=c.length),!d(e))throw new Error("Incorrect parameter Type - FileLoader getBuffer start parameter is not an integer");if(!d(t))throw new Error("Incorrect parameter Type - FileLoader getBuffer end parameter is not an integer");if(e>t)throw new Error("Incorrect parameter Type - FileLoader getBuffer start parameter should be smaller than end parameter");if(e>f||s>e)throw new Error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+c.length);if(t>f||s>t)throw new Error("Incorrect parameter Type - FileLoader getBuffer end parameter should be within the buffer size : 0-"+c.length);var n=t-e;if(!c)throw new Error("No Buffer Found - Buffer loading has not completed or has failed.");for(var o=r.createBuffer(c.numberOfChannels,n,c.sampleRate),a=0;a<c.numberOfChannels;a++){var i=new Float32Array(c.getChannelData(a));o.getChannelData(a).set(i.subarray(e,t))}return o};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=f-s),p(s+e,s+t)},this.getRawBuffer=function(){if(!l)throw new Error("No Buffer Found - Buffer loading has not completed or has failed.");return c},this.isLoaded=function(){return l},i()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,r,o){function a(){var e=Object.prototype.toString.call(t);"[object Array]"===e?(s=t.length,t.forEach(function(e){i(e,u)})):void 0!==t&&null!==t&&(s=1,i(t,u))}function i(t,n){var r=Object.prototype.toString.call(t);if("[object String]"===r||"[object File]"===r)var a=new e(t,c.audioContext,function(e){e?n(e,a.getBuffer()):n(e)},function(e){o&&"function"==typeof o&&o(e,t)});else{if("[object AudioBuffer]"!==r)throw new Error("Incorrect Parameter Type - Source is not a URL or AudioBuffer");n(!0,t)}}function u(e,n){e&&f.push(n),s--,0===s&&r(f.length===t.length,f)}var c=this;this.audioContext=n;var s=0,f=[];a()}return t}),define("models/Scrubber",["core/Config","core/BaseSound","core/SPAudioParam","core/MultiFileLoader"],function(e,t,n,r){function o(a,i,u,c){function s(t){var n=Object.prototype.toString.call(t);if("[object Array]"===n&&t.length>1)throw new Error("Incorrect Parameter Type - Extender only accepts a single Source as argument");r.call(C,t,C.audioContext,I,c),d=e.WINDOW_LENGTH,p=d/2,T=0,m=l(d,1);for(var o=0;d>o;o++)m[o]=.25*(1-Math.cos(2*Math.PI*(o+.5)/d))}function f(e){if(C.isPlaying&&C.isInitialized)for(var t,n,r=e.outputBuffer.length;r>0;){if(T>0&&r>0){var o=Math.min(r,T);for(n=0;A>n;n++){var a=h[n].subarray(p-T,p-T+o);e.outputBuffer.getChannelData(n).set(a,e.outputBuffer.length-r)}r-=o,T-=o}if(r>0){var i,u=C.playPosition.value;if(Math.abs(b-u)*v>E*w)P=u,i=0;else{var c=S*P+(1-S)*u;i=(c-P)*v/p,P=c}for(b=u,t=0;d-p>t;t++)for(n=0;A>n;n++)h[n][t]=h[n][t+p];for(t=d-p;d>t;t++)for(n=0;A>n;n++)h[n][t]=0;for(t=0;d-p>t;t++)for(n=0;A>n;n++)y[n][t]=y[n][t+p];var s=0,f=0;for(t=0;d-p>t;t++){var l=0;for(n=0;A>n;n++)l+=y[n][t];l>f&&(s=t,f=l)}var g=parseInt(P*(v-d)),V=0,I=0;for(t=0;d>t;t++){var F=0,D=(g+t)%v;for(n=0;A>n;n++)F+=x[n][D];F>I&&(I=F,V=t)}var M=V-s;for(g+=M,t=0;d>t;t++){var G=(g+t)%v;for(0>G&&(G=0),n=0;A>n;n++)y[n][t]=x[n][G]}var R=C.noMotionFade.value,L=1;R&&Math.abs(i)<N&&(L=0),O=B*O+(1-B)*L;var _=C.muteOnReverse.value;for(0>i&&_&&(O=0),t=0;d>t;t++)for(n=0;A>n;n++)h[n][t]+=O*m[t]*y[n][t];T=p}}}function l(e,t){var n=[];(void 0===t||null===t)&&(t=1);for(var r=0;t>r;r++)n.push(new Float32Array(e));return n}if(!(this instanceof o))throw new TypeError("Scrubber constructor cannot be called as a function.");t.call(this,i),this.maxSources=1,this.modelName="Scrubber";var d,p,h,y,m,v,A,w,g,C=this,x=[],T=0,b=0,P=0,O=0,V=u,E=1,S=.95,N=.05,B=.8,I=function(e,t){var n=t[0];v=n.length,A=n.numberOfChannels,w=n.sampleRate;for(var r=0;A>r;r++)x.push(n.getChannelData(r));g=C.audioContext.createScriptProcessor(256,0,A),g.onaudioprocess=f,g.connect(C.releaseGainNode),h=l(d,A),y=l(d,A),C.isInitialized=!0,"function"==typeof V&&V(e)};this.setSources=function(e,t){this.isInitialized=!1,V=t,s(e)},this.playPosition=n.createPsuedoParam("playPosition",0,1,0,this.audioContext),this.noMotionFade=n.createPsuedoParam("noMotionFade",!0,!1,!0,this.audioContext),this.muteOnReverse=n.createPsuedoParam("muteOnReverse",!0,!1,!0,this.audioContext),s(a)}return o.prototype=Object.create(t.prototype),o});
/*javascript-sound-models - v1.0.0 - 2014-06-05 */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library.");

define("core/Config",[],function(){function e(){}return e.ZERO=parseFloat("1e-37"),e.MAX_VOICES=8,e.NOMINAL_REFRESH_RATE=60,e.WINDOW_LENGTH=512,e}),define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/AudioContextMonkeyPatch"],function(){function e(e){void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,this.numberOfInputs=0,this.numberOfOutputs=0,this.maxSources=0,this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.modelName="Model",this.releaseGainNode.connect(this.audioContext.destination)}return e.prototype.connect=function(e,t,n){if(e instanceof AudioNode)this.releaseGainNode.connect(e,t,n);else{if(!(e.inputNode instanceof AudioNode))throw{name:"No Input Connection Exception",message:"Attempts to connect "+typeof t+" to "+typeof this,toString:function(){return this.name+": "+this.message}};this.releaseGainNode.connect(e.inputNode,t,n)}},e.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e)},e.prototype.start=function(){this.isPlaying=!0},e.prototype.stop=function(e){this.isPlaying=!1,"undefined"==typeof e&&(e=0),this.releaseGainNode.gain.cancelScheduledValues(e)},e.prototype.release=function(e,t){if(this.isPlaying){var n=.5,o=1/this.audioContext.sampleRate;"undefined"==typeof e&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),this.stop(e+t+o)}},e.prototype.play=function(){this.start(0)},e.prototype.pause=function(){this.isPlaying=!1},e.prototype.listParams=function(){var e=[];for(var t in this){var n=this[t];n&&n.hasOwnProperty("value")&&n.hasOwnProperty("minValue")&&n.hasOwnProperty("maxValue")&&e.push(n)}return e},e}),define("core/WebAudioDispatch",[],function(){function e(e,t,n){if(n){var o=n.currentTime;o>=t||.005>t-o?e():(console.log("Dispatching in ",1e3*(t-o)),window.setTimeout(function(){e()},1e3*(t-o)))}}return e}),define("core/SPAudioParam",["core/WebAudioDispatch"],function(e){function t(t,n,o,i,a,r,u,c){var s,f=1e-4,l=500,p=0;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",Object.defineProperty(this,"value",{enumerable:!0,set:function(e){if(typeof e!=typeof i)throw{name:"Incorrect value type Exception",message:"Attempt to set a "+typeof i+" parameter to a "+typeof e+" value",toString:function(){return this.name+": "+this.message}};"number"==typeof e&&(e>o?(console.log(this.name+" clamping to max"),e=o):n>e&&(console.log(this.name+" clamping to min"),e=n)),"function"==typeof r&&(e=r(e)),"function"==typeof u&&c?u(a,e,c):a?a instanceof AudioParam?a.value=e:a instanceof Array&&a.forEach(function(t){t.value=e}):window.clearInterval(s),p=e},get:function(){if(a){if(a instanceof AudioParam)return a.value;if(a instanceof Array)return a[0].value}return p}}),a&&(a instanceof AudioParam||a instanceof Array)){var d=a[0]||a;this.defaultValue=d.defaultValue,this.minValue=d.minValue,this.maxValue=d.maxValue,this.value=d.defaultValue,this.name=d.name}t&&(this.name=t),"undefined"!=typeof i&&(this.defaultValue=i,this.value=i),"undefined"!=typeof n&&(this.minValue=n),"undefined"!=typeof o&&(this.maxValue=o),this.setValueAtTime=function(t,n){if("function"==typeof r&&(t=r(t)),a)a instanceof AudioParam?a.setValueAtTime(t,n):a instanceof Array&&a.forEach(function(e){e.setValueAtTime(t,n)});else{var o=this;e(function(){o.value=t},n,c)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.setTargetAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setTargetAtTime(e,t,n)});else{var o=this,i=o.value,u=c.currentTime;s=window.setInterval(function(){c.currentTime>=t&&(o.value=e+(i-e)*Math.exp(-(c.currentTime-u)/n),Math.abs(o.value-e)<f&&window.clearInterval(s))},l)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof r)for(var o=0;o<e.length;o++)e[o]=r(e[o]);if(a)a instanceof AudioParam?a.setValueCurveAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setValueCurveAtTime(e,t,n)});else{var i=this,u=c.currentTime;s=window.setInterval(function(){if(c.currentTime>=t){var o=Math.floor(e.length*(c.currentTime-u)/n);o<e.length?i.value=e[o]:window.clearInterval(s)}},l)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.exponentialRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.exponentialRampToValueAtTime(e,t)});else{var n=this,o=n.value,i=c.currentTime;0===o&&(o=.001),s=window.setInterval(function(){var a=(c.currentTime-i)/(t-i);n.value=o*Math.pow(e/o,a),c.currentTime>=t&&window.clearInterval(s)},l)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.linearRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.linearRampToValueAtTime(e,t)});else{var n=this,o=n.value,i=c.currentTime;s=window.setInterval(function(){var a=(c.currentTime-i)/(t-i);n.value=o+(e-o)*a,c.currentTime>=t&&window.clearInterval(s)},l)}},this.cancelScheduledValues=function(e){a?a instanceof AudioParam?a.cancelScheduledValues(e):a instanceof Array&&a.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(s)}}return t.createPsuedoParam=function(e,n,o,i,a){return new t(e,n,o,i,null,null,null,a)},t}),define("core/SPPlaybackRateParam",[],function(){function e(e,t){this.defaultValue=e.defaultValue,this.maxValue=e.maxValue,this.minValue=e.minValue,this.name=e.name,this.units=e.units,Object.defineProperty(this,"value",{enumerable:!0,set:function(n){e.value=n,t.value=n},get:function(){return e.value}}),this.linearRampToValueAtTime=function(n,o){e.linearRampToValueAtTime(n,o),t.linearRampToValueAtTime(n,o)},this.exponentialRampToValueAtTime=function(n,o){e.exponentialRampToValueAtTime(n,o),t.exponentialRampToValueAtTime(n,o)},this.setValueCurveAtTime=function(n,o,i){e.setValueCurveAtTime(n,o,i),t.setValueCurveAtTime(n,o,i)},this.setTargetAtTime=function(n,o,i){e.setTargetAtTime(n,o,i),t.setTargetAtTime(n,o,i)},this.setValueAtTime=function(n,o){e.setValueAtTime(n,o),t.setValueAtTime(n,o)},this.cancelScheduledValues=function(n){e.cancelScheduledValues(n),t.cancelScheduledValues(n)}}return e}),define("core/SPAudioBufferSourceNode",["core/SPPlaybackRateParam","core/WebAudioDispatch"],function(e,t){function n(n){function o(e){for(var t=new Float32Array(e.length),o=n.createBuffer(1,e.length,44100),i=0;i<e.length;i++)t[i]=i;return o.getChannelData(0).set(t),o}function i(){u.connect(c),c.onaudioprocess=a}function a(e){var t=e.inputBuffer.getChannelData(0);s=t[t.length-1]||0}var r=n.createBufferSource(),u=n.createBufferSource(),c=n.createScriptProcessor(256,1,1),s=0;this.audioContext=n,this.channelCount=r.channelCount,this.channelCountMode=r.channelCountMode,this.channelInterpretation=r.channelInterpretation,this.numberOfInputs=r.numberOfInputs,this.numberOfOutputs=r.numberOfOutputs,this.playbackState=r.playbackState,this.playbackRate=new e(r.playbackRate,u.playbackRate),Object.defineProperty(this,"loopEnd",{enumerable:!0,set:function(e){r.loopEnd=e,u.loopEnd=e},get:function(){return r.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,set:function(e){r.loopStart=e,u.loopStart=e},get:function(){return r.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,set:function(e){r.onended=e},get:function(){return r.onended}}),Object.defineProperty(this,"loop",{enumerable:!0,set:function(e){r.loop=e,u.loop=e},get:function(){return r.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,get:function(){return s}}),Object.defineProperty(this,"buffer",{enumerable:!0,set:function(e){r.buffer=e,u.buffer=o(e)},get:function(){return r.buffer}}),this.connect=function(e,t,n){r.connect(e,t,n),c.connect(e,t,n)},this.disconnect=function(e){r.disconnect(e),c.disconnect(e)},this.start=function(e,t,n){"undefined"==typeof n&&(n=r.buffer.duration),r.start(e,t,n),u.start(e,t,n)},this.stop=function(e){var t=r.playbackState;void 0!==t&&t===r.PLAYING_STATE&&r.stop(e),t=u.playbackState,void 0!==t&&t===r.PLAYING_STATE&&u.stop(e)},this.resetBufferSource=function(o,i){var a=this;t(function(){a.disconnect(i);var t=a.audioContext.createBufferSource();t.buffer=r.buffer,t.loopStart=r.loopStart,t.loopEnd=r.loopEnd,t.onended=r.onended,r=t;var o=n.createBufferSource();o.buffer=u.buffer,o.connect(c),u=o,a.playbackRate=new e(r.playbackRate,u.playbackRate),a.connect(i)},o,this.audioContext)},i()}return n}),define("core/DetectLoopMarkers",[],function(){function e(e){var t=0,n=0,o=5e3,i=.5,a=2e4,r=.01,u=1024,c=16,s=[],f=0,l=function(e,t){for(var n=0,o=t+c;t+c+u>o;++o)n+=Math.abs(e[o]);return r>n/u},p=function(e){return function(t,n,o){var a;return a=o%2===0?n[e]>i:n[e]<-i,t&&a}},d=function(e){var i=null,r=null;t=0,n=f;for(var u=0;null===i&&f>u&&a>u;){if(e.reduce(p(u),!0)&&(1!==e.length||l(e[0],u))){i=u;break}u++}for(u=f;null===r&&u>0&&a>f-u;){if(e.reduce(p(u),!0)){r=u;break}u--}return null!==i&&null!==r&&r>i+o?(t=i+o/2,n=r-o/2,!0):!1},h=function(e){return function(t,n){return t&&Math.abs(n[e])<r}},m=function(e){var o=!0;for(t=0;a>t&&f>t&&(o=e.reduce(h(t),!0));)t++;for(n=f;a>f-n&&n>0&&(o=e.reduce(h(n),!0));)n--;t>n&&(t=0)};f=e.length;for(var y=0;y<e.numberOfChannels;y++)s.push(new Float32Array(e.getChannelData(y)));return d(s)||m(s),{start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,o,i,a){function r(){var e=Object.prototype.toString.call(n),t=/[^.]+$/.exec(n);if("[object String]"===e){var o=new XMLHttpRequest;o.open("GET",n,!0),o.responseType="arraybuffer",o.addEventListener("progress",a,!1),o.onload=function(){u(o.response,t)},o.send()}else if("[object File]"===e){var i=new FileReader;i.addEventListener("progress",a,!1),i.onload=function(){u(i.result,t)},i.readAsArrayBuffer(n)}}function u(t,a){o.decodeAudioData(t,function(t){if(l=!0,c=t,s=0,f=c.length,"wav"!==a[0]){var n=e(c);n&&(s=n.start,f=n.end)}i&&"function"==typeof i&&i(!0)},function(){console.log("Error Decoding "+n),i&&"function"==typeof i&&i(!1)})}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var c,s=0,f=0,l=!1,p=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},d=function(e,t){if("undefined"==typeof t&&(t=c.length),!p(e))throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter is not an integer",toString:function(){return this.name+": "+this.message}};if(!p(t))throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer end parameter is not an integer",toString:function(){return this.name+": "+this.message}};if(e>t)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter should be smaller than end parameter",toString:function(){return this.name+": "+this.message}};if(e>f||s>e)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter should be within the buffer size : 0-"+c.length,toString:function(){return this.name+": "+this.message}};if(t>f||s>t)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer end parameter should be within the buffer size : 0-"+c.length,toString:function(){return this.name+": "+this.message}};for(var n=t-e,i=o.createBuffer(c.numberOfChannels,n,c.sampleRate),a=0;a<c.numberOfChannels;a++){var r=new Float32Array(c.getChannelData(a));i.getChannelData(a).set(r.subarray(e,t))}return i};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=f-s),d(s+e,s+t)},this.getRawBuffer=function(){return c},this.isLoaded=function(){return l},r()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,o,i){function a(){var e=Object.prototype.toString.call(t);"[object Array]"===e?(s=t.length,t.forEach(function(e){r(e,u)})):void 0!==t&&null!==t&&(s=1,r(t,u))}function r(t,n){var o=Object.prototype.toString.call(t);if("[object String]"===o||"[object File]"===o)var a=new e(t,c.audioContext,function(e){e&&n(e,a.getBuffer())},function(e){i&&"function"==typeof i&&i(e,t)});else{if("[object AudioBuffer]"!==o)throw{name:"Incorrect Parameter type Exception",message:"Looper argument is not a URL or AudioBuffer",toString:function(){return this.name+": "+this.message}};n(!0,t)}}function u(e,t){s--,f.push(t),0===s&&o(e,f)}var c=this,s=0,f=[];a()}return t}),define("models/Looper",["core/Config","core/BaseSound","core/SPAudioParam","core/SPAudioBufferSourceNode","core/MultiFileLoader"],function(e,t,n,o,i){function a(r,u,c,s,f){function l(e){var t=Object.prototype.toString.call(e);if(y=[],d.forEach(function(e){e.disconnect()}),d=[],"[object Array]"===t&&e.length>p.maxSources)throw{name:"Unsupported number of sources",message:"This sound only supports a maximum of "+p.maxSources+" sources.",toString:function(){return this.name+": "+this.message}};"[object AudioBuffer]"===t?A(!0,[e]):i.call(p,e,p.audioContext,A,s)}if(!(this instanceof a))throw new TypeError("Looper constructor cannot be called as a function.");t.call(this,u),this.maxSources=e.MAX_VOICES,this.numberOfInputs=1,this.numberOfOutputs=1,this.modelName="Looper";var p=this,d=[],h=[],m=[],y=[],v=c,A=function(e,t){t.forEach(function(e,t){m.push(0),g(e,t)}),p.playSpeed=new n("playSpeed",0,10,1,y,null,S,p.audioContext),p.isInitialized=!0,"function"==typeof v&&v(e)},T=function(e,t,n){p.isPlaying=!1;var o=p.audioContext.currentTime;n.resetBufferSource(o,h[t]),"function"==typeof f&&f(p,t)},g=function(e,t){var i=new o(p.audioContext);i.buffer=e,i.loopEnd=e.duration,i.onended=function(e){T(e,t,i)};var a;if(h[t])a=h[t];else{a=p.audioContext.createGain(),h[t]=a;var r=new n("gain",0,1,1,a.gain,null,null,p.audioContext);p.multiTrackGain.push[t]=r}i.connect(a),a.connect(p.releaseGainNode),d.push(i),y.push(i.playbackRate)},S=function(e,t,n){if(p.isInitialized){var o=6.90776,i=d[0]?d[0].playbackRate.value:1;t>i?d.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,p.riseTime.value/o)}):i>t&&d.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,p.decayTime.value/o)})}},b=function(e,t){d.forEach(function(e){e.loopStart=t*e.buffer.duration})};this.playSpeed=null,this.riseTime=n.createPsuedoParam("riseTime",.05,10,1,this.audioContext),this.decayTime=n.createPsuedoParam("decayTime",.05,10,1,this.audioContext),this.startPoint=new n("startPoint",0,.99,0,null,null,b,this.audioContext),this.multiTrackGain=[],this.maxLoops=n.createPsuedoParam("maxLoops",-1,1,-1,this.audioContext),this.setSources=function(e,t){this.isInitialized=!1,v=t,l(e)},this.play=function(){this.isPlaying||d.forEach(function(e,t){var n=m&&m[t]?m[t]:p.startPoint.value*e.buffer.duration;e.loop=1!==p.maxLoops.value,e.start(0,n)}),t.prototype.start.call(this,0)},this.start=function(e,n,o,i){this.isPlaying||d.forEach(function(t){if(("undefined"==typeof n||null===n)&&(n=p.startPoint.value*t.buffer.duration),("undefined"==typeof o||null===o)&&(o=t.buffer.duration),t.loop=1!==p.maxLoops.value,"undefined"!=typeof i){var a=p.audioContext.currentTime;p.releaseGainNode.gain.cancelScheduledValues(a),p.releaseGainNode.gain.setValueAtTime(0,a),p.releaseGainNode.gain.linearRampToValueAtTime(1,a+i)}else p.releaseGainNode.gain.setValueAtTime(1,p.audioContext.currentTime);t.start(e,n,o)}),t.prototype.start.call(this,e,n,o)},this.stop=function(e){d.forEach(function(t,n){p.isPlaying&&t.stop(e),m[n]=0}),t.prototype.stop.call(this,e)},this.pause=function(){d.forEach(function(e,t){p.isPlaying&&e.stop(0),m[t]=e.playbackPosition/e.buffer.sampleRate}),t.prototype.stop.call(this,0)},r&&l(r)}return a.prototype=Object.create(t.prototype),a}),define("core/SoundQueue",["core/Config","models/Looper","core/FileLoader","core/WebAudioDispatch"],function(e,t,n,o){function i(n,a){function r(){d(n.currentTime+1/e.NOMINAL_REFRESH_RATE),window.requestAnimationFrame(r)}function u(){for(var e=0;a>e;e++)v[e]=new t(null,n,null,null,c),v[e].disconnect(),v[e].maxLoops.value=1,v[e].voiceIndex=e;window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,window.requestAnimationFrame(r)}function c(e){v.push(e),y.splice(y.indexOf(e),1)}function s(e){for(h=0;h<y.length;h++)if(y[h].eventID==e)return y[h];return null}function f(e){for(var t=0;t<m.length;t++){var n=m[t];n.eventID===e&&(m.splice(t,1),t--)}}function l(e,t){var o;return v.length<1?(console.warn("No free voices left. Stealing the oldest"),o=y.shift(),f(o.eventID),o.eventID=e,o.release(n.currentTime,t-n.currentTime),y.push(o)):(o=v.shift(),o.eventID=e,y.push(o)),o}function p(e){var t=s(e.eventID);"QESTART"!=e.type&&"QESETPARAM"!=e.type&&"QESETSRC"!=e.type||null!==t||(t=l(e.eventID,e.time)),t&&("QESTART"==e.type?t.start(e.time,e.offset,null,e.attackDuration):"QESETPARAM"==e.type?t[e.paramName]&&t[e.paramName].setValueAtTime(e.paramValue,e.time):"QESETSRC"==e.type?o(function(){t.setSources(e.sourceBuffer)},e.time,n):"QERELEASE"==e.type?t.release(e.time,e.releaseDuration):"QESTOP"==e.type?(t.pause(e.time),o(function(){v.push(t),y.splice(y.indexOf(t),1)},e.time,n)):console.warn("Unknown Event Type : "+e))}function d(e){for(var t=0;t<m.length;t++){var n=m[t];n.time<=e&&(p(n),m.splice(t,1),t--)}}if(!(this instanceof i))throw new TypeError("SoundQueue constructor cannot be called as a function.");"undefined"==typeof a&&(a=e.MAX_VOICES);var h,m=[],y=[],v=[];this.queueStart=function(e,t,n,o){m.push({type:"QESTART",time:e,eventID:t,offset:n,attackDuration:o})},this.queueRelease=function(e,t,n){m.push({type:"QERELEASE",time:e,eventID:t,releaseDuration:n})},this.queueStop=function(e,t){m.push({type:"QESTOP",time:e,eventID:t})},this.queueSetParameter=function(e,t,n,o){m.push({type:"QESETPARAM",time:e,eventID:t,paramName:n,paramValue:o})},this.queueSetSource=function(e,t,n){m.push({type:"QESETSRC",time:e,eventID:t,sourceBuffer:n})},this.queueUpdate=function(e,t,n,o){for(var i=0;i<m.length;i++){var a=m[i];a.type!==e||t&&a.eventID!=t||a.hasOwnProperty(n)&&(a[n]=o)}},this.pause=function(){this.stop(0)},this.stop=function(e){d(e),m=[],y.forEach(function(t){t.release(e)}),v.forEach(function(t){t.stop(e)})},this.connect=function(e,t,n){v.forEach(function(o){o.connect(e,t,n)}),y.forEach(function(o){o.connect(e,t,n)})},this.disconnect=function(e){v.forEach(function(t){t.disconnect(e)}),y.forEach(function(t){t.disconnect(e)})},u()}return i}),define("core/Converter",[],function(){function e(){}return e.semitonesToRatio=function(e){return Math.pow(2,e/12)},e}),define("models/Trigger",["core/Config","core/BaseSound","core/SoundQueue","core/SPAudioParam","core/MultiFileLoader","core/Converter"],function(e,t,n,o,i,a){function r(u,c,s,f){function l(e){i.call(h,e,h.audioContext,T,f),d=e}if(!(this instanceof r))throw new TypeError("Trigger constructor cannot be called as a function.");t.call(this,c),this.maxSources=e.MAX_VOICES,this.numberOfInputs=1,this.numberOfOutputs=1,this.modelName="Trigger";var p,d,h=this,m=[],y=0,v=0,A=s,T=function(e,t){m=t,p.connect(h.releaseGainNode),h.isInitialized=!0,"function"==typeof A&&A(e)};this.pitchShift=o.createPsuedoParam("pitchShift",-60,60,0,this.audioContext),this.pitchRand=o.createPsuedoParam("pitchRand",0,24,0,this.audioContext),this.eventRand=o.createPsuedoParam("eventRand",!0,!1,!1,this.audioContext),this.setSources=function(e,t){this.isInitialized=!1,A=t,l(e)},this.stop=function(e){p.stop(e)},this.pause=function(){p.pause()},this.play=function(){this.start(0)},this.start=function(e){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime);var n=1;"[object Array]"===Object.prototype.toString.call(d)&&(n=d.length),v=this.eventRand.value?n>2?(v+1+Math.floor(Math.random()*(n-1)))%n:Math.floor(Math.random()*(n-1)):(v+1)%n;var o=e,i=a.semitonesToRatio(this.pitchShift.value+Math.random()*this.pitchRand.value);p.queueSetSource(o,y,m[v]),p.queueSetParameter(o,y,"playSpeed",i),p.queueStart(o,y),y++,t.prototype.start.call(this,e)},p=new n(this.audioContext),u&&l(u)}return r.prototype=Object.create(t.prototype),r});
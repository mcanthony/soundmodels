/*javascript-sound-models - v0.4.0 - 2014-05-23 */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library.");

define("core/Config",[],function(){function e(){}return e.MAX_VOICES=8,e.NOMINAL_REFRESH_RATE=60,e.WINDOW_LENGTH=512,e}),define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/AudioContextMonkeyPatch"],function(){function e(e){void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,this.numberOfInputs=0,this.numberOfOutputs=0,this.maxSources=0,this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.modelName="Model",this.releaseGainNode.connect(this.audioContext.destination)}return e.prototype.connect=function(e,t,n){if(e instanceof AudioNode)this.releaseGainNode.connect(e,t,n);else{if(!(e.inputNode instanceof AudioNode))throw{name:"No Input Connection Exception",message:"Attempts to connect "+typeof t+" to "+typeof this,toString:function(){return this.name+": "+this.message}};this.releaseGainNode.connect(e.inputNode,t,n)}},e.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e)},e.prototype.start=function(){this.isPlaying=!0},e.prototype.stop=function(e){this.isPlaying=!1,"undefined"==typeof e&&(e=0),this.releaseGainNode.gain.cancelScheduledValues(e)},e.prototype.release=function(e,t){if(this.isPlaying){var n=.5,o=1/this.audioContext.sampleRate;"undefined"==typeof e&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),this.stop(e+t+o)}},e.prototype.play=function(){this.start(0)},e.prototype.pause=function(){this.isPlaying=!1},e.prototype.listParams=function(){var e=[];for(var t in this){var n=this[t];n&&n.hasOwnProperty("value")&&n.hasOwnProperty("minValue")&&n.hasOwnProperty("maxValue")&&e.push(n)}return e},e}),define("core/SPAudioParam",[],function(){function e(e,t,n,o,i,a,r,u){var s,c=1e-4,l=500,f=0;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",Object.defineProperty(this,"value",{enumerable:!0,set:function(e){if(typeof e!=typeof o)throw{name:"Incorrect value type Exception",message:"Attempt to set a "+typeof o+" parameter to a "+typeof e+" value",toString:function(){return this.name+": "+this.message}};"number"==typeof e&&(e>n?(console.log(this.name+" clamping to max"),e=n):t>e&&(console.log(this.name+" clamping to min"),e=t)),"function"==typeof a&&(e=a(e)),"function"==typeof r&&u?r(i,e,u):i?i instanceof AudioParam?i.value=e:i instanceof Array&&i.forEach(function(t){t.value=e}):window.clearInterval(s),f=e},get:function(){if(i){if(i instanceof AudioParam)return i.value;if(i instanceof Array)return i[0].value}return f}}),i&&(i instanceof AudioParam||i instanceof Array)){var p=i[0]||i;this.defaultValue=p.defaultValue,this.minValue=p.minValue,this.maxValue=p.maxValue,this.value=p.defaultValue,this.name=p.name}e&&(this.name=e),"undefined"!=typeof o&&(this.defaultValue=o,this.value=o),"undefined"!=typeof t&&(this.minValue=t),"undefined"!=typeof n&&(this.maxValue=n),this.setValueAtTime=function(e,t){if("function"==typeof a&&(e=a(e)),i)i instanceof AudioParam?i.setValueAtTime(e,t):i instanceof Array&&i.forEach(function(n){n.setValueAtTime(e,t)});else{var n=this,o=t-u.currentTime;window.setTimeout(function(){n.value=e},1e3*o)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof a&&(e=a(e)),i)i instanceof AudioParam?i.setTargetAtTime(e,t,n):i instanceof Array&&i.forEach(function(o){o.setTargetAtTime(e,t,n)});else{var o=this,r=o.value,f=u.currentTime;s=window.setInterval(function(){u.currentTime>=t&&(o.value=e+(r-e)*Math.exp(-(u.currentTime-f)/n),Math.abs(o.value-e)<c&&window.clearInterval(s))},l)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof a)for(var o=0;o<e.length;o++)e[o]=a(e[o]);if(i)i instanceof AudioParam?i.setValueCurveAtTime(e,t,n):i instanceof Array&&i.forEach(function(o){o.setValueCurveAtTime(e,t,n)});else{var r=this,c=u.currentTime;s=window.setInterval(function(){if(u.currentTime>=t){var o=Math.floor(e.length*(u.currentTime-c)/n);o<e.length?r.value=e[o]:window.clearInterval(s)}},l)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof a&&(e=a(e)),i)i instanceof AudioParam?i.exponentialRampToValueAtTime(e,t):i instanceof Array&&i.forEach(function(n){n.exponentialRampToValueAtTime(e,t)});else{var n=this,o=n.value,r=u.currentTime;0===o&&(o=.001),s=window.setInterval(function(){var i=(u.currentTime-r)/(t-r);n.value=o*Math.pow(e/o,i),u.currentTime>=t&&window.clearInterval(s)},l)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof a&&(e=a(e)),i)i instanceof AudioParam?i.linearRampToValueAtTime(e,t):i instanceof Array&&i.forEach(function(n){n.linearRampToValueAtTime(e,t)});else{var n=this,o=n.value,r=u.currentTime;s=window.setInterval(function(){var i=(u.currentTime-r)/(t-r);n.value=o+(e-o)*i,u.currentTime>=t&&window.clearInterval(s)},l)}},this.cancelScheduledValues=function(e){i?i instanceof AudioParam?i.cancelScheduledValues(e):i instanceof Array&&i.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(s)}}return e.createPsuedoParam=function(t,n,o,i,a){return new e(t,n,o,i,null,null,null,a)},e}),define("core/SPPlaybackRateParam",[],function(){function e(e,t){this.defaultValue=e.defaultValue,this.maxValue=e.maxValue,this.minValue=e.minValue,this.name=e.name,this.units=e.units,Object.defineProperty(this,"value",{enumerable:!0,set:function(n){e.value=n,t.value=n},get:function(){return e.value}}),this.linearRampToValueAtTime=function(n,o){e.linearRampToValueAtTime(n,o),t.linearRampToValueAtTime(n,o)},this.exponentialRampToValueAtTime=function(n,o){e.exponentialRampToValueAtTime(n,o),t.exponentialRampToValueAtTime(n,o)},this.setValueCurveAtTime=function(n,o,i){e.setValueCurveAtTime(n,o,i),t.setValueCurveAtTime(n,o,i)},this.setTargetAtTime=function(n,o,i){e.setTargetAtTime(n,o,i),t.setTargetAtTime(n,o,i)},this.setValueAtTime=function(n,o){e.setValueAtTime(n,o),t.setValueAtTime(n,o)},this.cancelScheduledValues=function(n){e.cancelScheduledValues(n),t.cancelScheduledValues(n)}}return e}),define("core/SPAudioBufferSourceNode",["core/SPPlaybackRateParam"],function(e){function t(t){function n(e){for(var n=new Float32Array(e.length),o=t.createBuffer(1,e.length,44100),i=0;i<e.length;i++)n[i]=i;return o.getChannelData(0).set(n),o}function o(){r.connect(u),u.onaudioprocess=i}function i(e){var t=e.inputBuffer.getChannelData(0);s=t[t.length-1]||0}var a=t.createBufferSource(),r=t.createBufferSource(),u=t.createScriptProcessor(256,1,0),s=0;this.channelCount=a.channelCount,this.channelCountMode=a.channelCountMode,this.channelInterpretation=a.channelInterpretation,this.numberOfInputs=a.numberOfInputs,this.numberOfOutputs=a.numberOfOutputs,this.playbackState=a.playbackState,this.playbackRate=new e(a.playbackRate,r.playbackRate),Object.defineProperty(this,"loopEnd",{enumerable:!0,set:function(e){a.loopEnd=e,r.loopEnd=e},get:function(){return a.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,set:function(e){a.loopStart=e,r.loopStart=e},get:function(){return a.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,set:function(e){a.onended=e},get:function(){return a.onended}}),Object.defineProperty(this,"loop",{enumerable:!0,set:function(e){a.loop=e,r.loop=e},get:function(){return a.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,get:function(){return s}}),Object.defineProperty(this,"buffer",{enumerable:!0,set:function(e){a.buffer=e,r.buffer=n(e)},get:function(){return a.buffer}}),this.connect=function(e,t,n){a.connect(e,t,n),u.connect(e,t,n)},this.disconnect=function(e){a.disconnect(e),u.disconnect(e)},this.start=function(e,t,n){"undefined"==typeof n&&(n=a.buffer.duration),a.start(e,t,n),r.start(e,t,n)},this.stop=function(e){a.stop(e),r.stop(e)},o()}return t}),define("core/DetectLoopMarkers",[],function(){function e(e){var t=0,n=0,o=5e3,i=.5,a=2e4,r=.01,u=1024,s=16,c=[],l=0,f=function(e,t){for(var n=0,o=t+s;t+s+u>o;++o)n+=Math.abs(e[o]);return r>n/u},p=function(e){return function(t,n,o){var a;return a=o%2===0?n[e]>i:n[e]<-i,t&&a}},d=function(e){var i=null,r=null;t=0,n=l;for(var u=0;null===i&&l>u&&a>u;){if(e.reduce(p(u),!0)&&(1!==e.length||f(e[0],u))){i=u;break}u++}for(u=l;null===r&&u>0&&a>l-u;){if(e.reduce(p(u),!0)){r=u;break}u--}return null!==i&&null!==r&&r>i+o?(t=i+o/2,n=r-o/2,!0):!1},h=function(e){return function(t,n){return t&&Math.abs(n[e])<r}},m=function(e){var o=!0;for(t=0;a>t&&l>t&&(o=e.reduce(h(t),!0));)t++;for(n=l;a>l-n&&n>0&&(o=e.reduce(h(n),!0));)n--;t>n&&(t=0)};l=e.length;for(var y=0;y<e.numberOfChannels;y++)c.push(new Float32Array(e.getChannelData(y)));return d(c)||m(c),{start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,o,i,a){function r(){var e=Object.prototype.toString.call(n),t=/[^.]+$/.exec(n);if("[object String]"===e){var o=new XMLHttpRequest;o.open("GET",n,!0),o.responseType="arraybuffer",o.addEventListener("progress",a,!1),o.onload=function(){u(o.response,t)},o.send()}else if("[object File]"===e){var i=new FileReader;i.addEventListener("progress",a,!1),i.onload=function(){u(i.result,t)},i.readAsArrayBuffer(n)}}function u(t,a){o.decodeAudioData(t,function(t){if(f=!0,s=t,c=0,l=s.length,"wav"!==a[0]){var n=e(s);n&&(c=n.start,l=n.end)}i&&"function"==typeof i&&i(!0)},function(){console.log("Error Decoding "+n),i&&"function"==typeof i&&i(!1)})}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var s,c=0,l=0,f=!1,p=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},d=function(e,t){if("undefined"==typeof t&&(t=s.length),!p(e))throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter is not an integer",toString:function(){return this.name+": "+this.message}};if(!p(t))throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer end parameter is not an integer",toString:function(){return this.name+": "+this.message}};if(e>t)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter should be smaller than end parameter",toString:function(){return this.name+": "+this.message}};if(e>l||c>e)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter should be within the buffer size : 0-"+s.length,toString:function(){return this.name+": "+this.message}};if(t>l||c>t)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer end parameter should be within the buffer size : 0-"+s.length,toString:function(){return this.name+": "+this.message}};for(var n=t-e,i=o.createBuffer(s.numberOfChannels,n,s.sampleRate),a=0;a<s.numberOfChannels;a++){var r=new Float32Array(s.getChannelData(a));i.getChannelData(a).set(r.subarray(e,t))}return i};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=l-c),d(c+e,c+t)},this.getRawBuffer=function(){return s},this.isLoaded=function(){return f},r()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,o,i){function a(){var e=Object.prototype.toString.call(t);"[object Array]"===e?(c=t.length,t.forEach(function(e){r(e,u)})):void 0!==t&&null!==t&&(c=1,r(t,u))}function r(t,n){var o=Object.prototype.toString.call(t);if("[object String]"===o||"[object File]"===o)var a=new e(t,s.audioContext,function(e){e&&n(e,a.getBuffer())},function(e){i&&"function"==typeof i&&i(e,t)});else{if("[object AudioBuffer]"!==o)throw{name:"Incorrect Parameter type Exception",message:"Looper argument is not a URL or AudioBuffer",toString:function(){return this.name+": "+this.message}};n(!0,t)}}function u(e,t){c--,l.push(t),0===c&&o(e,l)}var s=this,c=0,l=[];a()}return t}),define("models/Looper",["core/Config","core/BaseSound","core/SPAudioParam","core/SPAudioBufferSourceNode","core/MultiFileLoader"],function(e,t,n,o,i){function a(r,u,s,c,l){function f(e){var t=Object.prototype.toString.call(e);if("[object Array]"===t&&e.length>p.maxSources)throw{name:"Unsupported number of sources",message:"This sound only supports a maximum of "+p.maxSources+" sources.",toString:function(){return this.name+": "+this.message}};y=[],d=[],h=[],p.multiTrackGain=[],i.call(p,e,p.audioContext,g,c)}if(!(this instanceof a))throw new TypeError("Looper constructor cannot be called as a function.");t.call(this,u),this.maxSources=e.MAX_VOICES,this.numberOfInputs=1,this.numberOfOutputs=1,this.modelName="Looper";var p=this,d=[],h=[],m=[],y=[],v=s,g=function(e,t){t.forEach(function(e,t){m.push(0),T(e,t)}),p.playSpeed=new n("playSpeed",0,10,1,y,null,S,p.audioContext),p.isInitialized=!0,"function"==typeof v&&v(e)},A=function(e,t){p.isPlaying=!1,"function"==typeof l&&l(p,t)},T=function(e,t){var i=new o(p.audioContext),a=p.audioContext.createGain();i.buffer=e,i.loopEnd=e.duration,i.onended=function(e){A(e,t)},i.connect(a),a.connect(p.releaseGainNode);var r=new n("gainNode",0,1,1,a.gain,null,null,p.audioContext);d.push(i),h.push(a),p.multiTrackGain.push(r),y.push(i.playbackRate)},S=function(e,t,n){if(p.isInitialized){var o=6.90776,i=d[0]?d[0].playbackRate.value:1;t>i?d.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,p.riseTime.value/o)}):i>t&&d.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,p.decayTime.value/o)})}},w=function(e,t){d.forEach(function(e){e.loopStart=t*e.buffer.duration})};this.riseTime=n.createPsuedoParam("riseTime",.05,10,1,this.audioContext),this.decayTime=n.createPsuedoParam("decayTime",.05,10,1,this.audioContext),this.startPoint=new n("startPoint",0,.99,0,null,null,w,this.audioContext),this.playSpeed=null,this.multiTrackGain=[],this.maxLoops=n.createPsuedoParam("maxLoops",-1,1,-1,this.audioContext),this.setSources=function(e,t){this.isInitialized=!1,v=t,f(e)},this.play=function(){this.isPlaying||d.forEach(function(e,t){var n=m&&m[t]?m[t]:p.startPoint.value*e.buffer.duration;e.loop=1!==p.maxLoops.value,e.start(0,n)}),t.prototype.start.call(this,0)},this.start=function(e,n,o,i){this.isPlaying||d.forEach(function(t){if(("undefined"==typeof n||null===n)&&(n=p.startPoint.value*t.buffer.duration),("undefined"==typeof o||null===o)&&(o=t.buffer.duration),t.loop=1!==p.maxLoops.value,"undefined"!=typeof i){var a=p.audioContext.currentTime;p.releaseGainNode.gain.cancelScheduledValues(a),p.releaseGainNode.gain.setValueAtTime(0,a),p.releaseGainNode.gain.linearRampToValueAtTime(1,a+i)}else p.releaseGainNode.gain.setValueAtTime(1,p.audioContext.currentTime);t.start(e,n,o)}),t.prototype.start.call(this,e,n,o)},this.stop=function(e){this.isPlaying&&(d=d.map(function(t,n){t.stop(e),m[n]=0;var i=new o(p.audioContext);return i.buffer=t.buffer,i.loopStart=i.buffer.duration*p.startPoint.value,i.loopEnd=i.buffer.duration,i.connect(h[n]),i.onended=function(e){A(e,n)},i})),t.prototype.stop.call(this,e)},this.pause=function(){this.isPlaying&&(d=d.map(function(e,t){e.stop(0),m[t]=e.playbackPosition/e.buffer.sampleRate,e.disconnect();var n=new o(p.audioContext);return n.buffer=e.buffer,n.loopStart=n.buffer.duration*p.startPoint.value,n.loopEnd=n.buffer.duration,n.connect(h[t]),n.onended=function(e){A(e,t)},n})),t.prototype.stop.call(this,0)},r&&f(r)}return a.prototype=Object.create(t.prototype),a}),define("core/SPEvent",[],function(){function e(t,n,o,i,a,r){if(!(this instanceof e))throw new TypeError("SPEvents constructor cannot be called as a function.");var u=["QENONE","QESTOP","QESTART","QESETPARAM","QESETSRC","QERELEASE"];if("undefined"==typeof n||0>n)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent argument timeStamp is not a positive number",toString:function(){return this.name+": "+this.message}};if("undefined"==typeof o||0>o)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent argument eventID is not a positive number",toString:function(){return this.name+": "+this.message}};if(void 0!==i&&null!==i&&void 0!==r)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent can either have Parameter Information or AudioBuffer defined ",toString:function(){return this.name+": "+this.message}};if(u.indexOf(t)<0)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent has unknown type",toString:function(){return this.name+": "+this.message}};this.type=t,this.time=n,this.eventID=o,this.paramName=i,this.paramValue=a,this.audioBuffer=r}return e}),define("core/SoundQueue",["core/Config","models/Looper","core/FileLoader","core/SPEvent"],function(e,t,n,o){function i(n,a){function r(){d(n.currentTime+1/e.NOMINAL_REFRESH_RATE),window.requestAnimationFrame(r)}function u(){for(var e=0;a>e;e++)v[e]=new t(null,n,null,null,s),v[e].disconnect(),v[e].maxLoops.value=1;window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,window.requestAnimationFrame(r)}function s(e){v.push(e),y.splice(y.indexOf(e),1)}function c(e){for(h=0;h<y.length;h++)if(y[h].eventID==e)return y[h];return null}function l(e){for(var t=0;t<m.length;t++){var n=m[t];n.eventID===e&&(m.splice(t,1),t--)}}function f(e,t){var o;return v.length<1?(console.warn("No free voices left. Stealing the oldest"),o=y.shift(),l(o.eventID),o.eventID=e,o.release(n.currentTime,t-n.currentTime),y.push(o)):(o=v.shift(),o.eventID=e,y.push(o)),o}function p(e){var t=c(e.eventID);if("QESTART"!=e.type&&"QESETPARAM"!=e.type&&"QESETSRC"!=e.type||null!==t||(t=f(e.eventID,e.time)),t)if("QESTART"==e.type)t.start(e.time,null,null,e.paramValue);else if("QESETPARAM"==e.type)t[e.paramName]&&t[e.paramName].setValueAtTime(e.paramValue,e.time);else if("QESETSRC"==e.type){var o=function(e,t){e.setSources(t.audioBuffer)};window.setTimeout(o(t,e),e.time-n.currentTime)}else if("QERELEASE"==e.type)t.release(e.time,e.paramValue);else if("QESTOP"==e.type){var i=function(e){v.push(e),y.splice(y.indexOf(e),1)};t.pause(e.time),window.setTimeout(i(t),e.time-n.currentTime)}else console.warn("Unknown Event Type : "+e)}function d(e){for(var t=0;t<m.length;t++){var n=m[t];n.time<=e&&(p(n),m.splice(t,1),t--)}}if(!(this instanceof i))throw new TypeError("SoundQueue constructor cannot be called as a function.");"undefined"==typeof a&&(a=e.MAX_VOICES);var h,m=[],y=[],v=[];this.queueStart=function(e,t,n){m.push(new o("QESTART",e,t,"attackDur",n))},this.queueRelease=function(e,t,n){m.push(new o("QERELEASE",e,t,"releaseDur",n))},this.queueStop=function(e,t){m.push(new o("QESTOP",e,t))},this.queueSetParameter=function(e,t,n,i){m.push(new o("QESETPARAM",e,t,n,i))},this.queueSetSource=function(e,t,n){m.push(new o("QESETSRC",e,t,null,null,n))},this.queueUpdate=function(e,t,n,o){for(var i=0;i<m.length;i++){var a=m[i];a.type!==e||t&&a.eventID!=t||a.paramName===n&&(a.paramValue=o)}},this.connect=function(e,t,n){v.forEach(function(o){o.connect(e,t,n)}),y.forEach(function(o){o.connect(e,t,n)})},this.disconnect=function(e){v.forEach(function(t){t.disconnect(e)}),y.forEach(function(t){t.disconnect(e)})},u()}return i}),define("core/Converter",[],function(){function e(){}return e.semitonesToRatio=function(e){return Math.pow(2,e/12)},e}),define("models/MultiTrigger",["core/Config","core/BaseSound","core/SoundQueue","core/SPAudioParam","core/MultiFileLoader","core/Converter"],function(e,t,n,o,i,a){function r(u,s,c,l){function f(e){i.call(y,e,y.audioContext,E,l)}function p(e){if(S>=y.maxSources-2){var t=S-(y.maxSources-2),n=e-g;v.queueRelease(e,t,n)}var o=T.length;w=y.eventRand.value?o>2?(w+1+Math.floor(Math.random()*(o-1)))%o:Math.floor(Math.random()*(o-1)):(w+1)%o;var i=e,r=a.semitonesToRatio(y.pitchShift.value+Math.random()*y.pitchRand.value);v.queueSetSource(i,S,T[w]),v.queueSetParameter(i,S,"playSpeed",r),v.queueStart(i,S),S++}function d(){for(var t=s.currentTime,n=t+1/e.NOMINAL_REFRESH_RATE;n>g+A;){var o=Math.max(t,g+A);p(o),g=o,A=h(y.eventRate.value)}y.isPlaying&&window.requestAnimationFrame(d)}function h(e){var t=1/e,n=Math.random()-.5,o=1+2*y.eventJitter.value*n,i=t*o;if(isFinite(i)){var a=Math.max(.99*t*(1-y.eventJitter.value),.01);v.queueUpdate("QERELEASE",null,"releaseDur",a)}else i=31536e3;return i}function m(e,t){0===t?y.isPlaying&&y.pause():(!y.isPlaying&&y.isInitialized&&y.play(),y.isInitialized&&(A=h(t)))}if(!(this instanceof r))throw new TypeError("MultiTrigger constructor cannot be called as a function.");t.call(this,s);var y=this;this.maxSources=e.MAX_VOICES,this.numberOfInputs=1,this.numberOfOutputs=1,this.modelName="MultiTrigger";var v,g=0,A=0,T=[],S=0,w=0,x=c,E=function(e,t){T=t,A=h(y.eventRate.value),v.connect(y.releaseGainNode),y.isInitialized=!0,"function"==typeof x&&x(e)};this.pitchShift=o.createPsuedoParam("pitchShift",-60,60,0,this.audioContext),this.pitchRand=o.createPsuedoParam("pitchRand",0,24,0,this.audioContext),this.eventRand=o.createPsuedoParam("eventRand",!0,!1,!1,this.audioContext),this.eventRate=new o("eventRate",0,60,10,null,null,m,this.audioContext),this.eventJitter=o.createPsuedoParam("eventJitter",0,.99,0,this.audioContext),this.play=function(){t.prototype.start.call(this,0),d()},this.setSources=function(e,t){this.isInitialized=!1,x=t,f(e)},v=new n(this.audioContext),u&&f(u)}return r.prototype=Object.create(t.prototype),r});
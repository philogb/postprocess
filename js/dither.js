PhiloGL.unpack();

window.addEventListener('load', function() {
  var $ = function(d) { return document.getElementById(d); },
      section = document.querySelector('div.main'),
      args = document.querySelector('div.arguments'),
      video = args.querySelector('video'),
      playing = false,
      log = $('log');

  //check support
  if (!PhiloGL.hasWebGL()) {
    log.innerHTML = '<p class=\'error\'>Your browser doesn\'t seem to support WebGL. More info <a href=\'http://get.webgl.org/\'>here</a>.</p>';
    return;
  }

  PhiloGL('webgl-canvas', {
    program: {
      from: 'uris',
      path: 'shaders/',
      vs: 'simple2.vs',
      fs: 'dither.fs'
    },
    onError: function(e) {
      throw e;
    },
    onLoad: function(app) {
      var gl = app.gl,
          program = app.program,
          canvas = app.canvas;

      //try adding video input, if not fallback to image
      var useVideo = setupCamera();
      render();


      function setupCamera(callback) {
        var getUserMediaKey = ['getUserMedia', 'webkitGetUserMedia', 'mozGetUserMedia'],
        urlKey = ['URL', 'webkitURL', 'mozURL'],
        found = false,
        videoHandler  = function(localMediaStream) {
          video.src = window[urlKey[i]].createObjectURL(localMediaStream);
          video.play();
          setTimeout(function() {
            setupDimensions();
            playing = true;
          }, 1000);
        },
        videoHandler2 = function(stream) {
          video.src = stream;
          video.play();
          setTimeout(function() {
            setupDimensions();
            playing = true;
          }, 1000);
        },
        errorHandler  = function() {
          log.innerHTML = 'An error occurred while loading the camera. Please refresh and try again.';
        },
        key;

        for (var i = 0, l = getUserMediaKey.length; i < l; ++i) {
          key = getUserMediaKey[i];
          if (key in navigator) {
            if (i > 0) {
              navigator[key]({ video: true }, videoHandler,  errorHandler);
            } else {
              navigator[key]({ video: true }, videoHandler2, errorHandler);
            }
            found = true;
            break;
          }
        }

        return found;
      }

      function setupDimensions() {
        video.style.display = '';
        canvas.width = video.offsetWidth;
        canvas.height = video.offsetHeight;
        section.style.width = canvas.style.width = video.style.width = canvas.width + 'px';
        section.style.height = canvas.style.height = video.style.height = canvas.height + 'px';
      }


      function render() {
        if (playing) {
          program.setTexture('video', {
            parameters: [{
              name: gl.TEXTURE_MAG_FILTER,
              value: gl.NEAREST
            }, {
              name: gl.TEXTURE_MIN_FILTER,
              value: gl.NEAREST
            }, {
              name: gl.TEXTURE_WRAP_S,
              value: gl.CLAMP_TO_EDGE
            }, {
              name: gl.TEXTURE_WRAP_T,
              value: gl.CLAMP_TO_EDGE
            }],
            data: {
              value: video
            }
          });
          Media.Image.postProcess({
            fromTexture: 'video',
            toScreen: true,
            aspectRatio: 1,
            uniforms: {
              width: canvas.width,
              height: canvas.height
            }
          });
        }

        Fx.requestAnimationFrame(render);
      }
    }
  });


});

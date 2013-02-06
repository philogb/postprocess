PhiloGL.unpack();

window.addEventListener('load', function() {
  var $ = function(d) { return document.getElementById(d); },
      section = document.querySelector('div.main'),
      args = document.querySelector('div.arguments'),
      video = args.querySelector('video'),
      playing = false,
      log = $('log');

  //algorithm arguments
  var K = 10,
      gamma = 5,
      matrixPos = (function() {
        var ans = Array(K * K);
        for (var i = 0; i < K; ++i) {
          for (var j = 0; j < K; ++j) {
            ans[i * K + j] = [i, j];
          }
        }
        return ans;
      })();

  //check support
  if (!PhiloGL.hasWebGL()) {
    log.innerHTML = '<p class=\'error\'>Your browser doesn\'t seem to support WebGL. More info <a href=\'http://get.webgl.org/\'>here</a>.</p>';
    return;
  }

  PhiloGL('webgl-canvas', {
    program: [{
      id: 'grayscale',
      from: 'uris',
      path: 'shaders/',
      vs: 'simple2.vs',
      fs: 'grayscale.fs',
      noCache: true
    }, {
      id: 'dots',
      from: 'uris',
      path: 'shaders/',
      vs: 'dots.vs',
      fs: 'dots.fs',
      noCache: true
    }],
    onError: function(e) {
      throw e;
    },
    onLoad: function(app) {
      var gl = app.gl,
          program = app.program,
          canvas = app.canvas,
          dots = new O3D.Model({
            program: 'dots',
            render: function(gl, program, camera) {
              gl.lineWidth(1);
              gl.drawArrays(gl.LINE_LOOP, 0, this.dotsLength);
              this.dynamic = true;
            }
          }),
          scene = app.scene,
          width, height, pixels;

      scene.add(dots);

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
        width = canvas.width = video.offsetWidth;
        height = canvas.height = video.offsetHeight;
        section.style.width = canvas.style.width = video.style.width = width + 'px';
        section.style.height = canvas.style.height = video.style.height = height + 'px';
        pixels = new Uint8Array(width * height * 4);
        dots.uniforms.width = width;
        dots.uniforms.height = height;
      }

      function render() {
        var vertices;

        if (playing) {
          app.setTexture('video', {
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
            program: 'grayscale',
            uniforms: {
              width: canvas.width,
              height: canvas.height
            }
          });

          gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          gl.clear(gl.COLOR_BUFFER_BIT);

          //render vertices
          vertices = managePixels(pixels);
          dots.attributes.dots = {
            attribute: 'dots',
            size: 2,
            value: new Float32Array(vertices)
          };
          dots.dotsLength = vertices.length / 2;
          scene.render();
        }

        Fx.requestAnimationFrame(render);
      }

      function managePixels(pixels) {
        var w = width,
            h = height,
            wk = w / K >> 0,
            hk = h / K >> 0,
            points = [],
            i, j;

        for (i = 0; i < hk; ++i) {
          for (j = 0; j < wk; ++j) {
            points.push.apply(points, getCities(pixels, i, j));
          }
        }

        return points;
      }


      function getCities(pixels, i, j) {
        var ifrom = i * K,
            jfrom = j * K,
            rnd = Math.random,
            mu = 0, n, m, gij, ans, elem, r;

        //calculate average mu
        for (n = 0; n < K; ++n) {
          for (m = 0; m < K; ++m) {
            mu += getPixel(pixels, ifrom + n, jfrom + m);
          }
        }
        mu /= (K * K * 255);

        //generate random points in grid
        gij = gamma - (((gamma + 1) * mu) >>> 0);
        //add correction
        gij = (gij * gij / 3) >>> 0;
        ans = Array(gij * 2);
        m = matrixPos.slice();

        for (n = 0; n < gij; ++n) {
          r = (n + rnd() * (m.length - 1 - n)) >>> 0;
          elem =  m[r];
          m[r] = m[n];
          m[n] = elem;
          ans[n * 2 + 1] = ifrom + elem[0];
          ans[n * 2 + 0] = jfrom + elem[1];
        }

        return ans;
      }

      function getPixel(pixels, i, j) {
        return pixels[(i * width + j) * 4];
      }
    }
  });


});


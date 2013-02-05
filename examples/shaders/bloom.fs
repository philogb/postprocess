#ifdef GL_ES
precision highp float;
#endif

uniform float width;
uniform float height;
uniform float blurX;
uniform float blurY;
uniform sampler2D sampler0;

void main() {
  vec4 sum = vec4(0.0);
  vec2 dim = vec2(width, height);
  vec2 blurSize = vec2(blurX, blurY) / dim;
  vec2 p = gl_FragCoord.xy / dim;

  if (blurX == 0. && blurY == 0.) {
    gl_FragColor = texture2D(sampler0, p);
    return;
  }

  sum += texture2D(sampler0, p - 4.0 * blurSize) * 0.05;
  sum += texture2D(sampler0, p - 3.0 * blurSize) * 0.09;
  sum += texture2D(sampler0, p - 2.0 * blurSize) * 0.12;
  sum += texture2D(sampler0, p - 1.0 * blurSize) * 0.15;
  sum += texture2D(sampler0, p                 ) * 0.16;
  sum += texture2D(sampler0, p + 1.0 * blurSize) * 0.15;
  sum += texture2D(sampler0, p + 2.0 * blurSize) * 0.12;
  sum += texture2D(sampler0, p + 3.0 * blurSize) * 0.09;
  sum += texture2D(sampler0, p + 4.0 * blurSize) * 0.05;

  gl_FragColor = sum;
}

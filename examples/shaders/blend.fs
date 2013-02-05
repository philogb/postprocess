#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D sampler0;
uniform sampler2D sampler1;
uniform float width;
uniform float height;
uniform int useBlending;

void main() {
  float exposure = 1.5;
  vec2 dim = vec2(width, height);
  vec2 p = vec2(gl_FragCoord.x, height - gl_FragCoord.y) / dim;
  vec4 blur = texture2D(sampler0, p);
  vec4 original = texture2D(sampler1, p);

  if (useBlending == 0) {
    gl_FragColor = vec4(blur.xyz, 1);
    return;
  }

  vec4 color = mix(original, blur, 0.5);
  p -= 0.5;
  float vignette = 1. - dot(p, p);
  color = color * vignette * vignette * vignette * vignette;
  color *= exposure;
  gl_FragColor = pow(color, vec4(0.55));
}



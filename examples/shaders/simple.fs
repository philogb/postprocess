#ifdef GL_ES
precision highp float;
#endif

uniform float size;

void main(void) {
  vec2 colors = gl_FragCoord.xy / size;
  gl_FragColor = vec4(colors.xy, 1, 1);
}

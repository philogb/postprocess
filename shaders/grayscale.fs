#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D sampler1;
uniform float width;
uniform float height;

varying vec2 vTexCoord1;

void main(void) {
  vec4 pixel = texture2D(sampler1, vTexCoord1);
  gl_FragColor = vec4(vec3((pixel.x + pixel.y + pixel.z) / 3.), 1);
}



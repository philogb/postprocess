#ifdef GL_ES
precision highp float;
#endif

#define MAT_LENGTH 3

uniform sampler2D sampler1;
uniform float width;
uniform float height;

varying vec2 vTexCoord1;

vec4 findClosestPaletteColor(vec4 color) {
  float b = sqrt(dot(color.xyz, color.xyz));
  float val;
  if (b < .5) {
    val = 0.;
  } else {
    val = 1.;
  }
  return vec4(vec3(val), 1);
}

void main(void) {
  const mat2 G2 = mat2(1, 3, 4, 2) / 5.;
  const mat3 G3 = mat3(3, 7, 4, 6, 1, 9, 2, 8, 5) / 10.;
  const mat4 G4 = mat4(1, 9, 3, 11, 13, 5, 15, 7, 4, 12, 2, 10, 16, 8, 14, 6) / 17.;

  vec2 p = vec2(gl_FragCoord.x, gl_FragCoord.y);
  int i = int(mod(p.x, float(MAT_LENGTH)));
  int j = int(mod(p.y, float(MAT_LENGTH)));
  float matVal;

  for (int x = 0; x < MAT_LENGTH; x++) {
    for(int y = 0; y < MAT_LENGTH; y++) {
      if (x == i && y == j) {
        matVal = G3[x][y];
        break;
      }
    }
  }

  vec4 oldPixel = texture2D(sampler1, vTexCoord1) + matVal;
  vec4 newPixel = findClosestPaletteColor(oldPixel);

  gl_FragColor = newPixel;
}


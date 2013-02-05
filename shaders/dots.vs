attribute vec2 dots;

uniform float width;
uniform float height;

void main(void) {
  gl_PointSize = 1.1;
  gl_Position = vec4(vec3(dots / vec2(width, height) * 2. - 1., 0), 1);
}


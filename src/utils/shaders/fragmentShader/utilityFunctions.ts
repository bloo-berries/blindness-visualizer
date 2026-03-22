/**
 * Utility functions (noise, blur)
 */
export const UTILITY_FUNCTIONS = `
  float simpleNoise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  vec3 gaussianBlur(sampler2D tex, vec2 uv, float sigma) {
    vec2 pixelSize = vec2(1.0) / vec2(textureSize(tex, 0));
    vec3 result = vec3(0.0);
    float total = 0.0;
    int samples = int(sigma * 3.0);
    for(int x = -samples; x <= samples; x++) {
      for(int y = -samples; y <= samples; y++) {
        vec2 offset = vec2(float(x), float(y)) * pixelSize;
        float weight = exp(-(float(x*x + y*y)) / (2.0 * sigma * sigma));
        result += texture2D(tex, uv + offset).rgb * weight;
        total += weight;
      }
    }
    return result / total;
  }
`;

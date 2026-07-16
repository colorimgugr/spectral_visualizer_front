/** Minimal row-major 3x3 homography math for stitched-compare coordinate sync. */

export type Mat3 = number[]; // row-major, length 9

export const identity3 = (): Mat3 => [1, 0, 0, 0, 1, 0, 0, 0, 1];

export function multiply3(a: Mat3, b: Mat3): Mat3 {
  const out = new Array(9).fill(0);
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      for (let k = 0; k < 3; k++) out[r * 3 + c] += a[r * 3 + k] * b[k * 3 + c];
  return out;
}

export function invert3(m: Mat3): Mat3 {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const det = a * A + b * B + c * C;
  if (Math.abs(det) < 1e-12) return identity3();
  const s = 1 / det;
  return [
    A * s,
    -(b * i - c * h) * s,
    (b * f - c * e) * s,
    B * s,
    (a * i - c * g) * s,
    -(a * f - c * d) * s,
    C * s,
    -(a * h - b * g) * s,
    (a * e - b * d) * s,
  ];
}

/** Apply homography to a 2D point (projective divide). */
export function apply3(m: Mat3, x: number, y: number): { x: number; y: number } {
  const w = m[6] * x + m[7] * y + m[8];
  return {
    x: (m[0] * x + m[1] * y + m[2]) / w,
    y: (m[3] * x + m[4] * y + m[5]) / w,
  };
}

/**
 * Local isotropic scale of the mapping at (x, y): sqrt(|det J|) of the 2x2
 * Jacobian. For an affine matrix this is constant; for a near-similarity
 * homography it varies slightly across the image.
 */
export function localScale3(m: Mat3, x: number, y: number): number {
  const w = m[6] * x + m[7] * y + m[8];
  const px = apply3(m, x, y);
  // d/dx and d/dy of the projective map (quotient rule)
  const j00 = (m[0] - m[6] * px.x) / w;
  const j01 = (m[1] - m[7] * px.x) / w;
  const j10 = (m[3] - m[6] * px.y) / w;
  const j11 = (m[4] - m[7] * px.y) / w;
  return Math.sqrt(Math.abs(j00 * j11 - j01 * j10));
}

/** Proportional fallback mapping frame a (wa x ha) -> frame b (wb x hb). */
export function proportional3(
  wa: number,
  ha: number,
  wb: number,
  hb: number
): Mat3 {
  return [wb / wa, 0, 0, 0, hb / ha, 0, 0, 0, 1];
}

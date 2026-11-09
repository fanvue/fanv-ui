import { describe, expect, it } from "vitest";
import {
  computePeaksFromChannelData,
  formatTime,
  generateFallbackPeaks,
  resamplePeaks,
} from "./audioWaveform";

describe("audioWaveform", () => {
  describe("formatTime", () => {
    it("formats seconds as m:ss", () => {
      expect(formatTime(0)).toBe("0:00");
      expect(formatTime(5)).toBe("0:05");
      expect(formatTime(65)).toBe("1:05");
      expect(formatTime(600)).toBe("10:00");
    });

    it("returns a placeholder for unknown values", () => {
      expect(formatTime(undefined)).toBe("--:--");
      expect(formatTime(Number.NaN)).toBe("--:--");
      expect(formatTime(Number.POSITIVE_INFINITY)).toBe("--:--");
    });

    it("clamps negatives to zero", () => {
      expect(formatTime(-5)).toBe("0:00");
    });
  });

  describe("generateFallbackPeaks", () => {
    it("is deterministic for the same src", () => {
      expect(generateFallbackPeaks("a.mp3", 16)).toEqual(generateFallbackPeaks("a.mp3", 16));
    });

    it("differs for a different src", () => {
      expect(generateFallbackPeaks("a.mp3", 16)).not.toEqual(generateFallbackPeaks("b.mp3", 16));
    });

    it("produces the requested count within [0.2, 1]", () => {
      const peaks = generateFallbackPeaks("a.mp3", 32);
      expect(peaks).toHaveLength(32);
      for (const p of peaks) {
        expect(p).toBeGreaterThanOrEqual(0.2);
        expect(p).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("computePeaksFromChannelData", () => {
    it("downsamples to the requested count of max-abs peaks", () => {
      const data = new Float32Array([0, -0.5, 0.25, 1, -0.75, 0.1]);
      expect(computePeaksFromChannelData(data, 3)).toEqual([0.5, 1, 0.75]);
    });

    it("scales a quietly recorded clip up to the full 0-1 range", () => {
      const peaks = computePeaksFromChannelData(new Float32Array([0.05, 0.1, 0.2, -0.15]), 4);
      expect(peaks).toHaveLength(4);
      for (const [index, expected] of [0.25, 0.5, 1, 0.75].entries()) {
        expect(peaks[index]).toBeCloseTo(expected, 5);
      }
    });

    it("keeps the relative shape of the waveform when scaling", () => {
      const loud = computePeaksFromChannelData(new Float32Array([0.2, 0.8, 0.4, 1]), 4);
      const quiet = computePeaksFromChannelData(new Float32Array([0.02, 0.08, 0.04, 0.1]), 4);
      for (const [index, peak] of quiet.entries()) {
        expect(peak).toBeCloseTo(loud[index] ?? 0, 5);
      }
    });

    it("leaves a silent clip flat instead of dividing by zero", () => {
      const peaks = computePeaksFromChannelData(new Float32Array([0, 0, 0, 0]), 4);
      expect(peaks).toEqual([0, 0, 0, 0]);
    });

    it("does not amplify near-silent noise to full height", () => {
      const peaks = computePeaksFromChannelData(new Float32Array([0.0001, 0.002, 0, 0.001]), 4);
      for (const peak of peaks) {
        expect(Number.isFinite(peak)).toBe(true);
        expect(peak).toBeLessThan(0.01);
      }
    });
  });

  describe("resamplePeaks", () => {
    it("returns an empty array for empty input or non-positive count", () => {
      expect(resamplePeaks([], 4)).toEqual([]);
      expect(resamplePeaks([1, 2], 0)).toEqual([]);
    });

    it("upsamples and downsamples to the requested length", () => {
      expect(resamplePeaks([0, 1], 4)).toHaveLength(4);
      expect(resamplePeaks([0, 0.5, 1, 0.5], 2)).toHaveLength(2);
    });
  });
});

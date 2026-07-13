/** Number of amplitude samples decoded/kept internally, resampled to the rendered bar count. */
export const RAW_PEAK_COUNT = 128;

/** Formats a duration in seconds as `m:ss`, or `--:--` when unknown. */
export function formatTime(seconds: number | undefined): string {
  if (seconds === undefined || !Number.isFinite(seconds)) return "--:--";
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

/** Deterministic 32-bit string hash (FNV-1a), used to seed the fallback waveform. */
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Seeded PRNG (mulberry32) — deterministic across runs, unlike `Math.random`. */
export function createSeededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic placeholder amplitudes used when audio can't be decoded (network/CORS/format failure). */
export function generateFallbackPeaks(src: string, count: number): number[] {
  const random = createSeededRandom(hashString(src));
  return Array.from({ length: count }, () => 0.2 + random() * 0.8);
}

/** Downsamples decoded PCM data to `count` peak (max-abs) amplitudes. */
export function computePeaksFromChannelData(channelData: Float32Array, count: number): number[] {
  const blockSize = Math.max(1, Math.floor(channelData.length / count));
  const peaks: number[] = [];
  for (let i = 0; i < count; i++) {
    const start = i * blockSize;
    let max = 0;
    for (let j = 0; j < blockSize && start + j < channelData.length; j++) {
      max = Math.max(max, Math.abs(channelData[start + j] ?? 0));
    }
    peaks.push(max);
  }
  return peaks;
}

/** Resamples a peaks array to `barCount` values (nearest-neighbour). */
export function resamplePeaks(peaks: number[], barCount: number): number[] {
  if (peaks.length === 0 || barCount <= 0) return [];
  const step = peaks.length / barCount;
  return Array.from(
    { length: barCount },
    (_, i) => peaks[Math.min(peaks.length - 1, Math.floor(i * step))] ?? 0,
  );
}

/** Decodes `src` via WebAudio and returns downsampled peak amplitudes. Throws on any failure. */
export async function decodeAudioPeaks(src: string, signal: AbortSignal): Promise<number[]> {
  const AudioContextCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) throw new Error("WebAudio unsupported");

  const response = await fetch(src, { signal });
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = new AudioContextCtor();
  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return computePeaksFromChannelData(audioBuffer.getChannelData(0), RAW_PEAK_COUNT);
  } finally {
    if (audioContext.state !== "closed") audioContext.close().catch(() => {});
  }
}

import * as React from "react";
import { cn } from "@/utils/cn";

interface AudioWaveformProps {
  /** AnalyserNode from useAudioRecorder for frequency data */
  analyserNode: AnalyserNode | null;
  /** Whether recording is active (affects rendering mode) */
  isRecording: boolean;
  /** Additional className */
  className?: string;
}

const BAR_WIDTH = 3;
const BAR_GAP = 4;
const BAR_RADIUS = 1.5;
const MIN_BAR_HEIGHT = 3;
const IDLE_DOT_SIZE = 3;

/** Draw a rounded rect, falling back to a plain rect if unsupported. */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.fill();
}

/**
 * Canvas-based waveform visualization for audio recording.
 * Shows animated frequency bars when recording, static dots when idle.
 *
 * @internal Not exported from the library — used internally by AudioUpload.
 */
export function AudioWaveform({ analyserNode, isRecording, className }: AudioWaveformProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef<number>(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cache color, dimensions, and frequency buffer outside the animation loop
    let cachedColor = "";
    let cachedWidth = 0;
    let cachedHeight = 0;
    let dataArray: Uint8Array<ArrayBuffer> | null = null;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      cachedColor = getComputedStyle(canvas).color || "#151515";
      cachedWidth = rect.width;
      cachedHeight = rect.height;
    };

    resizeCanvas();

    const drawIdle = () => {
      ctx.clearRect(0, 0, cachedWidth, cachedHeight);
      ctx.fillStyle = cachedColor;

      const totalBarSpace = IDLE_DOT_SIZE + BAR_GAP;
      const barCount = Math.floor(cachedWidth / totalBarSpace);
      const startX = (cachedWidth - barCount * totalBarSpace + BAR_GAP) / 2;
      const y = cachedHeight / 2 - IDLE_DOT_SIZE / 2;

      for (let i = 0; i < barCount; i++) {
        const x = startX + i * totalBarSpace;
        ctx.beginPath();
        ctx.arc(x + IDLE_DOT_SIZE / 2, y + IDLE_DOT_SIZE / 2, IDLE_DOT_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawRecording = () => {
      if (!analyserNode) {
        drawIdle();
        return;
      }

      ctx.clearRect(0, 0, cachedWidth, cachedHeight);

      // Reuse typed array across frames
      const bufferLength = analyserNode.frequencyBinCount;
      if (!dataArray || dataArray.length !== bufferLength) {
        dataArray = new Uint8Array(bufferLength);
      }
      analyserNode.getByteFrequencyData(dataArray);

      ctx.fillStyle = cachedColor;

      const totalBarSpace = BAR_WIDTH + BAR_GAP;
      const barCount = Math.floor(cachedWidth / totalBarSpace);
      const startX = (cachedWidth - barCount * totalBarSpace + BAR_GAP) / 2;

      const step = bufferLength / barCount;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * step);
        const value = (dataArray[dataIndex] ?? 0) / 255;
        const barHeight = Math.max(MIN_BAR_HEIGHT, value * (cachedHeight - 4));
        const x = startX + i * totalBarSpace;
        const y = (cachedHeight - barHeight) / 2;

        drawRoundedRect(ctx, x, y, BAR_WIDTH, barHeight, BAR_RADIUS);
      }

      rafRef.current = requestAnimationFrame(drawRecording);
    };

    if (isRecording && analyserNode) {
      rafRef.current = requestAnimationFrame(drawRecording);
    } else {
      drawIdle();
    }

    const observer = new ResizeObserver(() => {
      resizeCanvas();
      if (!isRecording || !analyserNode) {
        drawIdle();
      }
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [analyserNode, isRecording]);

  return <canvas ref={canvasRef} className={cn("h-5 w-full text-body-200", className)} />;
}

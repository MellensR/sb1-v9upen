import React, { useEffect, useRef } from 'react';

interface HealthGraphProps {
  value: number;
  type: 'health' | 'stress';
}

const HealthGraph: React.FC<HealthGraphProps> = ({ value, type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const getHealthConfig = (value: number) => {
    if (value >= 8) {
      return {
        color: '#22c55e',
        amplitude: 20,
        frequency: 1.5,
        speed: 1,
        noise: 0.1,
      };
    } else if (value >= 5) {
      return {
        color: '#eab308',
        amplitude: 15,
        frequency: 1.3,
        speed: 0.85,
        noise: 0.2,
      };
    } else if (value >= 2) {
      return {
        color: '#f97316',
        amplitude: 10,
        frequency: 1.1,
        speed: 0.7,
        noise: 0.4,
      };
    } else if (value === 1) {
      return {
        color: '#dc2626',
        amplitude: 5,
        frequency: 0.8,
        speed: 0.5,
        noise: 0.6,
      };
    } else {
      return {
        color: '#7f1d1d',
        amplitude: 0,
        frequency: 0,
        speed: 0,
        noise: 0,
      };
    }
  };

  const getStressConfig = (value: number) => {
    if (value >= 9) { // Panic (9-10)
      return {
        color: '#dc2626',
        amplitude: 25,
        frequency: 8, // Increased frequency for closer spikes
        speed: 2.5,
        noise: 0.6,
        secondaryWaves: [
          { frequency: 16, amplitude: 0.5 }, // Higher frequency for sharper peaks
          { frequency: 12, amplitude: 0.3 }
        ],
        jitter: 0.4,
        spikiness: 3 // New parameter for creating sharper peaks
      };
    } else if (value >= 6) { // Anxious (6-8)
      return {
        color: '#f97316',
        amplitude: 25,
        frequency: 2,
        speed: 1.5,
        noise: 0.5,
        secondaryWaves: [
          { frequency: 4, amplitude: 0.3 },
          { frequency: 6, amplitude: 0.2 }
        ],
        jitter: 0.3
      };
    } else if (value >= 3) { // Alert (3-5)
      return {
        color: '#eab308',
        amplitude: 20,
        frequency: 1.5,
        speed: 1.2,
        noise: 0.3,
        secondaryWaves: [
          { frequency: 3, amplitude: 0.2 },
          { frequency: 4, amplitude: 0.1 }
        ],
        jitter: 0.1
      };
    } else { // Calm (0-2)
      return {
        color: '#3b82f6',
        amplitude: 15,
        frequency: 1,
        speed: 0.8,
        noise: 0.1,
        secondaryWaves: [
          { frequency: 2, amplitude: 0.1 }
        ],
        jitter: 0
      };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = type === 'health' ? getHealthConfig(value) : getStressConfig(value);
    let startTime: number;
    let lastNoise = 0;

    const generateNoise = (prev: number, noiseLevel: number) => {
      return prev * 0.5 + (Math.random() - 0.5) * noiseLevel;
    };

    const createSpike = (x: number) => {
      return Math.pow(Math.sin(x), config.spikiness || 1);
    };

    const drawWave = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = config.color;
      ctx.lineWidth = 2;

      if (type === 'health' && value === 0) {
        // Flatline
        const y = canvas.height / 2;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      } else {
        for (let x = 0; x < canvas.width; x++) {
          const normalizedX = x / 50;
          const timeOffset = progress / (1000 / config.speed);
          
          // Base wave
          let y = type === 'stress' && value >= 9
            ? createSpike(normalizedX * config.frequency + timeOffset)
            : Math.sin(normalizedX * config.frequency + timeOffset);
          
          // Add secondary waves for complexity
          if (type === 'stress' && config.secondaryWaves) {
            config.secondaryWaves.forEach(wave => {
              const secondaryY = value >= 9
                ? createSpike(normalizedX * wave.frequency + timeOffset)
                : Math.sin(normalizedX * wave.frequency + timeOffset);
              y += secondaryY * wave.amplitude;
            });
          }
          
          // Add jitter for stress waves
          if (type === 'stress' && config.jitter) {
            y += (Math.random() - 0.5) * config.jitter;
          }
          
          // Add noise
          lastNoise = generateNoise(lastNoise, config.noise);
          y += lastNoise;

          // Scale and position
          y = y * config.amplitude + canvas.height / 2;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }

      ctx.stroke();

      // Add glow effect
      ctx.save();
      ctx.strokeStyle = config.color;
      ctx.lineWidth = 1;
      ctx.filter = 'blur(4px)';
      ctx.stroke();
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(drawWave);
    };

    animationFrameRef.current = requestAnimationFrame(drawWave);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, type]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={60}
      className="w-full h-[60px]"
    />
  );
};

export default HealthGraph;
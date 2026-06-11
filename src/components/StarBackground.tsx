import React, { useEffect, useRef } from 'react';

const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      opacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
    }> = [];

    const createStars = () => {
      stars.length = 0;
      const starCount = Math.floor((canvas.width * canvas.height) / 3000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star, index) => {
        star.twinklePhase += star.twinkleSpeed;
        const currentOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinklePhase));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();

        if (index % 7 === 0) {
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.radius * 3
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.5})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createStars();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        background: 'linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 50%, #0f172a 100%)',
      }}
    />
  );
};

export default StarBackground;

import React, { useEffect, useRef } from 'react';

export default function BackgroundVFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const suits = ['♠', '♥', '♦', '♣'];
    const mouse = { x: null as number | null, y: null as number | null, radius: 120 };
    let particles: any[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const trackMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const trackTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const init = () => {
      particles = [];
      const count = Math.min(20, Math.floor((canvas.width * canvas.height) / 35000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 12 + 8,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: (Math.random() - 0.5) * 0.25,
          suit: suits[Math.floor(Math.random() * suits.length)],
          opacity: Math.random() * 0.12 + 0.03,
          color: Math.random() > 0.5 ? '59, 130, 246' : '139, 92, 246',
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.003,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.012)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.spin;

        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        if (mouse.x !== null && mouse.y !== null) {
          let dx = p.x - mouse.x;
          let dy = p.y - mouse.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            let force = (mouse.radius - dist) / mouse.radius;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.font = `${p.size}px Arial`;
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.shadowColor = `rgba(${p.color}, 0.3)`;
        ctx.shadowBlur = 4;
        ctx.fillText(p.suit, -p.size / 2, p.size / 2);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', trackMouse);
    window.addEventListener('touchmove', trackTouch);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', trackMouse);
      window.removeEventListener('touchmove', trackTouch);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

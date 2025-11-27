'use client';

import React, { useEffect, useRef } from 'react';

const ELEMENT_SCALE = 0.7;

const Starfield = ({
    density = 1000,
    speed = 0.5,
    reducedMotion = false,
    className = '',
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let stars = [];
        let shootingStars = [];
        let width = 0;
        let height = 0;

        const initStars = (w, h) => {
            width = w;
            height = h;
            canvas.width = width;
            canvas.height = height;

            const starCount = reducedMotion ? density / 4 : density;
            // Scale density by area to keep consistent look on larger screens
            const area = width * height;
            const baseArea = 1920 * 1080;
            const adjustedCount = Math.floor(starCount * (area / baseArea));

            stars = Array.from({ length: adjustedCount }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                size: (Math.random() * 1.5 + 0.5) * ELEMENT_SCALE,
                opacity: Math.random(),
                speed: (Math.random() * 0.5 + 0.1) * speed,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
            }));
        };

        const createShootingStar = () => {
            const startX = Math.random() * width;
            const startY = Math.random() * height;
            const angle = Math.random() * Math.PI * 2;
            const length = (Math.random() * 60 + 20) * ELEMENT_SCALE;
            const starSpeed = Math.random() * 15 + 10;

            shootingStars.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle) * starSpeed,
                vy: Math.sin(angle) * starSpeed,
                length,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.03,
            });
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            stars.forEach((star) => {
                star.twinklePhase += star.twinkleSpeed;
                const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.5;
                const opacity = star.opacity * (0.5 + twinkle * 0.5);

                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });

            if (!reducedMotion) {
                if (shootingStars.length < 2 && Math.random() < 0.003) {
                    createShootingStar();
                }

                for (let i = shootingStars.length - 1; i >= 0; i--) {
                    const s = shootingStars[i];
                    s.x += s.vx;
                    s.y += s.vy;
                    s.life -= s.decay;

                    if (s.life <= 0 || s.x < -100 || s.x > width + 100 || s.y < -100 || s.y > height + 100) {
                        shootingStars.splice(i, 1);
                        continue;
                    }

                    const tailX = s.x - s.vx * (s.length / Math.sqrt(s.vx * s.vx + s.vy * s.vy));
                    const tailY = s.y - s.vy * (s.length / Math.sqrt(s.vx * s.vx + s.vy * s.vy));

                    const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${s.life})`);
                    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1.5 * ELEMENT_SCALE;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(tailX, tailY);
                    ctx.stroke();

                    ctx.fillStyle = `rgba(255, 255, 255, ${s.life})`;
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, 1 * ELEMENT_SCALE, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width: w, height: h } = entry.contentRect;
                initStars(w, h);
            }
        });

        resizeObserver.observe(canvas);

        // Initial setup
        const rect = canvas.getBoundingClientRect();
        initStars(rect.width, rect.height);
        draw();

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, [density, speed, reducedMotion]);

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-none absolute inset-0 ${className}`}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default Starfield;

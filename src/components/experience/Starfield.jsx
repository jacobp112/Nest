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
            // Spawn logic: mostly from top or right side for a "falling" effect
            const startX = Math.random() * width;
            const startY = Math.random() < 0.5 ? -10 : Math.random() * (height / 2);

            // Angle: Between 30 and 60 degrees (diagonal down-right)
            // OR Between 120 and 150 degrees (diagonal down-left)
            // Let's go with diagonal down-left (classic meteor look)
            const angle = (Math.random() * 0.2 + 0.6) * Math.PI; // roughly 108 to 144 degrees

            const length = (Math.random() * 150 + 100) * ELEMENT_SCALE; // Longer trails
            const starSpeed = Math.random() * 20 + 15; // Faster speed

            shootingStars.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle) * starSpeed,
                vy: Math.sin(angle) * starSpeed,
                length,
                life: 1.0,
                decay: 0.01 + Math.random() * 0.02, // Slower decay for longer visibility
            });
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Draw Static Stars
            stars.forEach((star) => {
                star.twinklePhase += star.twinkleSpeed;
                const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.5;
                const opacity = star.opacity * (0.5 + twinkle * 0.5);

                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // 2. Draw Shooting Stars
            if (!reducedMotion) {
                // Limit concurrent stars; slightly lower spawn chance to reduce frequency
                if (shootingStars.length < 1 && Math.random() < 0.008) {
                    createShootingStar();
                }

                for (let i = shootingStars.length - 1; i >= 0; i--) {
                    const s = shootingStars[i];
                    s.x += s.vx;
                    s.y += s.vy;
                    s.life -= s.decay;

                    // Remove if dead or way off screen
                    if (s.life <= 0 || s.x < -s.length || s.x > width + s.length || s.y > height + s.length) {
                        shootingStars.splice(i, 1);
                        continue;
                    }

                    // Calculate tail position
                    const speedMag = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
                    const tailX = s.x - (s.vx / speedMag) * s.length;
                    const tailY = s.y - (s.vy / speedMag) * s.length;

                    // Draw the tail (Gradient)
                    const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${s.life})`); // Head opacity
                    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`); // Tail fade

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 2 * ELEMENT_SCALE;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(tailX, tailY);
                    ctx.stroke();

                    // Draw the head (Glowing Dot)
                    ctx.fillStyle = `rgba(255, 255, 255, ${s.life})`;
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, 1.5 * ELEMENT_SCALE, 0, Math.PI * 2); // Slightly larger head
                    ctx.fill();

                    // Optional: Add a "glow" around the head
                    ctx.fillStyle = `rgba(255, 255, 255, ${s.life * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, 4 * ELEMENT_SCALE, 0, Math.PI * 2);
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

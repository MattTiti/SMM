"use client";
import React, { useEffect, useRef } from "react";

const FallingMoney = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Money bills
    const bills = [];
    const billImage = new Image();
    billImage.src = "/dollar-bill.png"; // Make sure to add this image to your public folder

    for (let i = 0; i < 20; i++) {
      bills.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1 + Math.random() * 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bills.forEach((bill) => {
        ctx.save();
        ctx.translate(bill.x, bill.y);
        ctx.rotate((bill.rotation * Math.PI) / 180);
        ctx.drawImage(billImage, -25, -10, 50, 20);
        ctx.restore();

        bill.y += bill.speed;
        bill.rotation += bill.rotationSpeed;

        if (bill.y > canvas.height) {
          bill.y = -20;
          bill.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    billImage.onload = () => {
      animate();
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

export default FallingMoney;

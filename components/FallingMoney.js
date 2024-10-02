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
    billImage.src = "/dollar-bill.png";
    for (let i = 0; i < 20; i++) {
      bills.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1 + Math.random() * 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        width: 100,
        height: 40,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bills.forEach((bill) => {
        ctx.save();
        ctx.translate(bill.x, bill.y);
        ctx.rotate((bill.rotation * Math.PI) / 180);
        // Use the new width and height when drawing the image
        ctx.drawImage(
          billImage,
          -bill.width / 2,
          -bill.height / 2,
          bill.width,
          bill.height
        );
        ctx.restore();

        bill.y += bill.speed;
        bill.rotation += bill.rotationSpeed;

        if (bill.y > canvas.height) {
          bill.y = -bill.height;
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

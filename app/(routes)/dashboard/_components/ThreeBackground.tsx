"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const particleCount = 40;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x06b6d4);
    const color2 = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      const mixColor = Math.random();
      const finalColor = mixColor < 0.5 ? color1 : color2;
      colors[i * 3] = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    const maxConnections = 30;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxConnections * 6);
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.05,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 5;

    let connectionIndex = 0;

    const animate = (time: number) => {
      frameRef.current = requestAnimationFrame(animate);

      const delta = time - lastTimeRef.current;
      if (delta < 16.67) return;
      lastTimeRef.current = time;

      const posArray = particles.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += Math.sin(time * 0.0003 + i) * 0.001;
        posArray[i * 3 + 1] += Math.cos(time * 0.0003 + i) * 0.001;
      }
      particles.attributes.position.needsUpdate = true;

      connectionIndex = 0;
      const linePosArray = lineGeometry.attributes.position.array as Float32Array;
      const threshold = 4;

      for (let i = 0; i < particleCount && connectionIndex < maxConnections; i += 2) {
        for (let j = i + 1; j < particleCount && connectionIndex < maxConnections; j += 2) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < threshold * threshold) {
            const idx = connectionIndex * 6;
            linePosArray[idx] = posArray[i * 3];
            linePosArray[idx + 1] = posArray[i * 3 + 1];
            linePosArray[idx + 2] = posArray[i * 3 + 2];
            linePosArray[idx + 3] = posArray[j * 3];
            linePosArray[idx + 4] = posArray[j * 3 + 1];
            linePosArray[idx + 5] = posArray[j * 3 + 2];
            connectionIndex++;
          }
        }
      }

      for (let i = connectionIndex * 6; i < linePosArray.length; i++) {
        linePosArray[i] = 0;
      }
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    frameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      particles.dispose();
      lineGeometry.dispose();
      particleMaterial.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ willChange: "transform" }}
    />
  );
}
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    let animationFrameId = 0;
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
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Neural network particles
    const particleCount = 150;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x06b6d4); // cyan
    const color2 = new THREE.Color(0x8b5cf6); // violet
    const color3 = new THREE.Color(0x3b82f6); // blue

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const mixColor = Math.random();
      const finalColor = new THREE.Color();
      if (mixColor < 0.33) {
        finalColor.copy(color1);
      } else if (mixColor < 0.66) {
        finalColor.copy(color2);
      } else {
        finalColor.copy(color3);
      }

      colors[i * 3] = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Connection lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.15,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 6);
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Pulse rings
    const ringGeometry = new THREE.RingGeometry(0.1, 0.15, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(ringGeometry, ringMaterial.clone());
      ring.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        -2
      );
      ring.userData = { scale: 1, speed: 0.005 + Math.random() * 0.01 };
      scene.add(ring);
      rings.push(ring);
    }

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const posArray = particles.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.002;
        posArray[i * 3] += Math.cos(Date.now() * 0.0005 + i) * 0.001;
      }
      particles.attributes.position.needsUpdate = true;

      // Update connections
      let lineIndex = 0;
      const linePosArray = lineGeometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 2.5) {
            linePosArray[lineIndex++] = posArray[i * 3];
            linePosArray[lineIndex++] = posArray[i * 3 + 1];
            linePosArray[lineIndex++] = posArray[i * 3 + 2];
            linePosArray[lineIndex++] = posArray[j * 3];
            linePosArray[lineIndex++] = posArray[j * 3 + 1];
            linePosArray[lineIndex++] = posArray[j * 3 + 2];
          }
        }
      }
      // Clear remaining
      for (let i = lineIndex; i < linePosArray.length; i++) {
        linePosArray[i] = 0;
      }
      lineGeometry.attributes.position.needsUpdate = true;

      // Animate rings
      rings.forEach((ring) => {
        ring.userData.scale += ring.userData.speed;
        if (ring.userData.scale > 3) {
          ring.userData.scale = 0.5;
          ring.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            -2
          );
        }
        ring.scale.setScalar(ring.userData.scale);
        (ring.material as THREE.MeshBasicMaterial).opacity =
          0.3 * (1 - ring.userData.scale / 3);
      });

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      particles.dispose();
      lineGeometry.dispose();
      ringGeometry.dispose();
      particleMaterial.dispose();
      lineMaterial.dispose();
      ringMaterial.dispose();
      rings.forEach((ring) => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
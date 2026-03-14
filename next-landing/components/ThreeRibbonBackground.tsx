"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

interface RibbonState {
  rotateY: number;
  rotateX: number;
  spread: number;
  bend: number;
  driftY: number;
}

export default function ThreeRibbonBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    gsap.registerPlugin(ScrollTrigger);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.7, 12.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const key = new THREE.DirectionalLight(0xa7ccff, 1.35);
    key.position.set(9, 11, 9);
    const fill = new THREE.DirectionalLight(0x8f7dff, 1.15);
    fill.position.set(-8, -4, 7);
    scene.add(ambient, key, fill);

    const ribbonGroup = new THREE.Group();
    scene.add(ribbonGroup);

    const barCount = isMobile ? 30 : 58;
    const bars: THREE.Mesh[] = [];
    const edges: THREE.LineSegments[] = [];

    for (let i = 0; i < barCount; i += 1) {
      const t = i / (barCount - 1);
      const geometry = new THREE.BoxGeometry(1.65, 0.085, 0.65);
      const color = new THREE.Color().setHSL(0.57 + t * 0.16, 0.88, 0.73);
      const material = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.1,
        metalness: 0.08,
        transparent: true,
        opacity: 0.42,
        transmission: 0.94,
        ior: 1.42,
        thickness: 1.1,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      });

      const bar = new THREE.Mesh(geometry, material);
      bar.position.set(-8 + t * 16, -4 + t * 7.2, -1.2 + Math.sin(t * Math.PI) * 2);
      bar.rotation.set(0.12, 0.34, 0.6 + t * 0.22);
      ribbonGroup.add(bar);
      bars.push(bar);

      const line = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0xb9efff, transparent: true, opacity: 0.45 })
      );
      line.position.copy(bar.position);
      line.rotation.copy(bar.rotation);
      ribbonGroup.add(line);
      edges.push(line);
    }

    const state: RibbonState = {
      rotateY: 0.6,
      rotateX: -0.12,
      spread: 0.7,
      bend: 0.95,
      driftY: 0,
    };

    const sections = {
      s1: document.getElementById("scene-hero"),
      s2: document.getElementById("scene-creation"),
      s3: document.getElementById("scene-questions"),
    };

    const triggers: ScrollTrigger[] = [];

    if (sections.s1) {
      triggers.push(
        ScrollTrigger.create({
          trigger: sections.s1,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            state.rotateY = 0.6 + self.progress * 0.2;
            state.driftY = self.progress * 0.8;
          },
        })
      );
    }

    if (sections.s2) {
      triggers.push(
        ScrollTrigger.create({
          trigger: sections.s2,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            state.rotateX = -0.12 - self.progress * 0.24;
            state.spread = 0.7 + self.progress * 0.75;
            state.bend = 0.95 + self.progress * 0.35;
          },
        })
      );
    }

    if (sections.s3) {
      triggers.push(
        ScrollTrigger.create({
          trigger: sections.s3,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            state.rotateY = 0.8 - self.progress * 0.15;
            state.spread = 1.45 - self.progress * 0.3;
            state.bend = 1.3 - self.progress * 0.2;
          },
        })
      );
    }

    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      ribbonGroup.rotation.y += prefersReducedMotion ? 0.0007 : 0.0012;
      ribbonGroup.rotation.x = state.rotateX;

      for (let i = 0; i < bars.length; i += 1) {
        const bar = bars[i];
        const edge = edges[i];
        const t = i / (bars.length - 1);

        const waveA = Math.sin(elapsed * 0.56 + t * 9.4) * (prefersReducedMotion ? 0.08 : 0.18);
        const waveB = Math.cos(elapsed * 0.44 + t * 7.2) * 0.15;

        const x = -7.6 + t * 15.2;
        const y = -3.9 + t * 7 + waveA * state.bend + state.driftY;
        const z = -0.9 + Math.sin(t * Math.PI * state.spread + elapsed * 0.5) * (1.5 + waveB);

        bar.position.set(x, y, z);
        edge.position.copy(bar.position);

        const rotZ = 0.52 + t * 0.24 + waveA * 0.28;
        const rotY = state.rotateY + waveB * 0.15;
        bar.rotation.set(0.08 + waveA * 0.15, rotY, rotZ);
        edge.rotation.copy(bar.rotation);
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(frameId);
      triggers.forEach((trigger) => trigger.kill());
      renderer.dispose();
      container.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const material = obj.material;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else {
            material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-[1] opacity-90"
      style={{
        maskImage: "radial-gradient(80% 80% at 50% 45%, black 35%, transparent 100%)",
      }}
      aria-hidden
    />
  );
}

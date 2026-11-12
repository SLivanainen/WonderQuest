import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Compass, Search, Moon, Sun, Volume2, VolumeX, Shuffle, Heart, Trophy,
  Clock, Sparkles, ChevronRight, ChevronLeft, CheckCircle2, XCircle,
  HelpCircle, SkipForward, RotateCcw, Play, Star, Flame, Award,
  Filter, SlidersHorizontal, BookOpen, Globe, Rocket, Leaf, Utensils,
  Cpu, Calculator, Music, Film, Crown, Shield, Info, Mail, Plus,
  Trash2, Check, ArrowRight, Menu, X, Eye, AlertCircle, Zap, Layers,
  Home as HomeIcon, Grid, BarChart3, Share2, ExternalLink
} from 'lucide-react';

// ============================================================================
// 1. WEB AUDIO API SOUND ENGINE (Zero external audio dependencies)
// ============================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, delay = 0, gainVal = 0.18) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {
      // Ignore audio errors on restricted browsers
    }
  }

  click() {
    this.playTone(520, 'sine', 0.07, 0, 0.1);
  }

  correct() {
    this.playTone(523.25, 'triangle', 0.14, 0, 0.2);
    this.playTone(659.25, 'triangle', 0.14, 0.09, 0.2);
    this.playTone(783.99, 'triangle', 0.24, 0.18, 0.22);
  }

  incorrect() {
    this.playTone(310, 'sawtooth', 0.16, 0, 0.14);
    this.playTone(240, 'sawtooth', 0.24, 0.12, 0.14);
  }

  fanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 'triangle', 0.22, idx * 0.11, 0.22);
    });
  }

  tick() {
    this.playTone(880, 'sine', 0.04, 0, 0.06);
  }
}

const sound = new SoundEngine();

// ============================================================================
// 2. BESPOKE SVG ARTWORK & VISUAL QUESTION DIAGRAMS (100% Original)
// ============================================================================
const QuizArtwork = ({ theme, className = "w-full h-48" }) => {
  const scenes = {
    panda: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="pandaBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#pandaBg)" />
        {/* Bamboo stalks */}
        <g fill="#34d399" opacity="0.35">
          <rect x="35" y="0" width="14" height="220" rx="4" />
          <rect x="65" y="0" width="10" height="220" rx="3" />
          <rect x="330" y="0" width="16" height="220" rx="4" />
          <rect x="360" y="0" width="11" height="220" rx="3" />
        </g>
        <circle cx="200" cy="115" r="78" fill="#a7f3d0" opacity="0.2" />
        {/* Cute Giant Panda */}
        <circle cx="152" cy="68" r="22" fill="#1e293b" />
        <circle cx="248" cy="68" r="22" fill="#1e293b" />
        <ellipse cx="200" cy="118" rx="64" ry="56" fill="#ffffff" />
        {/* Eye patches */}
        <ellipse cx="175" cy="112" rx="18" ry="22" transform="rotate(-18 175 112)" fill="#1e293b" />
        <ellipse cx="225" cy="112" rx="18" ry="22" transform="rotate(18 225 112)" fill="#1e293b" />
        {/* Eyes */}
        <circle cx="177" cy="110" r="6" fill="#ffffff" />
        <circle cx="179" cy="109" r="3" fill="#0f172a" />
        <circle cx="223" cy="110" r="6" fill="#ffffff" />
        <circle cx="221" cy="109" r="3" fill="#0f172a" />
        {/* Nose & smile */}
        <ellipse cx="200" cy="132" rx="10" ry="7" fill="#1e293b" />
        <path d="M188 144 Q200 155 212 144" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="156" cy="134" r="9" fill="#fda4af" opacity="0.75" />
        <circle cx="244" cy="134" r="9" fill="#fda4af" opacity="0.75" />
        {/* Bamboo leaf sprig */}
        <path d="M255 162 Q285 140 315 155 Q285 170 255 162 Z" fill="#bef264" />
      </svg>
    ),
    space: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="spaceBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="planetGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#spaceBg)" />
        {/* Stars */}
        <g fill="#ffffff">
          <circle cx="45" cy="38" r="2" opacity="0.9" />
          <circle cx="110" cy="25" r="2.5" opacity="0.7" />
          <circle cx="310" cy="35" r="2" opacity="0.85" />
          <circle cx="355" cy="85" r="3" opacity="0.8" />
          <circle cx="65" cy="175" r="2.5" opacity="0.75" />
          <circle cx="330" cy="180" r="2" opacity="0.9" />
          <path d="M90 65 L93 73 L101 76 L93 79 L90 87 L87 79 L79 76 L87 73 Z" fill="#fde047" />
          <path d="M295 125 L297 131 L303 133 L297 135 L295 141 L293 135 L287 133 L293 131 Z" fill="#38bdf8" />
        </g>
        {/* Ringed Planet */}
        <circle cx="200" cy="110" r="46" fill="url(#planetGrad)" />
        <ellipse cx="200" cy="110" rx="92" ry="22" transform="rotate(-18 200 110)" fill="none" stroke="#fde68a" strokeWidth="8" opacity="0.85" />
        <ellipse cx="200" cy="110" rx="76" ry="16" transform="rotate(-18 200 110)" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.8" />
        {/* Small Rocket */}
        <g transform="translate(95, 118) rotate(-35)">
          <path d="M0 -22 C10 -10 10 10 8 20 L-8 20 C-10 10 -10 -10 0 -22 Z" fill="#f8fafc" />
          <path d="M0 -22 C5 -14 6 -8 6 -6 L-6 -6 C-6 -8 -5 -14 0 -22 Z" fill="#ef4444" />
          <circle cx="0" cy="2" r="4.5" fill="#38bdf8" />
          <path d="M-8 12 L-16 22 L-6 20 Z" fill="#ef4444" />
          <path d="M8 12 L16 22 L6 20 Z" fill="#ef4444" />
        </g>
      </svg>
    ),
    geography: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="geoBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#geoBg)" />
        {/* Globe */}
        <circle cx="200" cy="110" r="76" fill="#38bdf8" stroke="#bae6fd" strokeWidth="4" />
        <path d="M150 75 Q175 60 190 85 Q205 100 180 125 Q155 135 145 110 Z" fill="#4ade80" />
        <path d="M215 65 Q250 70 255 105 Q240 140 215 145 Q205 120 220 95 Z" fill="#22c55e" />
        <path d="M175 145 Q195 142 205 162 Q185 175 170 162 Z" fill="#86efac" />
        {/* Mountain peak badge */}
        <polygon points="75,180 115,115 155,180" fill="#f8fafc" opacity="0.9" />
        <polygon points="115,115 102,137 112,133 118,140 128,136" fill="#94a3b8" />
        {/* Compass */}
        <circle cx="315" cy="155" r="28" fill="#fef3c7" stroke="#f59e0b" strokeWidth="4" />
        <polygon points="315,134 321,155 315,176 309,155" fill="#ef4444" />
      </svg>
    ),
    capitals: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="capBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#capBg)" />
        <circle cx="200" cy="110" r="85" fill="#fef3c7" opacity="0.2" />
        {/* Stylized Landmark Skyline */}
        <rect x="85" y="125" width="38" height="65" rx="4" fill="#fffbeb" />
        <polygon points="104,85 82,125 126,125" fill="#fef3c7" />
        {/* Tower */}
        <polygon points="200,36 184,190 216,190" fill="#ffffff" />
        <rect x="178" y="115" width="44" height="8" rx="3" fill="#fde68a" />
        <rect x="172" y="150" width="56" height="8" rx="3" fill="#fde68a" />
        {/* Dome building */}
        <rect x="262" y="125" width="56" height="65" rx="4" fill="#fffbeb" />
        <path d="M262 125 A28 28 0 0 1 318 125 Z" fill="#fef3c7" />
        {/* Flags */}
        <rect x="135" y="55" width="4" height="45" fill="#ffffff" />
        <rect x="139" y="55" width="32" height="20" rx="2" fill="#ef4444" />
        <rect x="245" y="65" width="4" height="45" fill="#ffffff" />
        <rect x="249" y="65" width="32" height="20" rx="2" fill="#3b82f6" />
      </svg>
    ),
    science: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sciBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#sciBg)" />
        {/* Atom Orbitals */}
        <g transform="translate(200,110)">
          <ellipse rx="78" ry="26" fill="none" stroke="#a5f3fc" strokeWidth="4" />
          <ellipse rx="78" ry="26" transform="rotate(60)" fill="none" stroke="#a5f3fc" strokeWidth="4" />
          <ellipse rx="78" ry="26" transform="rotate(120)" fill="none" stroke="#a5f3fc" strokeWidth="4" />
          <circle r="14" fill="#fde047" />
          <circle cx="78" cy="0" r="6" fill="#ffffff" />
          <circle cx="-39" cy="67" r="6" fill="#ffffff" />
          <circle cx="-39" cy="-67" r="6" fill="#ffffff" />
        </g>
        {/* Flask */}
        <path d="M72 135 L85 135 L85 152 L102 182 Q105 188 98 188 L59 188 Q52 188 55 182 L72 152 Z" fill="#ffffff" opacity="0.9" />
        <circle cx="75" cy="118" r="5" fill="#a5f3fc" />
        <circle cx="84" cy="105" r="4" fill="#a5f3fc" />
      </svg>
    ),
    history: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="histBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#histBg)" />
        {/* Pyramids */}
        <polygon points="75,180 165,65 255,180" fill="#fbbf24" />
        <polygon points="165,65 255,180 205,180" fill="#d97706" />
        <polygon points="205,180 275,95 345,180" fill="#fcd34d" />
        <polygon points="275,95 345,180 305,180" fill="#f59e0b" />
        {/* Sun */}
        <circle cx="95" cy="58" r="24" fill="#fef08a" opacity="0.9" />
      </svg>
    ),
    nature: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="natBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#natBg)" />
        {/* Wave & Coral Reef / Rainforest */}
        <path d="M0 150 Q100 120 200 150 T400 150 L400 220 L0 220 Z" fill="#38bdf8" opacity="0.7" />
        <path d="M0 170 Q100 145 200 170 T400 170 L400 220 L0 220 Z" fill="#0284c7" />
        {/* Tropical Trees */}
        <rect x="115" y="85" width="12" height="65" fill="#fef3c7" />
        <circle cx="121" cy="78" r="34" fill="#4ade80" />
        <rect x="265" y="75" width="14" height="75" fill="#fef3c7" />
        <circle cx="272" cy="68" r="40" fill="#86efac" />
      </svg>
    ),
    food: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="foodBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#foodBg)" />
        {/* Plate */}
        <circle cx="200" cy="115" r="72" fill="#ffffff" />
        <circle cx="200" cy="115" r="56" fill="#fef2f2" stroke="#fecdd3" strokeWidth="3" />
        {/* Pizza / Fruit slice motif */}
        <path d="M200 68 L238 142 L162 142 Z" fill="#fbbf24" />
        <path d="M160 142 L240 142" stroke="#d97706" strokeWidth="8" strokeLinecap="round" />
        <circle cx="200" cy="104" r="6" fill="#ef4444" />
        <circle cx="188" cy="126" r="6" fill="#ef4444" />
        <circle cx="212" cy="126" r="6" fill="#ef4444" />
      </svg>
    ),
    sports: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sportBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#sportBg)" />
        {/* Trophy */}
        <path d="M165 60 H235 V105 C235 128 218 142 200 142 C182 142 165 128 165 105 Z" fill="#fbbf24" />
        <rect x="192" y="140" width="16" height="28" fill="#f59e0b" />
        <rect x="172" y="166" width="56" height="14" rx="4" fill="#fef3c7" />
        <path d="M165 72 H145 C145 102 158 112 168 112" fill="none" stroke="#fde047" strokeWidth="7" />
        <path d="M235 72 H255 C255 102 242 112 232 112" fill="none" stroke="#fde047" strokeWidth="7" />
        <polygon points="200,82 205,94 218,94 208,102 212,114 200,106 188,114 192,102 182,94 195,94" fill="#ffffff" />
      </svg>
    ),
    cinema: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cinBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#cinBg)" />
        {/* Clapperboard */}
        <rect x="135" y="85" width="130" height="85" rx="8" fill="#1e1b4b" />
        <rect x="135" y="65" width="130" height="22" rx="4" transform="rotate(-8 135 85)" fill="#f8fafc" />
        <polygon points="200,108 200,148 232,128" fill="#fbbf24" />
        {/* Musical notes */}
        <circle cx="88" cy="145" r="10" fill="#fde047" />
        <rect x="95" y="102" width="4" height="43" fill="#fde047" />
        <circle cx="305" cy="135" r="10" fill="#a5f3fc" />
        <rect x="312" y="92" width="4" height="43" fill="#a5f3fc" />
      </svg>
    ),
    tech: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="techBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#techBg)" />
        {/* Cute Robot */}
        <rect x="152" y="72" width="96" height="82" rx="18" fill="#38bdf8" />
        <rect x="166" y="88" width="68" height="36" rx="10" fill="#0f172a" />
        <circle cx="185" cy="106" r="7" fill="#4ade80" />
        <circle cx="215" cy="106" r="7" fill="#4ade80" />
        <rect x="184" y="134" width="32" height="6" rx="3" fill="#ffffff" />
        <rect x="197" y="46" width="6" height="26" fill="#94a3b8" />
        <circle cx="200" cy="42" r="8" fill="#fbbf24" />
      </svg>
    ),
    math: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mathBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#mathBg)" />
        {/* Geometric shapes */}
        <polygon points="115,65 160,155 70,155" fill="#fbbf24" opacity="0.9" />
        <circle cx="215" cy="110" r="44" fill="#38bdf8" opacity="0.9" />
        <rect x="275" y="72" width="72" height="72" rx="12" fill="#4ade80" opacity="0.9" />
        <text x="115" y="138" textAnchor="middle" fill="#1e1b4b" fontWeight="bold" fontSize="26">π</text>
        <text x="215" y="119" textAnchor="middle" fill="#1e1b4b" fontWeight="bold" fontSize="28">∑</text>
        <text x="311" y="118" textAnchor="middle" fill="#1e1b4b" fontWeight="bold" fontSize="28">√x</text>
      </svg>
    ),
    kids: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="kidsBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#kidsBg)" />
        {/* Rainbow */}
        <path d="M90 175 A110 110 0 0 1 310 175" fill="none" stroke="#ef4444" strokeWidth="14" />
        <path d="M104 175 A96 96 0 0 1 296 175" fill="none" stroke="#fde047" strokeWidth="14" />
        <path d="M118 175 A82 82 0 0 1 282 175" fill="none" stroke="#22c55e" strokeWidth="14" />
        <path d="M132 175 A68 68 0 0 1 268 175" fill="none" stroke="#3b82f6" strokeWidth="14" />
        {/* Clouds */}
        <circle cx="95" cy="175" r="24" fill="#ffffff" />
        <circle cx="122" cy="178" r="20" fill="#ffffff" />
        <circle cx="280" cy="178" r="20" fill="#ffffff" />
        <circle cx="305" cy="175" r="24" fill="#ffffff" />
      </svg>
    ),
    fairytale: (
      <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="fairyBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill="url(#fairyBg)" />
        {/* Enchanted Castle Silhouette */}
        <rect x="145" y="105" width="110" height="85" fill="#fef3c7" />
        <rect x="125" y="85" width="26" height="105" fill="#fde68a" />
        <rect x="249" y="85" width="26" height="105" fill="#fde68a" />
        <rect x="184" y="65" width="32" height="125" fill="#ffffff" />
        <polygon points="138,52 120,85 156,85" fill="#f43f5e" />
        <polygon points="262,52 244,85 280,85" fill="#f43f5e" />
        <polygon points="200,28 178,65 222,65" fill="#fbbf24" />
        <path d="M186 190 V155 A14 14 0 0 1 214 155 V190 Z" fill="#7c3aed" />
        {/* Sparkles */}
        <circle cx="95" cy="65" r="3" fill="#ffffff" />
        <circle cx="310" cy="58" r="4" fill="#fde047" />
        <circle cx="325" cy="115" r="3" fill="#ffffff" />
      </svg>
    ),
  };

  return scenes[theme] || scenes.space;
};

// Visual Diagrams embedded inside Image-Based Questions
const QuestionVisualDiagram = ({ diagramId }) => {
  switch (diagramId) {
    case 'panda-paw':
      return (
        <svg viewBox="0 0 280 150" className="w-full max-w-xs mx-auto h-36 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-2">
          <ellipse cx="145" cy="95" rx="44" ry="34" fill="#1e293b" />
          <circle cx="105" cy="52" r="14" fill="#1e293b" />
          <circle cx="132" cy="40" r="14" fill="#1e293b" />
          <circle cx="162" cy="40" r="14" fill="#1e293b" />
          <circle cx="190" cy="52" r="14" fill="#1e293b" />
          {/* Highlighted radial sesamoid "pseudo-thumb" */}
          <ellipse cx="86" cy="95" rx="18" ry="12" transform="rotate(-25 86 95)" fill="#10b981" stroke="#fde047" strokeWidth="3" />
          <text x="45" y="134" fill="#059669" fontWeight="bold" fontSize="12">Highlighted Digit</text>
        </svg>
      );
    case 'saturn-rings':
      return (
        <svg viewBox="0 0 280 150" className="w-full max-w-xs mx-auto h-36 rounded-2xl bg-indigo-950 border border-indigo-700 p-2">
          <circle cx="140" cy="75" r="34" fill="#f59e0b" />
          <ellipse cx="140" cy="75" rx="86" ry="20" transform="rotate(-15 140 75)" fill="none" stroke="#fde68a" strokeWidth="9" />
          <ellipse cx="140" cy="75" rx="68" ry="14" transform="rotate(-15 140 75)" fill="none" stroke="#38bdf8" strokeWidth="3" />
        </svg>
      );
    case 'triangle-angles':
      return (
        <svg viewBox="0 0 280 150" className="w-full max-w-xs mx-auto h-36 rounded-2xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 p-2">
          <polygon points="60,125 220,125 60,30" fill="#818cf8" opacity="0.25" stroke="#4f46e5" strokeWidth="3" />
          <rect x="60" y="109" width="16" height="16" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
          <text x="82" y="114" fill="#4f46e5" fontWeight="bold" fontSize="13">90°</text>
          <text x="175" y="118" fill="#4f46e5" fontWeight="bold" fontSize="13">35°</text>
          <text x="68" y="62" fill="#ef4444" fontWeight="bold" fontSize="14">?°</text>
        </svg>
      );
    case 'nordic-cross':
      return (
        <svg viewBox="0 0 280 150" className="w-full max-w-xs mx-auto h-36 rounded-2xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 p-3">
          <rect x="50" y="20" width="180" height="110" rx="6" fill="#005293" />
          <rect x="102" y="20" width="22" height="110" fill="#fecb00" />
          <rect x="50" y="64" width="180" height="22" fill="#fecb00" />
        </svg>
      );
    case 'compass-rose':
      return (
        <svg viewBox="0 0 280 150" className="w-full max-w-xs mx-auto h-36 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 p-2">
          <circle cx="140" cy="75" r="52" fill="none" stroke="#d97706" strokeWidth="3" />
          <polygon points="140,26 148,75 140,124 132,75" fill="#ef4444" />
          <polygon points="91,75 140,67 189,75 140,83" fill="#3b82f6" />
          <text x="140" y="18" textAnchor="middle" fill="#b45309" fontWeight="bold" fontSize="12">N (0°)</text>
          <text x="206" y="79" textAnchor="middle" fill="#b45309" fontWeight="bold" fontSize="12">E (90°)</text>
          <text x="140" y="142" textAnchor="middle" fill="#b45309" fontWeight="bold" fontSize="12">S (180°)</text>
          <text x="72" y="79" textAnchor="middle" fill="#ef4444" fontWeight="bold" fontSize="13">? (270°)</text>
        </svg>
      );
    default:
      return null;
  }
};

// ============================================================================
// 3. CATEGORIES (All 16 Requested Categories)
// ============================================================================
const CATEGORIES = [
  { id: 'animals-wildlife', name: 'Animals & Wildlife', color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300', icon: '🐼', desc: 'Amazing creatures, habitats & wild wonders' },
  { id: 'space-astronomy', name: 'Space & Astronomy', color: 'from-indigo-600 to-purple-700', badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300', icon: '🚀', desc: 'Planets, stars, galaxies & cosmic missions' },
  { id: 'geography', name: 'Geography', color: 'from-sky-500 to-blue-600', badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300', icon: '🌍', desc: 'Continents, oceans, mountains & landmarks' },
  { id: 'countries-capitals', name: 'Countries & Capitals', color: 'from-amber-500 to-orange-600', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300', icon: '🏛️', desc: 'World flags, capitals & global cultures' },
  { id: 'science', name: 'Science', color: 'from-cyan-500 to-blue-600', badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300', icon: '🔬', desc: 'Physics, chemistry, biology & discoveries' },
  { id: 'history', name: 'History', color: 'from-yellow-600 to-amber-800', badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', icon: '🏺', desc: 'Ancient civilizations & pivotal moments' },
  { id: 'nature', name: 'Nature', color: 'from-green-500 to-emerald-700', badge: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', icon: '🌿', desc: 'Rainforests, reefs, weather & ecosystems' },
  { id: 'food-drinks', name: 'Food & Drinks', color: 'from-rose-500 to-orange-500', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300', icon: '🍕', desc: 'Culinary traditions & tasty food science' },
  { id: 'sports', name: 'Sports', color: 'from-blue-600 to-emerald-500', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', icon: '🏆', desc: 'World championships, records & athletics' },
  { id: 'movies-music', name: 'Movies & Music', color: 'from-purple-600 to-pink-600', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300', icon: '🎬', desc: 'Cinema magic, instruments & melodies' },
  { id: 'technology', name: 'Technology', color: 'from-slate-700 to-blue-700', badge: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300', icon: '🤖', desc: 'Computing, robotics, AI & inventions' },
  { id: 'mathematics', name: 'Mathematics', color: 'from-violet-600 to-indigo-600', badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300', icon: '📐', desc: 'Numbers, geometry & clever brain teasers' },
  { id: 'general-knowledge', name: 'General Knowledge', color: 'from-teal-500 to-cyan-600', badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300', icon: '💡', desc: 'Fascinating facts from every corner of life' },
  { id: 'kids-learning', name: 'Kids Learning', color: 'from-orange-400 to-amber-500', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300', icon: '🌈', desc: 'Fun foundational trivia for young explorers' },
  { id: 'entertainment', name: 'Entertainment', color: 'from-fuchsia-500 to-rose-600', badge: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-300', icon: '🎪', desc: 'Games, books, arts & pop culture fun' },
  { id: 'enchanted-kingdoms', name: 'Enchanted Kingdoms', color: 'from-pink-500 via-purple-500 to-indigo-500', badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300', icon: '🏰', desc: 'Original fairytales, legends & magical realms' },
];

// ============================================================================
// 4. COMPLETE ORIGINAL QUIZ DATASET (14 Quizzes x 10 Questions = 140 Questions)
// ============================================================================
const INITIAL_QUIZZES = [
  {
    id: 'q-panda',
    slug: 'all-things-giant-panda',
    title: 'All Things Giant Panda!',
    description: 'Munch on bamboo facts and test your knowledge about the world’s favorite black-and-white bear!',
    intro: 'High in the misty bamboo forests of central China lives one of Earth’s most beloved mammals: the giant panda! Can you uncover the secrets of how they eat, climb, and communicate? Step into the bamboo grove and find out!',
    categoryId: 'animals-wildlife',
    theme: 'panda',
    difficulty: 'Easy',
    estimatedMinutes: 4,
    featured: true,
    trending: true,
    popularity: 99,
    createdAt: '2026-10-15',
    questions: [
      {
        id: 'p1',
        type: 'single',
        question: 'What makes up roughly 99% of a wild giant panda’s daily diet?',
        options: ['Bamboo shoots, stems, and leaves', 'Wild mountain berries', 'Freshwater river fish', 'Tree bark and acorns'],
        correctAnswers: [0],
        hint: 'It is a fast-growing woody grass that grows in dense mountain forests.',
        explanation: 'Although giant pandas belong to the bear family and have the digestive system of a carnivore, bamboo makes up about 99% of their diet!'
      },
      {
        id: 'p2',
        type: 'image',
        diagramId: 'panda-paw',
        question: 'Look at the highlighted structure on this panda paw diagram. What is this special adaptation used for?',
        options: ['Gripping bamboo stalks tightly', 'Digging deep underground tunnels', 'Swimming rapidly across rivers', 'Climbing sheer ice cliffs'],
        correctAnswers: [0],
        hint: 'It acts just like an opposable thumb when holding food.',
        explanation: 'Giant pandas have an enlarged wrist bone (the radial sesamoid) that functions like a "pseudo-thumb," letting them grasp bamboo stems with precision!'
      },
      {
        id: 'p3',
        type: 'boolean',
        question: 'True or False: Newborn giant panda cubs are born completely pink, blind, and about the size of a stick of butter.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Panda cubs are famously tiny compared to their 220-pound mothers!',
        explanation: 'True! At birth, a giant panda cub weighs only about 3 to 5 ounces (90–140 grams)—roughly 1/900th the size of its mother.'
      },
      {
        id: 'p4',
        type: 'single',
        question: 'In which country do wild giant pandas naturally live?',
        options: ['China', 'Japan', 'Nepal', 'Thailand'],
        correctAnswers: [0],
        hint: 'Their native mountain ranges include Sichuan, Shaanxi, and Gansu.',
        explanation: 'Wild giant pandas are native exclusively to temperate broadleaf and mixed forests in south-central China.'
      },
      {
        id: 'p5',
        type: 'multiple',
        question: 'Which TWO of the following skills are giant pandas surprisingly good at? (Select all that apply)',
        options: ['Climbing tall trees', 'Swimming in rivers', 'Hibernating all winter', 'Flying short distances'],
        correctAnswers: [0, 1],
        hint: 'Unlike many other bears, pandas do NOT hibernate because bamboo doesn’t store enough fat.',
        explanation: 'Giant pandas are agile tree climbers—often napping high in branches—and strong swimmers! They do not hibernate in winter.'
      },
      {
        id: 'p6',
        type: 'single',
        question: 'Approximately how many hours a day does a giant panda spend eating bamboo?',
        options: ['10 to 16 hours', '1 to 2 hours', '4 to 5 hours', '22 to 23 hours'],
        correctAnswers: [0],
        hint: 'Because bamboo is low in nutrients, they have to eat up to 38 kg (84 lbs) every day!',
        explanation: 'Because bamboo provides very little energy per bite, giant pandas spend 10 to 16 hours each day foraging and munching.'
      },
      {
        id: 'p7',
        type: 'single',
        question: 'Why do scientists believe giant pandas have black-and-white fur?',
        options: ['Camouflage in snow and shade, plus communication', 'To absorb solar radiation in deserts', 'To warn predators that they are venomous', 'To blend in with sandy beaches'],
        correctAnswers: [0],
        hint: 'Think about snowy mountain winters and dark, shadowy forest trunks.',
        explanation: 'Research shows the white fur helps pandas hide in snowy habitats while black limbs help them blend into forest shadows; dark ear and eye patches also help pandas recognize one another.'
      },
      {
        id: 'p8',
        type: 'boolean',
        question: 'True or False: Unlike house cats, giant pandas have vertical slit-shaped pupils in their eyes.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Most bears have round pupils, making the giant panda an exception!',
        explanation: 'True! Giant pandas are the only bear species with vertical slit pupils, similar to cats, which helps them see in dim forest light.'
      },
      {
        id: 'p9',
        type: 'single',
        question: 'What is a group of pandas playfully called?',
        options: ['An embarrassment', 'A pride', 'A pod', 'A parliament'],
        correctAnswers: [0],
        hint: 'It’s a funny English collective noun that sounds like feeling shy!',
        explanation: 'Even though pandas are mostly solitary in the wild, a group of pandas is famously known as an "embarrassment" (or a sleuth, like other bears).'
      },
      {
        id: 'p10',
        type: 'single',
        question: 'What conservation status did the IUCN update the giant panda to in 2016 thanks to decades of habitat protection?',
        options: ['Vulnerable (upgraded from Endangered)', 'Extinct in the Wild', 'Critically Endangered', 'Least Concern'],
        correctAnswers: [0],
        hint: 'Decades of forest reserves helped wild panda numbers rebound to over 1,800!',
        explanation: 'Thanks to reforestation and dedicated wildlife reserves, the giant panda’s status improved from Endangered to Vulnerable—a major conservation triumph!'
      }
    ]
  },
  {
    id: 'q-space',
    slug: 'cosmic-odyssey-solar-system',
    title: 'Cosmic Odyssey: Solar System & Beyond',
    description: 'Blast off across planets, moons, asteroids, and distant galaxies in this stellar space mission!',
    intro: 'Strap into your starship commander’s seat! From the scorching surface of Venus to the icy rings of Saturn and the mysteries of black holes, see if you have what it takes to earn your Intergalactic Explorer wings.',
    categoryId: 'space-astronomy',
    theme: 'space',
    difficulty: 'Medium',
    estimatedMinutes: 5,
    featured: true,
    trending: true,
    popularity: 97,
    createdAt: '2026-10-20',
    questions: [
      {
        id: 's1',
        type: 'single',
        question: 'Which planet in our solar system is the hottest, even though it is not the closest to the Sun?',
        options: ['Venus', 'Mercury', 'Mars', 'Jupiter'],
        correctAnswers: [0],
        hint: 'Its thick carbon dioxide atmosphere traps heat in a runaway greenhouse effect.',
        explanation: 'Venus reaches surface temperatures around 465°C (869°F)—hot enough to melt lead—due to its dense, heat-trapping atmosphere.'
      },
      {
        id: 's2',
        type: 'image',
        diagramId: 'saturn-rings',
        question: 'What are the dazzling rings surrounding this gas giant primarily made of?',
        options: ['Billions of chunks of water ice and rock', 'Solid rings of glowing neon gas', 'Molten lava orbiting the equator', 'Pure gold dust'],
        correctAnswers: [0],
        hint: 'These particles range in size from tiny grains of sand to giant boulders.',
        explanation: 'Saturn’s iconic ring system is composed mostly of countless pieces of water ice mixed with rocky debris and dust.'
      },
      {
        id: 's3',
        type: 'single',
        question: 'What is the name of the largest volcano in the entire solar system, located on Mars?',
        options: ['Olympus Mons', 'Mauna Kea', 'Mount Vesuvius', 'Maxwell Montes'],
        correctAnswers: [0],
        hint: 'It is nearly three times taller than Mount Everest!',
        explanation: 'Olympus Mons on Mars stands roughly 22 km (13.6 miles) high, making it the tallest planetary mountain and volcano known in our solar system.'
      },
      {
        id: 's4',
        type: 'boolean',
        question: 'True or False: One day on Venus (a single rotation) is longer than one year on Venus (a full orbit around the Sun).',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Venus spins backward very slowly on its axis.',
        explanation: 'True! Venus takes 243 Earth days to rotate once on its axis, while it completes an orbit around the Sun in 225 Earth days.'
      },
      {
        id: 's5',
        type: 'multiple',
        question: 'Which of the following planets are classified as "Ice Giants"? (Select all that apply)',
        options: ['Uranus', 'Neptune', 'Jupiter', 'Saturn'],
        correctAnswers: [0, 1],
        hint: 'Jupiter and Saturn are Gas Giants; the two outermost planets are richer in water, ammonia, and methane ices.',
        explanation: 'Uranus and Neptune are called Ice Giants because their interiors contain high concentrations of heavier elements like oxygen, carbon, nitrogen, and sulfur.'
      },
      {
        id: 's6',
        type: 'single',
        question: 'Which moon of Jupiter is covered in a thick crust of ice with a vast liquid water ocean hidden underneath?',
        options: ['Europa', 'Phobos', 'Titan', 'Triton'],
        correctAnswers: [0],
        hint: 'NASA’s Clipper mission is dedicated to exploring this icy Jovian moon.',
        explanation: 'Europa’s subsurface saltwater ocean may contain twice as much water as all of Earth’s oceans combined, making it a prime target in the search for life.'
      },
      {
        id: 's7',
        type: 'single',
        question: 'How long does it take sunlight to travel from the Sun to Earth?',
        options: ['About 8 minutes and 20 seconds', 'Exactly 1 second', 'About 24 hours', 'About 4.2 years'],
        correctAnswers: [0],
        hint: 'Light travels at roughly 300,000 kilometers per second across 150 million kilometers.',
        explanation: 'Light travels across the 150 million km (93 million miles) between the Sun and Earth in approximately 8 minutes and 20 seconds.'
      },
      {
        id: 's8',
        type: 'single',
        question: 'What is the name of the galaxy that contains our Solar System?',
        options: ['The Milky Way', 'Andromeda', 'Sombrero Galaxy', 'Whirlpool Galaxy'],
        correctAnswers: [0],
        hint: 'It appears as a milky band of stars stretching across a dark night sky.',
        explanation: 'We live in the Milky Way, a barred spiral galaxy containing between 100 and 400 billion stars.'
      },
      {
        id: 's9',
        type: 'boolean',
        question: 'True or False: Sound can travel freely through the vacuum of outer space.',
        options: ['True', 'False'],
        correctAnswers: [1],
        hint: 'Sound waves need molecules (like air or water) to vibrate and carry energy.',
        explanation: 'False! Because space is a near-perfect vacuum with almost no molecules to transmit vibrations, sound waves cannot travel through it.'
      },
      {
        id: 's10',
        type: 'single',
        question: 'What was the name of the first artificial satellite launched into Earth orbit in 1957?',
        options: ['Sputnik 1', 'Apollo 11', 'Voyager 1', 'Hubble'],
        correctAnswers: [0],
        hint: 'Its name means "satellite" or "fellow traveler" in Russian.',
        explanation: 'Sputnik 1 was launched on October 4, 1957, ushering in the Space Age.'
      }
    ]
  },
  {
    id: 'q-geography',
    slug: 'wonders-of-world-geography',
    title: 'Wonders of World Geography',
    description: 'Traverse towering peaks, mighty rivers, vast deserts, and tectonic marvels across all seven continents!',
    intro: 'Pack your compass and topographical map! How well do you know Earth’s extreme landscapes, deepest ocean trenches, and continental wonders? Let’s embark on a global expedition.',
    categoryId: 'geography',
    theme: 'geography',
    difficulty: 'Medium',
    estimatedMinutes: 5,
    featured: true,
    trending: false,
    popularity: 94,
    createdAt: '2026-10-12',
    questions: [
      {
        id: 'g1',
        type: 'single',
        question: 'Which desert is the largest hot desert in the world?',
        options: ['The Sahara Desert', 'The Gobi Desert', 'The Mojave Desert', 'The Atacama Desert'],
        correctAnswers: [0],
        hint: 'It stretches across North Africa and is nearly the size of the United States.',
        explanation: 'Covering roughly 9.2 million square kilometers across North Africa, the Sahara is the world’s largest hot desert (while Antarctica is the largest cold desert).'
      },
      {
        id: 'g2',
        type: 'image',
        diagramId: 'compass-rose',
        question: 'On this compass rose, what cardinal direction corresponds to 270 degrees?',
        options: ['West', 'East', 'North-East', 'South-West'],
        correctAnswers: [0],
        hint: 'Starting from North (0°), go clockwise: East is 90°, South is 180°...',
        explanation: 'Moving clockwise around a compass: North = 0°, East = 90°, South = 180°, and West = 270°!'
      },
      {
        id: 'g3',
        type: 'single',
        question: 'Which river carries the largest volume of water of any river on Earth?',
        options: ['The Amazon River', 'The Nile River', 'The Yangtze River', 'The Mississippi River'],
        correctAnswers: [0],
        hint: 'It flows through South America’s largest rainforest.',
        explanation: 'The Amazon River discharges more water into the ocean than the next seven largest independent rivers combined!'
      },
      {
        id: 'g4',
        type: 'boolean',
        question: 'True or False: Mount Everest grows slightly taller every year due to tectonic plate movement.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'The Indian tectonic plate continues pushing northward into the Eurasian plate.',
        explanation: 'True! Ongoing collision between the Indian and Eurasian tectonic plates pushes the Himalayas upward by a few millimeters each year.'
      },
      {
        id: 'g5',
        type: 'single',
        question: 'What is the deepest known point in Earth’s oceans?',
        options: ['Challenger Deep in the Mariana Trench', 'The Puerto Rico Trench', 'The Java Trench', 'The Tonga Trench'],
        correctAnswers: [0],
        hint: 'Located in the western Pacific Ocean, it plunges nearly 11,000 meters (36,000 feet) down.',
        explanation: 'Challenger Deep in the Mariana Trench reaches nearly 10,935 meters (35,876 feet) below sea level.'
      },
      {
        id: 'g6',
        type: 'multiple',
        question: 'Which TWO continents lie entirely in the Southern Hemisphere? (Select all that apply)',
        options: ['Australia', 'Antarctica', 'South America', 'Africa'],
        correctAnswers: [0, 1],
        hint: 'Both South America and Africa cross the Equator into the Northern Hemisphere.',
        explanation: 'Australia and Antarctica are the only two continents situated completely south of the Equator.'
      },
      {
        id: 'g7',
        type: 'single',
        question: 'Which strait separates Asia from North America at their closest point?',
        options: ['The Bering Strait', 'The Strait of Gibraltar', 'The Strait of Malacca', 'The Bosporus'],
        correctAnswers: [0],
        hint: 'It connects the Arctic Ocean with the Bering Sea between Russia and Alaska.',
        explanation: 'The Bering Strait separates Russia and Alaska by only about 82 kilometers (51 miles) at its narrowest point.'
      },
      {
        id: 'g8',
        type: 'single',
        question: 'What is the name of the horseshoe-shaped belt around the Pacific Ocean famous for frequent earthquakes and volcanic eruptions?',
        options: ['The Ring of Fire', 'The Mid-Atlantic Ridge', 'The Great Rift Valley', 'The Horn of Africa'],
        correctAnswers: [0],
        hint: 'Roughly 75% of the world’s active volcanoes are located along this rim.',
        explanation: 'The Pacific Ring of Fire traces boundaries where several tectonic plates meet and subduct around the Pacific basin.'
      },
      {
        id: 'g9',
        type: 'boolean',
        question: 'True or False: Iceland is located directly on top of the boundary between the North American and Eurasian tectonic plates.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'You can even snorkel between the two plates in Silfra fissure!',
        explanation: 'True! Iceland sits squarely on the Mid-Atlantic Ridge, giving it dramatic geysers, hot springs, and volcanic landscapes.'
      },
      {
        id: 'g10',
        type: 'single',
        question: 'Which country has the longest coastline in the world?',
        options: ['Canada', 'Indonesia', 'Australia', 'Norway'],
        correctAnswers: [0],
        hint: 'Bordering the Atlantic, Pacific, and Arctic Oceans plus tens of thousands of islands gives it over 202,000 km of coast.',
        explanation: 'Canada boasts the longest coastline on Earth at over 202,080 kilometers (125,567 miles).'
      }
    ]
  },
  {
    id: 'q-capitals',
    slug: 'capitals-and-flags-expedition',
    title: 'Capitals & Flags World Expedition',
    description: 'Stamp your passport as you match iconic flags, world capitals, and sovereign nations!',
    intro: 'Ready for takeoff? Test your global savvy by identifying capital cities, decoding flag designs, and navigating unique facts about nations around the world.',
    categoryId: 'countries-capitals',
    theme: 'capitals',
    difficulty: 'Medium',
    estimatedMinutes: 5,
    featured: true,
    trending: false,
    popularity: 91,
    createdAt: '2026-10-08',
    questions: [
      {
        id: 'c1',
        type: 'single',
        question: 'What is the capital city of Australia?',
        options: ['Canberra', 'Sydney', 'Melbourne', 'Brisbane'],
        correctAnswers: [0],
        hint: 'It was specially planned as a compromise between Sydney and Melbourne!',
        explanation: 'While Sydney and Melbourne are Australia’s largest cities, Canberra was selected and purpose-built as the nation’s capital in 1908.'
      },
      {
        id: 'c2',
        type: 'image',
        diagramId: 'nordic-cross',
        question: 'Which European country is represented by this blue flag with a golden-yellow Nordic cross?',
        options: ['Sweden', 'Finland', 'Norway', 'Denmark'],
        correctAnswers: [0],
        hint: 'Its capital city is Stockholm, built across 14 islands.',
        explanation: 'Sweden’s flag features a yellow Nordic cross on a blue field, inspired by the Swedish coat of arms.'
      },
      {
        id: 'c3',
        type: 'single',
        question: 'Which country’s national flag is the only one in the world that is NOT rectangular or square?',
        options: ['Nepal', 'Switzerland', 'Bhutan', 'Vatican City'],
        correctAnswers: [0],
        hint: 'Its flag consists of two stacked crimson triangles representing the Himalaya Mountains.',
        explanation: 'Nepal’s flag is made of two overlapping pennants (triangles) featuring the sun and crescent moon.'
      },
      {
        id: 'c4',
        type: 'single',
        question: 'What is the capital of Canada?',
        options: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal'],
        correctAnswers: [0],
        hint: 'It sits along the Ottawa River on the border of Ontario and Quebec.',
        explanation: 'Ottawa is the federal capital of Canada, home to Parliament Hill and the Rideau Canal.'
      },
      {
        id: 'c5',
        type: 'boolean',
        question: 'True or False: Tokyo is the most populous metropolitan area in the world.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Greater Tokyo is home to over 37 million residents.',
        explanation: 'True! The Greater Tokyo Area in Japan is the world’s most populous urban agglomeration.'
      },
      {
        id: 'c6',
        type: 'single',
        question: 'Which South American country has two official capitals: Sucre and La Paz?',
        options: ['Bolivia', 'Peru', 'Chile', 'Ecuador'],
        correctAnswers: [0],
        hint: 'La Paz is the highest administrative capital in the world at over 3,600 meters!',
        explanation: 'Bolivia’s constitutional capital is Sucre, while La Paz serves as the seat of government and executive capital.'
      },
      {
        id: 'c7',
        type: 'single',
        question: 'What is the capital city of Kenya?',
        options: ['Nairobi', 'Mombasa', 'Kampala', 'Addis Ababa'],
        correctAnswers: [0],
        hint: 'It is the only capital city in the world with a major national wildlife park right on its doorstep!',
        explanation: 'Nairobi is Kenya’s capital and famously borders Nairobi National Park, where lions and giraffes roam with skyscrapers in the background.'
      },
      {
        id: 'c8',
        type: 'multiple',
        question: 'Which TWO countries have square-shaped national flags? (Select all that apply)',
        options: ['Switzerland', 'Vatican City', 'Japan', 'Brazil'],
        correctAnswers: [0, 1],
        hint: 'Both are landlocked European states.',
        explanation: 'Switzerland and Vatican City are the only two sovereign nations with square national flags (1:1 aspect ratio).'
      },
      {
        id: 'c9',
        type: 'single',
        question: 'What is the capital of South Korea?',
        options: ['Seoul', 'Busan', 'Incheon', 'Kyoto'],
        correctAnswers: [0],
        hint: 'It lies along the Han River and blends ancient palaces with futuristic skyscrapers.',
        explanation: 'Seoul has served as Korea’s capital for over 600 years and is a global hub of technology and culture.'
      },
      {
        id: 'c10',
        type: 'single',
        question: 'Which country is home to the world’s highest capital city by elevation, La Paz?',
        options: ['Bolivia', 'Nepal', 'Switzerland', 'Mongolia'],
        correctAnswers: [0],
        hint: 'Nestled in the Andes Mountains at 3,640 meters (11,942 feet).',
        explanation: 'La Paz, Bolivia sits high in an Andes canyon at roughly 3,640 meters above sea level.'
      }
    ]
  },
  {
    id: 'q-science',
    slug: 'amazing-human-body-science',
    title: 'Amazing Human Body & Science Lab',
    description: 'Zoom inside cells, neurons, atoms, and chemical reactions to unlock how our universe works!',
    intro: 'Put on your lab coat and safety goggles! From the trillions of cells powering your heartbeat to the fundamental laws of physics and chemistry, let’s put your scientific curiosity to the test.',
    categoryId: 'science',
    theme: 'science',
    difficulty: 'Medium',
    estimatedMinutes: 5,
    featured: false,
    trending: true,
    popularity: 92,
    createdAt: '2026-10-25',
    questions: [
      {
        id: 'sc1',
        type: 'single',
        question: 'What is the hardest natural substance found in the human body?',
        options: ['Tooth enamel', 'The femur bone', 'Fingernails', 'Cartilage'],
        correctAnswers: [0],
        hint: 'It protects the outer crown of your teeth and is 96% mineral!',
        explanation: 'Tooth enamel is composed primarily of tightly packed hydroxyapatite crystals, making it even harder than bone.'
      },
      {
        id: 'sc2',
        type: 'single',
        question: 'Which gas do plants absorb from the atmosphere during photosynthesis?',
        options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium'],
        correctAnswers: [0],
        hint: 'Plants use sunlight to turn water and this gas into glucose and oxygen.',
        explanation: 'Plants take in carbon dioxide (CO₂) through tiny pores called stomata and release oxygen as a byproduct.'
      },
      {
        id: 'sc3',
        type: 'boolean',
        question: 'True or False: An adult human body has fewer bones than a newborn baby.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Many smaller bones fuse together as children grow!',
        explanation: 'True! Babies are born with about 270 to 300 soft bones, which fuse together over time to form 206 adult bones.'
      },
      {
        id: 'sc4',
        type: 'single',
        question: 'What is the chemical symbol for gold on the Periodic Table?',
        options: ['Au', 'Ag', 'Go', 'Gd'],
        correctAnswers: [0],
        hint: 'It comes from the Latin word "aurum," meaning shining dawn.',
        explanation: 'Gold’s symbol is Au (from Latin aurum), while Ag stands for silver (argentum).'
      },
      {
        id: 'sc5',
        type: 'multiple',
        question: 'Which of these are states of matter commonly found on Earth? (Select all that apply)',
        options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
        correctAnswers: [0, 1, 2, 3],
        hint: 'Lightning bolts and neon signs glow thanks to the fourth state!',
        explanation: 'All four—Solid, Liquid, Gas, and Plasma (found in lightning, flames, and stars)—are fundamental states of matter!'
      },
      {
        id: 'sc6',
        type: 'single',
        question: 'Which part of the human brain is primarily responsible for balance and coordination?',
        options: ['The cerebellum', 'The occipital lobe', 'The olfactory bulb', 'The cornea'],
        correctAnswers: [0],
        hint: 'Its name literally means "little brain" in Latin and sits at the back of the skull.',
        explanation: 'The cerebellum coordinates voluntary movements, posture, balance, and fine motor skills.'
      },
      {
        id: 'sc7',
        type: 'single',
        question: 'What force keeps planets orbiting around the Sun and keeps our feet on the ground?',
        options: ['Gravity', 'Magnetism', 'Friction', 'Static electricity'],
        correctAnswers: [0],
        hint: 'Sir Isaac Newton famously described its universal law.',
        explanation: 'Gravity is the attractive force between objects with mass, governing everything from falling apples to orbiting galaxies.'
      },
      {
        id: 'sc8',
        type: 'boolean',
        question: 'True or False: Water boils at a lower temperature on top of a high mountain than at sea level.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Air pressure decreases as altitude increases.',
        explanation: 'True! Because atmospheric pressure is lower at high elevations, water molecules escape into vapor more easily—boiling around 70°C (158°F) atop Mount Everest.'
      },
      {
        id: 'sc9',
        type: 'single',
        question: 'Which blood cells carry oxygen from the lungs to the rest of the body?',
        options: ['Red blood cells', 'White blood cells', 'Platelets', 'Neurons'],
        correctAnswers: [0],
        hint: 'They contain an iron-rich protein called hemoglobin.',
        explanation: 'Red blood cells use hemoglobin to bind oxygen in the lungs and deliver it to tissues throughout the body.'
      },
      {
        id: 'sc10',
        type: 'single',
        question: 'What does DNA stand for?',
        options: ['Deoxyribonucleic acid', 'Dynamic nuclear atom', 'Dual nitrogen alloy', 'Diurnal nerve agent'],
        correctAnswers: [0],
        hint: 'It’s the double-helix molecule that carries genetic instructions for all living things.',
        explanation: 'DNA stands for deoxyribonucleic acid, the hereditary blueprint inside nearly every cell.'
      }
    ]
  },
  {
    id: 'q-history',
    slug: 'ancient-civilizations-time-machine',
    title: 'Ancient Civilizations Time Machine',
    description: 'Journey back thousands of years to pyramids, pharaohs, inventors, and legendary empires!',
    intro: 'Set the dial on your chronometer for the distant past! Explore the engineering wonders of Ancient Egypt, Mesopotamia, Greece, Rome, and China.',
    categoryId: 'history',
    theme: 'history',
    difficulty: 'Medium',
    estimatedMinutes: 5,
    featured: false,
    trending: false,
    popularity: 88,
    createdAt: '2026-09-29',
    questions: [
      {
        id: 'h1',
        type: 'single',
        question: 'Which ancient civilization built the Great Pyramid of Giza?',
        options: ['Ancient Egypt', 'The Roman Empire', 'The Maya Civilization', 'Ancient Greece'],
        correctAnswers: [0],
        hint: 'It was constructed as a tomb for Pharaoh Khufu over 4,500 years ago.',
        explanation: 'The Great Pyramid of Giza was built in Egypt around 2560 BCE and remained the tallest human-made structure for over 3,800 years.'
      },
      {
        id: 'h2',
        type: 'single',
        question: 'What writing system did the ancient Sumerians of Mesopotamia invent using wedge-shaped marks on clay tablets?',
        options: ['Cuneiform', 'Hieroglyphics', 'Cyrillic', 'Morse code'],
        correctAnswers: [0],
        hint: 'Scribes pressed a reed stylus into soft clay.',
        explanation: 'Cuneiform, developed in Mesopotamia around 3200 BCE, is one of humanity’s earliest known systems of writing.'
      },
      {
        id: 'h3',
        type: 'boolean',
        question: 'True or False: The Great Wall of China is a single continuous wall built all at once by one emperor.',
        options: ['True', 'False'],
        correctAnswers: [1],
        hint: 'It was built in sections across many dynasties over more than two millennia!',
        explanation: 'False! The Great Wall is a vast network of walls, trenches, and watchtowers built and connected by multiple Chinese dynasties over centuries.'
      },
      {
        id: 'h4',
        type: 'single',
        question: 'Which ancient Greek city-state is widely considered the birthplace of democracy?',
        options: ['Athens', 'Sparta', 'Corinth', 'Thebes'],
        correctAnswers: [0],
        hint: 'Citizens gathered on the Pnyx hill to vote directly on laws.',
        explanation: 'In the 5th century BCE, Athens established demokratia ("rule by the people"), laying foundations for modern democratic governance.'
      },
      {
        id: 'h5',
        type: 'multiple',
        question: 'Which of these famous inventions originated in Ancient China? (Select all that apply)',
        options: ['Papermaking', 'The magnetic compass', 'Printing press / woodblock printing', 'The steam locomotive'],
        correctAnswers: [0, 1, 2],
        hint: 'Three of the "Four Great Inventions" of ancient China are listed here!',
        explanation: 'Papermaking, the magnetic compass, printing, and gunpowder are celebrated as the Four Great Inventions of ancient China.'
      },
      {
        id: 'h6',
        type: 'single',
        question: 'What was the name of the stone slab discovered in 1799 that helped scholars finally decode Egyptian hieroglyphs?',
        options: ['The Rosetta Stone', 'The Blarney Stone', 'The Philosopher’s Stone', 'The Code of Hammurabi'],
        correctAnswers: [0],
        hint: 'It contained the same royal decree carved in three scripts: Hieroglyphic, Demotic, and Ancient Greek.',
        explanation: 'The Rosetta Stone provided the key for Jean-François Champollion to decipher Egyptian hieroglyphs in 1822.'
      },
      {
        id: 'h7',
        type: 'single',
        question: 'Which Inca citadel sits high in the Andes Mountains of Peru and was built in the 15th century?',
        options: ['Machu Picchu', 'Chichen Itza', 'Petra', 'Angkor Wat'],
        correctAnswers: [0],
        hint: 'Its name means "Old Peak" in the Quechua language.',
        explanation: 'Machu Picchu was constructed around 1450 CE by the Inca Empire using mortar-free dry-stone masonry.'
      },
      {
        id: 'h8',
        type: 'boolean',
        question: 'True or False: Roman aqueducts used gravity to transport fresh water across miles of valleys and hills into cities.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Engineers sloped the channels gently downward by just a few inches every hundred feet.',
        explanation: 'True! Roman engineers mastered precise downward gradients so water flowed naturally for miles into fountains, baths, and homes.'
      },
      {
        id: 'h9',
        type: 'single',
        question: 'Who was the famous Macedonian ruler who created one of the largest empires in the ancient world before turning 33?',
        options: ['Alexander the Great', 'Julius Caesar', 'King Tutankhamun', 'Hammurabi'],
        correctAnswers: [0],
        hint: 'He was tutored as a youth by the philosopher Aristotle.',
        explanation: 'Alexander the Great conquered an empire stretching from Greece to Egypt and northwest India by 323 BCE.'
      },
      {
        id: 'h10',
        type: 'single',
        question: 'What material gave its name to the historical era following the Stone Age, when humans learned to alloy copper and tin?',
        options: ['Bronze', 'Iron', 'Titanium', 'Steel'],
        correctAnswers: [0],
        hint: 'Copper + tin = this durable golden-brown metal!',
        explanation: 'The Bronze Age began around 3300 BCE when metalworkers discovered that smelting copper with tin produced stronger bronze tools and weapons.'
      }
    ]
  },
  {
    id: 'q-nature',
    slug: 'rainforests-and-ocean-ecosystems',
    title: 'Rainforests & Ocean Ecosystems',
    description: 'Dive into coral reefs and trek beneath emerald rainforest canopies to discover Earth’s biodiversity!',
    intro: 'From glowing deep-sea creatures to towering kapok trees teeming with life, Earth’s ecosystems are interconnected marvels. How much do you know about our planet’s wild habitats?',
    categoryId: 'nature',
    theme: 'nature',
    difficulty: 'Easy',
    estimatedMinutes: 4,
    featured: false,
    trending: true,
    popularity: 90,
    createdAt: '2026-10-18',
    questions: [
      {
        id: 'n1',
        type: 'single',
        question: 'Which coral reef system off the coast of Australia is the largest in the world?',
        options: ['The Great Barrier Reef', 'The Belize Barrier Reef', 'The Red Sea Coral Reef', 'The Florida Reef'],
        correctAnswers: [0],
        hint: 'It stretches over 2,300 kilometers and can even be seen from space!',
        explanation: 'The Great Barrier Reef is composed of over 2,900 individual reefs and 900 islands in the Coral Sea.'
      },
      {
        id: 'n2',
        type: 'boolean',
        question: 'True or False: Coral reefs are made of rocks and plants, not living animals.',
        options: ['True', 'False'],
        correctAnswers: [1],
        hint: 'Corals are actually colonies of tiny invertebrate animals related to jellyfish!',
        explanation: 'False! Corals are living marine animals called polyps that secrete calcium carbonate skeletons to build reefs.'
      },
      {
        id: 'n3',
        type: 'single',
        question: 'What are the four main vertical layers of a tropical rainforest from bottom to top?',
        options: ['Forest floor, understory, canopy, emergent layer', 'Tundra, taiga, steppe, savanna', 'Crust, mantle, outer core, inner core', 'Sunlight, twilight, midnight, abyss'],
        correctAnswers: [0],
        hint: 'The tallest giant trees poke out into the "emergent" layer above the dense canopy roof.',
        explanation: 'Tropical rainforests are structured into the dark forest floor, shady understory, lush canopy, and sunlit emergent layer.'
      },
      {
        id: 'n4',
        type: 'single',
        question: 'What phenomenon allows deep-sea creatures like anglerfish and comb jellies to produce their own light?',
        options: ['Bioluminescence', 'Photosynthesis', 'Evaporation', 'Echolocation'],
        correctAnswers: [0],
        hint: 'It comes from a chemical reaction inside living organisms.',
        explanation: 'Bioluminescence is light produced by a chemical reaction in living organisms, used in the deep ocean to attract prey, camouflage, or communicate.'
      },
      {
        id: 'n5',
        type: 'multiple',
        question: 'Why are mangrove forests so vital to tropical coastlines? (Select all that apply)',
        options: ['They protect shorelines from storm waves and erosion', 'They serve as nurseries for young fish and crabs', 'They store massive amounts of carbon', 'They grow on top of snowy glaciers'],
        correctAnswers: [0, 1, 2],
        hint: 'Mangroves thrive in warm coastal saltwater, not glaciers!',
        explanation: 'Mangroves are coastal superheroes: their tangled roots buffer storm surges, shelter juvenile marine life, and trap huge amounts of "blue carbon."'
      },
      {
        id: 'n6',
        type: 'single',
        question: 'Which gentle marine mammal is sometimes called a "sea cow" and grazes on underwater seagrass beds?',
        options: ['Manatee', 'Narwhal', 'Orca', 'Sea otter'],
        correctAnswers: [0],
        hint: 'They are slow-moving herbivores found in warm coastal rivers and bays.',
        explanation: 'Manatees (and their cousins, dugongs) are herbivorous marine mammals that graze peacefully on seagrass.'
      },
      {
        id: 'n7',
        type: 'single',
        question: 'What percentage of Earth’s surface is covered by oceans?',
        options: ['About 71%', 'About 30%', 'About 50%', 'About 92%'],
        correctAnswers: [0],
        hint: 'That is why Earth is famously called the "Blue Marble"!',
        explanation: 'Roughly 71% of Earth’s surface is covered by ocean water, holding about 97% of all water on our planet.'
      },
      {
        id: 'n8',
        type: 'boolean',
        question: 'True or False: Trees in a forest can share nutrients and send chemical warning signals through underground fungal networks.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Scientists sometimes nickname this symbiotic web the "Wood Wide Web"!',
        explanation: 'True! Mycorrhizal fungi connect tree roots underground, allowing trees to exchange water, carbon, and defense signals.'
      },
      {
        id: 'n9',
        type: 'single',
        question: 'Which rainforest is the largest tropical rainforest on Earth?',
        options: ['The Amazon Rainforest', 'The Congo Rainforest', 'The Daintree Rainforest', 'The Tongass Rainforest'],
        correctAnswers: [0],
        hint: 'It spans nine nations in South America, led by Brazil.',
        explanation: 'The Amazon Rainforest covers over 5.5 million square kilometers and is home to roughly 10% of all known species on Earth.'
      },
      {
        id: 'n10',
        type: 'single',
        question: 'What do we call an animal that plays such a critical role in an ecosystem that the whole habitat would dramatically change without it (like sea otters or wolves)?',
        options: ['Keystone species', 'Invasive species', 'Nocturnal species', 'Domesticated species'],
        correctAnswers: [0],
        hint: 'Named after the central wedge-shaped stone that holds an arch together!',
        explanation: 'A keystone species has a disproportionately large effect on its environment relative to its abundance.'
      }
    ]
  },
  {
    id: 'q-food',
    slug: 'global-flavors-and-culinary-science',
    title: 'Global Flavors & Culinary Science',
    description: 'Explore delicious dishes from around the globe and the fascinating science bubbling in your kitchen!',
    intro: 'Bon appétit! Discover where your favorite foods originated, why bread rises, and the surprising botanical secrets behind everyday ingredients.',
    categoryId: 'food-drinks',
    theme: 'food',
    difficulty: 'Easy',
    estimatedMinutes: 4,
    featured: false,
    trending: false,
    popularity: 86,
    createdAt: '2026-10-03',
    questions: [
      {
        id: 'f1',
        type: 'single',
        question: 'From which tropical tree’s roasted seeds (beans) is chocolate made?',
        options: ['The cacao tree', 'The coffee shrub', 'The vanilla orchid', 'The coconut palm'],
        correctAnswers: [0],
        hint: 'Its scientific name, Theobroma cacao, translates to "food of the gods."',
        explanation: 'Chocolate is crafted from fermented, roasted, and ground seeds from the pods of the cacao tree, native to the Americas.'
      },
      {
        id: 'f2',
        type: 'boolean',
        question: 'True or False: Botanically speaking, bananas are berries, while strawberries are not.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Botanical berries develop from a single flower with one ovary and have seeds inside!',
        explanation: 'True! Botanically, bananas, kiwis, and watermelons are berries, whereas strawberries are "accessory fruits" with seeds on the outside.'
      },
      {
        id: 'f3',
        type: 'single',
        question: 'Which microorganism makes bread dough rise by producing tiny bubbles of carbon dioxide gas?',
        options: ['Yeast', 'Chlorophyll', 'Gelatin', 'Baking soda crystals'],
        correctAnswers: [0],
        hint: 'It’s a helpful single-celled fungus that feeds on sugars in flour.',
        explanation: 'Baker’s yeast ferments sugars in dough, releasing carbon dioxide gas bubbles that get trapped in gluten and make bread light and airy.'
      },
      {
        id: 'f4',
        type: 'single',
        question: 'Which country is the birthplace of pizza Margherita, named in 1889 with red tomatoes, white mozzarella, and green basil?',
        options: ['Italy', 'Spain', 'Greece', 'France'],
        correctAnswers: [0],
        hint: 'The toppings famously matched the three colors of this nation’s flag!',
        explanation: 'Pizza Margherita was created in Naples, Italy, featuring tomatoes, mozzarella, and basil.'
      },
      {
        id: 'f5',
        type: 'single',
        question: 'What is the world’s most expensive spice by weight, harvested from the delicate crimson stigmas of a crocus flower?',
        options: ['Saffron', 'Cinnamon', 'Cardamom', 'Turmeric'],
        correctAnswers: [0],
        hint: 'It takes around 75,000 hand-picked blossoms to produce just one pound!',
        explanation: 'Saffron threads are hand-harvested from Crocus sativus flowers, giving dishes a golden hue and floral aroma.'
      },
      {
        id: 'f6',
        type: 'multiple',
        question: 'Which of the following foods are naturally rich sources of Vitamin C? (Select all that apply)',
        options: ['Oranges', 'Bell peppers', 'Strawberries', 'Table salt'],
        correctAnswers: [0, 1, 2],
        hint: 'Colorful fruits and vegetables are packed with this essential nutrient!',
        explanation: 'Oranges, bell peppers (which actually have more Vitamin C per gram than oranges!), and strawberries are all rich in Vitamin C.'
      },
      {
        id: 'f7',
        type: 'single',
        question: 'What is the main ingredient in traditional Japanese miso soup paste?',
        options: ['Fermented soybeans', 'Mashed sweet potatoes', 'Crushed almonds', 'Seaweed powder'],
        correctAnswers: [0],
        hint: 'Often fermented with rice or barley and a beneficial culture called koji.',
        explanation: 'Miso is a traditional Japanese seasoning paste produced by fermenting soybeans with salt and koji.'
      },
      {
        id: 'f8',
        type: 'boolean',
        question: 'True or False: Pure honey stored in a sealed jar can remain edible for thousands of years without spoiling.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Archaeologists have even found preserved pots of honey in ancient Egyptian tombs!',
        explanation: 'True! Honey’s low moisture content and natural acidity prevent bacteria from growing, giving it an almost indefinite shelf life.'
      },
      {
        id: 'f9',
        type: 'single',
        question: 'Which fruit is known as the "king of fruits" in Southeast Asia and is famous for its spiky shell and powerful aroma?',
        options: ['Durian', 'Mango', 'Dragon fruit', 'Papaya'],
        correctAnswers: [0],
        hint: 'It’s so fragrant that it is banned on many subways and hotels in Southeast Asia!',
        explanation: 'Durian is prized for its rich, custard-like flesh despite its famously strong scent.'
      },
      {
        id: 'f10',
        type: 'single',
        question: 'What is the fifth basic taste alongside sweet, sour, salty, and bitter—often described as savory or brothy?',
        options: ['Umami', 'Spicy', 'Minty', 'Crunchy'],
        correctAnswers: [0],
        hint: 'Discovered by Japanese chemist Kikunae Ikeda in 1908, found in tomatoes, mushrooms, and aged cheese.',
        explanation: 'Umami (Japanese for "pleasant savory taste") is triggered by glutamates in foods like ripe tomatoes, mushrooms, and broth.'
      }
    ]
  },
  {
    id: 'q-sports',
    slug: 'champions-and-world-sports',
    title: 'Champions & World Sports Trivia',
    description: 'Step onto the stadium pitch, Olympic track, and championship court to score big!',
    intro: 'On your mark, get set, go! Whether you love soccer, basketball, tennis, or the Olympic Games, test your athletic knowledge across global sports.',
    categoryId: 'sports',
    theme: 'sports',
    difficulty: 'Easy',
    estimatedMinutes: 4,
    featured: false,
    trending: false,
    popularity: 85,
    createdAt: '2026-09-22',
    questions: [
      {
        id: 'sp1',
        type: 'single',
        question: 'How many interlocking rings appear on the official Olympic flag?',
        options: ['Five', 'Four', 'Six', 'Seven'],
        correctAnswers: [0],
        hint: 'They are blue, yellow, black, green, and red on a white background, representing the union of the five inhabited continents.',
        explanation: 'The five interlocking Olympic rings symbolize the athletes of the five continents coming together in friendly competition.'
      },
      {
        id: 'sp2',
        type: 'single',
        question: 'In soccer (association football), how many players from one team are allowed on the field at the same time?',
        options: ['11', '9', '10', '12'],
        correctAnswers: [0],
        hint: 'Ten outfield players plus one goalkeeper.',
        explanation: 'Each soccer team fields 11 players, including the goalkeeper.'
      },
      {
        id: 'sp3',
        type: 'boolean',
        question: 'True or False: In tennis, a score of zero points in a game is called "love."',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Players announce "15-love" when the server wins the first point.',
        explanation: 'True! In tennis scoring, zero is called "love," likely derived from the French word l’œuf ("the egg"), resembling a zero.'
      },
      {
        id: 'sp4',
        type: 'single',
        question: 'Which country hosted the 2024 Summer Olympic Games?',
        options: ['France (Paris)', 'Japan (Tokyo)', 'Brazil (Rio de Janeiro)', 'United Kingdom (London)'],
        correctAnswers: [0],
        hint: 'The opening ceremony took place along the River Seine!',
        explanation: 'Paris, France hosted the 2024 Summer Olympics, marking 100 years since Paris previously hosted the Games in 1924.'
      },
      {
        id: 'sp5',
        type: 'single',
        question: 'In basketball, how many points is a shot worth when made from beyond the arc?',
        options: ['3 points', '2 points', '4 points', '1 point'],
        correctAnswers: [0],
        hint: 'Regular field goals inside the arc are worth 2 points.',
        explanation: 'A field goal shot with both feet behind the three-point line earns 3 points.'
      },
      {
        id: 'sp6',
        type: 'multiple',
        question: 'Which of the following are the four Grand Slam tournaments in professional tennis? (Select all that apply)',
        options: ['Wimbledon', 'French Open (Roland Garros)', 'US Open', 'Australian Open'],
        correctAnswers: [0, 1, 2, 3],
        hint: 'All four are played each year on grass, clay, and hard courts!',
        explanation: 'The Australian Open, French Open, Wimbledon, and US Open form the four prestigious Grand Slam events in tennis.'
      },
      {
        id: 'sp7',
        type: 'single',
        question: 'What is the standard distance of a marathon race?',
        options: ['42.195 kilometers (26.2 miles)', '10 kilometers (6.2 miles)', '21.1 kilometers (13.1 miles)', '100 kilometers (62.1 miles)'],
        correctAnswers: [0],
        hint: 'Inspired by the ancient Greek messenger Pheidippides.',
        explanation: 'A full marathon is officially 42.195 kilometers (26 miles, 385 yards).'
      },
      {
        id: 'sp8',
        type: 'single',
        question: 'In which sport do athletes use a broom to sweep the ice in front of a sliding granite stone?',
        options: ['Curling', 'Ice hockey', 'Bobsleigh', 'Speed skating'],
        correctAnswers: [0],
        hint: 'Often called "chess on ice," originating in 16th-century Scotland.',
        explanation: 'In curling, sweeping melts a microscopic film of water on the ice, reducing friction to help the stone travel farther and curl less.'
      },
      {
        id: 'sp9',
        type: 'boolean',
        question: 'True or False: Table tennis (ping-pong) is an official Olympic sport.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'It debuted at the 1988 Seoul Summer Olympics!',
        explanation: 'True! Table tennis has been part of every Summer Olympic Games since 1988.'
      },
      {
        id: 'sp10',
        type: 'single',
        question: 'How many players are on a standard volleyball court for one team during play?',
        options: ['6', '5', '7', '9'],
        correctAnswers: [0],
        hint: 'Three in the front row and three in the back row.',
        explanation: 'Indoor volleyball is played with 6 players per team on the court at once.'
      }
    ]
  },
  {
    id: 'q-cinema',
    slug: 'cinema-magic-and-musical-legends',
    title: 'Cinema Magic & Musical Legends',
    description: 'Lights, camera, music! Explore movie-making illusions, symphony instruments, and rhythmic trivia.',
    intro: 'Take your front-row seat! Discover how animated films come to life frame by frame and test your ear for orchestral instruments and musical history.',
    categoryId: 'movies-music',
    theme: 'cinema',
    difficulty: 'Easy',
    estimatedMinutes: 4,
    featured: false,
    trending: false,
    popularity: 84,
    createdAt: '2026-09-18',
    questions: [
      {
        id: 'cm1',
        type: 'single',
        question: 'How many individual still images (frames) per second are typically shown in modern cinema to create smooth motion?',
        options: ['24 frames per second', '4 frames per second', '100 frames per second', '2 frames per second'],
        correctAnswers: [0],
        hint: 'This frame rate became the standard when sound films ("talkies") arrived in the late 1920s.',
        explanation: 'Standard theatrical motion pictures project at 24 frames per second (fps), which the human brain perceives as fluid movement.'
      },
      {
        id: 'cm2',
        type: 'single',
        question: 'How many keys are on a standard full-sized acoustic piano?',
        options: ['88 keys', '64 keys', '104 keys', '72 keys'],
        correctAnswers: [0],
        hint: '52 white keys and 36 black keys!',
        explanation: 'A standard full-size piano has 88 keys spanning seven octaves plus a minor third.'
      },
      {
        id: 'cm3',
        type: 'boolean',
        question: 'True or False: A "Foley artist" in filmmaking creates everyday sound effects like footsteps, creaking doors, and rustling clothes.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Named after sound-effects pioneer Jack Foley!',
        explanation: 'True! Foley artists perform and record custom sound effects in a studio while watching the film to make scenes sound crisp and realistic.'
      },
      {
        id: 'cm4',
        type: 'single',
        question: 'To which instrument family does the violin belong?',
        options: ['Strings', 'Woodwinds', 'Brass', 'Percussion'],
        correctAnswers: [0],
        hint: 'Played with a horsehair bow drawn across four tuned strings.',
        explanation: 'The violin is the smallest and highest-pitched member of the orchestral string family.'
      },
      {
        id: 'cm5',
        type: 'multiple',
        question: 'Which of the following are traditional woodwind instruments? (Select all that apply)',
        options: ['Flute', 'Clarinet', 'Oboe', 'Trombone'],
        correctAnswers: [0, 1, 2],
        hint: 'The trombone is made of brass and uses a slide!',
        explanation: 'Flutes, clarinets, oboes, and bassoons belong to the woodwind family, while trombones belong to the brass family.'
      },
      {
        id: 'cm6',
        type: 'single',
        question: 'In music notation, what does the Italian tempo marking "Allegro" instruct musicians to play?',
        options: ['Fast, bright, and lively', 'Very slowly and solemnly', 'Completely silently', 'Gradually fading away'],
        correctAnswers: [0],
        hint: 'The Italian word literally translates to "cheerful" or "brisk."',
        explanation: 'Allegro directs performers to play at a fast, upbeat tempo.'
      },
      {
        id: 'cm7',
        type: 'single',
        question: 'What color screen is most commonly used behind actors for digital visual effects (chroma keying) because it contrasts sharply with human skin tones?',
        options: ['Bright green (or blue)', 'Bright orange', 'Pure white', 'Charcoal gray'],
        correctAnswers: [0],
        hint: 'It’s famously called a "green screen"!',
        explanation: 'Bright green and blue screens are easiest for computers to isolate cleanly without accidentally erasing skin tones.'
      },
      {
        id: 'cm8',
        type: 'boolean',
        question: 'True or False: Stop-motion animation brings physical puppets or clay figures to life by photographing them one tiny pose at a time.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'A single 90-minute stop-motion movie can require over 125,000 individual photos!',
        explanation: 'True! Animators slightly adjust physical models between each photographed frame to create seamless movement.'
      },
      {
        id: 'cm9',
        type: 'single',
        question: 'What is the highest female singing voice range in classical music?',
        options: ['Soprano', 'Alto', 'Tenor', 'Bass'],
        correctAnswers: [0],
        hint: 'Above mezzo-soprano and contralto.',
        explanation: 'Soprano is the highest vocal range in choral and operatic music.'
      },
      {
        id: 'cm10',
        type: 'single',
        question: 'What is the name of the person who leads an orchestra using hand gestures and a baton?',
        options: ['The conductor', 'The choreographer', 'The cinematographer', 'The curator'],
        correctAnswers: [0],
        hint: 'They keep all sections in unified tempo and expressive balance.',
        explanation: 'The conductor guides tempo, dynamics, and interpretation for the entire orchestra.'
      }
    ]
  },
  {
    id: 'q-tech',
    slug: 'future-tech-ai-and-computing',
    title: 'Future Tech: AI, Coding & Computing',
    description: 'Decode binary numbers, algorithms, robotics, and the inventions powering our digital world!',
    intro: 'Boot up your brain! From the pioneers of computer programming to how artificial intelligence learns patterns, test your tech literacy.',
    categoryId: 'technology',
    theme: 'tech',
    difficulty: 'Medium',
    estimatedMinutes: 5,
    featured: false,
    trending: true,
    popularity: 93,
    createdAt: '2026-10-28',
    questions: [
      {
        id: 't1',
        type: 'single',
        question: 'What are the only two digits used in the binary number system that computers rely on at their hardware level?',
        options: ['0 and 1', '1 and 2', '0 and 9', 'A and B'],
        correctAnswers: [0],
        hint: 'They represent electrical "off" and "on" states.',
        explanation: 'Computers process information using binary digits ("bits") represented as 0s and 1s.'
      },
      {
        id: 't2',
        type: 'single',
        question: 'Who is widely celebrated as the world’s first computer programmer for writing an algorithm for Charles Babbage’s Analytical Engine in the 1840s?',
        options: ['Ada Lovelace', 'Marie Curie', 'Grace Hopper', 'Katherine Johnson'],
        correctAnswers: [0],
        hint: 'She was an English mathematician and daughter of poet Lord Byron.',
        explanation: 'Ada Lovelace recognized that computing machines could manipulate symbols beyond mere numbers and published the first algorithm intended for a machine.'
      },
      {
        id: 't3',
        type: 'boolean',
        question: 'True or False: In computing, "HTML" stands for HyperText Markup Language.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'It provides the structural skeleton for web pages across the internet.',
        explanation: 'True! HTML (HyperText Markup Language) structures headings, paragraphs, links, and media on the World Wide Web.'
      },
      {
        id: 't4',
        type: 'single',
        question: 'What is a step-by-step set of instructions designed to solve a problem or complete a task in computer science?',
        options: ['An algorithm', 'A pixel', 'A firewall', 'A router'],
        correctAnswers: [0],
        hint: 'Like a precise recipe that a computer follows from start to finish.',
        explanation: 'An algorithm is a well-defined sequence of logical steps used to perform calculations or process data.'
      },
      {
        id: 't5',
        type: 'multiple',
        question: 'Which of the following are considered computer INPUT devices? (Select all that apply)',
        options: ['Keyboard', 'Computer mouse', 'Microphone', 'Monitor screen'],
        correctAnswers: [0, 1, 2],
        hint: 'A monitor displays output to the user rather than sending user actions into the computer.',
        explanation: 'Keyboards, mice, and microphones send data into a computer (input), whereas monitors and speakers deliver output.'
      },
      {
        id: 't6',
        type: 'single',
        question: 'How many bits make up one standard "byte" of digital information?',
        options: ['8 bits', '4 bits', '10 bits', '16 bits'],
        correctAnswers: [0],
        hint: 'Eight binary digits can represent 256 different values (such as a single text character).',
        explanation: 'One byte consists of 8 bits.'
      },
      {
        id: 't7',
        type: 'single',
        question: 'What does "GPS" stand for in navigation technology?',
        options: ['Global Positioning System', 'General Packet Service', 'Geothermal Power Station', 'Graphic Pixel Standard'],
        correctAnswers: [0],
        hint: 'It uses a constellation of orbiting satellites to pinpoint your location on Earth.',
        explanation: 'GPS stands for Global Positioning System, triangulating signals from multiple satellites to determine exact coordinates.'
      },
      {
        id: 't8',
        type: 'boolean',
        question: 'True or False: Rear Admiral Grace Hopper helped popularize the term "debugging" after an actual moth was found stuck inside an early computer relay in 1947.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'The moth was taped right into the Harvard Mark II logbook!',
        explanation: 'True! Engineers removed a moth trapped in a relay of the Harvard Mark II computer and taped it into the logbook with the note: "First actual case of bug being found."'
      },
      {
        id: 't9',
        type: 'single',
        question: 'What does "CPU" stand for—often called the "brain" of a computer?',
        options: ['Central Processing Unit', 'Computer Power Utility', 'Core Pixel Unit', 'Control Program User'],
        correctAnswers: [0],
        hint: 'It executes instructions and performs billions of calculations per second.',
        explanation: 'The Central Processing Unit (CPU) carries out program instructions and coordinates hardware operations.'
      },
      {
        id: 't10',
        type: 'single',
        question: 'Which wireless technology uses short-range radio waves to connect headphones, keyboards, and smartwatches to phones?',
        options: ['Bluetooth', 'Fiber optics', 'Ethernet cable', 'Infrared laser'],
        correctAnswers: [0],
        hint: 'Named after 10th-century Scandinavian king Harald "Bluetooth" Gormsson!',
        explanation: 'Bluetooth enables low-power, short-range wireless communication between personal devices.'
      }
    ]
  },
  {
    id: 'q-math',
    slug: 'brain-teasers-and-number-puzzles',
    title: 'Brain Teasers & Number Puzzles',
    description: 'Flex your logic muscles with geometry, prime numbers, patterns, and clever math riddles!',
    intro: 'No calculator needed—just sharp logic and curiosity! Solve visual geometry puzzles, uncover famous number sequences, and conquer playful math challenges.',
    categoryId: 'mathematics',
    theme: 'math',
    difficulty: 'Hard',
    estimatedMinutes: 6,
    featured: false,
    trending: false,
    popularity: 87,
    createdAt: '2026-10-05',
    questions: [
      {
        id: 'm1',
        type: 'image',
        diagramId: 'triangle-angles',
        question: 'The interior angles of every triangle add up to 180°. Looking at this right triangle (90° and 35°), what is the missing angle (?)?',
        options: ['55°', '65°', '45°', '90°'],
        correctAnswers: [0],
        hint: 'Subtract 90° + 35° (125°) from 180°!',
        explanation: '180° − 90° − 35° = 55°. In any right triangle, the two acute angles always sum to 90°.'
      },
      {
        id: 'm2',
        type: 'single',
        question: 'What is the only even prime number?',
        options: ['2', '0', '4', '8'],
        correctAnswers: [0],
        hint: 'Every other even number can be divided evenly by 2.',
        explanation: '2 is the smallest and only even prime number because its only positive divisors are 1 and 2.'
      },
      {
        id: 'm3',
        type: 'single',
        question: 'What comes next in the famous Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, ___?',
        options: ['21', '18', '20', '26'],
        correctAnswers: [0],
        hint: 'Each number is the sum of the two numbers right before it (8 + 13)!',
        explanation: 'In the Fibonacci sequence, each term equals the sum of the two preceding terms: 8 + 13 = 21.'
      },
      {
        id: 'm4',
        type: 'boolean',
        question: 'True or False: A polygon with eight straight sides is called an octagon.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Just like a standard red stop sign or an octopus’s eight arms!',
        explanation: 'True! "Octo-" means eight, so an eight-sided polygon is an octagon.'
      },
      {
        id: 'm5',
        type: 'single',
        question: 'If a bat and a ball together cost $1.10, and the bat costs $1.00 more than the ball, how much does the ball cost?',
        options: ['$0.05 (5 cents)', '$0.10 (10 cents)', '$0.15 (15 cents)', '$0.01 (1 cent)'],
        correctAnswers: [0],
        hint: 'Careful! If the ball were 10¢, the bat ($1.10) + ball ($0.10) would total $1.20.',
        explanation: 'If the ball costs $0.05 and the bat costs $1.05 ($1.00 more), their total is $0.05 + $1.05 = $1.10!'
      },
      {
        id: 'm6',
        type: 'multiple',
        question: 'Which of the following numbers are perfect squares? (Select all that apply)',
        options: ['16', '49', '81', '30'],
        correctAnswers: [0, 1, 2],
        hint: 'A perfect square is an integer multiplied by itself (4×4, 7×7, 9×9).',
        explanation: '16 (4²), 49 (7²), and 81 (9²) are all perfect squares, whereas 30 is not.'
      },
      {
        id: 'm7',
        type: 'single',
        question: 'What is the Roman numeral "XL" equal to in standard Arabic numerals?',
        options: ['40', '60', '90', '110'],
        correctAnswers: [0],
        hint: 'Placing X (10) before L (50) means 50 minus 10.',
        explanation: 'In Roman numerals, XL = 50 − 10 = 40 (whereas LX = 60).'
      },
      {
        id: 'm8',
        type: 'single',
        question: 'What is the perimeter of a square whose area is 36 square centimeters?',
        options: ['24 cm', '12 cm', '36 cm', '18 cm'],
        correctAnswers: [0],
        hint: 'First find the length of one side (√36 = 6 cm), then multiply by 4 sides!',
        explanation: 'A square with area 36 cm² has sides of 6 cm each. Its perimeter is 4 × 6 cm = 24 cm.'
      },
      {
        id: 'm9',
        type: 'boolean',
        question: 'True or False: Pi (π) is an irrational number whose decimal digits go on forever without repeating.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: '3.14159265358979...',
        explanation: 'True! Pi (the ratio of a circle’s circumference to its diameter) is irrational and has been calculated to over 100 trillion non-repeating digits.'
      },
      {
        id: 'm10',
        type: 'single',
        question: 'How many faces does a standard cube (like a six-sided die) have?',
        options: ['6', '8', '12', '4'],
        correctAnswers: [0],
        hint: 'A cube has 6 square faces, 12 edges, and 8 vertices.',
        explanation: 'A cube is a regular hexahedron with 6 flat square faces.'
      }
    ]
  },
  {
    id: 'q-kids',
    slug: 'junior-explorers-general-knowledge',
    title: 'Junior Explorers: Super General Knowledge',
    description: 'A colorful, joyful mix of animals, rainbows, seasons, and awesome everyday wonders for curious minds!',
    intro: 'Calling all junior explorers! Dive into 10 bright, fun questions covering colors, animals, Earth, and science. Can you earn a gold star score?',
    categoryId: 'kids-learning',
    theme: 'kids',
    difficulty: 'Easy',
    estimatedMinutes: 3,
    featured: false,
    trending: true,
    popularity: 95,
    createdAt: '2026-10-29',
    questions: [
      {
        id: 'k1',
        type: 'single',
        question: 'How many legs does a spider have?',
        options: ['8 legs', '6 legs', '10 legs', '4 legs'],
        correctAnswers: [0],
        hint: 'Insects have 6 legs, while arachnids like spiders have two more!',
        explanation: 'Spiders are arachnids and have 8 legs, unlike insects which have 6.'
      },
      {
        id: 'k2',
        type: 'single',
        question: 'What is the fastest land animal in the world?',
        options: ['The cheetah', 'The lion', 'The kangaroo', 'The ostrich'],
        correctAnswers: [0],
        hint: 'This spotted big cat can sprint up to 112 km/h (70 mph) in short bursts!',
        explanation: 'Cheetahs are the fastest land mammals, accelerating from 0 to 60 mph in just a few seconds.'
      },
      {
        id: 'k3',
        type: 'boolean',
        question: 'True or False: Caterpillars transform into butterflies or moths inside a chrysalis or cocoon.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'This amazing transformation is called metamorphosis!',
        explanation: 'True! During metamorphosis, a caterpillar forms a chrysalis (for butterflies) or cocoon (for moths) and emerges with wings.'
      },
      {
        id: 'k4',
        type: 'single',
        question: 'Which planet do we live on?',
        options: ['Earth', 'Mars', 'Venus', 'Saturn'],
        correctAnswers: [0],
        hint: 'It’s the third planet from the Sun and the only one known to have liquid oceans on its surface.',
        explanation: 'Planet Earth is our home—the third rock from the Sun!'
      },
      {
        id: 'k5',
        type: 'multiple',
        question: 'Which of these colors are the three primary colors of paint/pigment? (Select all that apply)',
        options: ['Red', 'Yellow', 'Blue', 'Green'],
        correctAnswers: [0, 1, 2],
        hint: 'You mix yellow and blue together to make green!',
        explanation: 'Red, yellow, and blue are the traditional primary colors used in art to mix secondary colors like green, orange, and purple.'
      },
      {
        id: 'k6',
        type: 'single',
        question: 'What is a baby kangaroo called?',
        options: ['A joey', 'A cub', 'A calf', 'A foal'],
        correctAnswers: [0],
        hint: 'It snuggles inside its mother’s warm pouch as it grows!',
        explanation: 'Baby kangaroos (and other marsupials like koalas) are called joeys.'
      },
      {
        id: 'k7',
        type: 'single',
        question: 'How many continents are there on Earth?',
        options: ['7', '5', '9', '3'],
        correctAnswers: [0],
        hint: 'Asia, Africa, North America, South America, Antarctica, Europe, and Australia.',
        explanation: 'There are 7 continents on Earth!'
      },
      {
        id: 'k8',
        type: 'boolean',
        question: 'True or False: Honeybees communicate the direction and distance of flowers to their hive by doing a "waggle dance."',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'They dance in a figure-eight pattern!',
        explanation: 'True! Honeybees perform a figure-eight waggle dance whose angle and duration tell other bees where to find nectar.'
      },
      {
        id: 'k9',
        type: 'single',
        question: 'What causes a rainbow to appear in the sky?',
        options: ['Sunlight shining through raindrops', 'Colored paint falling from clouds', 'Moonlight bouncing off snow', 'Lightning bolts'],
        correctAnswers: [0],
        hint: 'Raindrops act like tiny glass prisms splitting white sunlight into seven colors!',
        explanation: 'When sunlight enters raindrops, it refracts (bends), reflects off the back of the drop, and splits into red, orange, yellow, green, blue, indigo, and violet.'
      },
      {
        id: 'k10',
        type: 'single',
        question: 'Which giant ocean animal is the largest creature ever known to have lived on Earth?',
        options: ['The blue whale', 'The great white shark', 'The woolly mammoth', 'The giant squid'],
        correctAnswers: [0],
        hint: 'Its heart alone can be as heavy as a small car!',
        explanation: 'The Antarctic blue whale can grow up to 30 meters (98 feet) long and weigh as much as 200 tons—larger than any known dinosaur!'
      }
    ]
  },
  {
    id: 'q-fairytale',
    slug: 'enchanted-folklore-and-mythical-realms',
    title: 'Enchanted Folklore & Mythical Realms',
    description: 'Step into timeless fairytales, woodland fables, and mythical legends from storybooks around the world!',
    intro: 'Once upon a time in a kingdom of wonder... Explore classic folklore, magical creatures, and the real-world castles and traditions that inspired storybook tales!',
    categoryId: 'enchanted-kingdoms',
    theme: 'fairytale',
    difficulty: 'Easy',
    estimatedMinutes: 4,
    featured: true,
    trending: true,
    popularity: 96,
    createdAt: '2026-10-30',
    questions: [
      {
        id: 'ft1',
        type: 'single',
        question: 'In classic European folklore, what kind of magical footwear does a young maiden leave behind on the palace staircase at the stroke of midnight?',
        options: ['A glass slipper', 'A winged sandal', 'A silver boot', 'A wooden clog'],
        correctAnswers: [0],
        hint: 'In Charles Perrault’s 1697 fairytale, it was made of delicate glass ("pantoufle de verre").',
        explanation: 'In Charles Perrault’s classic fairytale, the heroine leaves behind a fragile glass slipper as the clock strikes twelve.'
      },
      {
        id: 'ft2',
        type: 'single',
        question: 'In Aesop’s famous fable, which slow-and-steady animal wins a race against a boastful, fast-running hare?',
        options: ['The tortoise', 'The hedgehog', 'The snail', 'The badger'],
        correctAnswers: [0],
        hint: '"Slow and steady wins the race!"',
        explanation: 'In Aesop’s fable "The Tortoise and the Hare," the persistent tortoise overtakes the overconfident hare who stopped for a nap.'
      },
      {
        id: 'ft3',
        type: 'boolean',
        question: 'True or False: In ancient mythology, a phoenix is a legendary bird that is reborn from its own ashes.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'It symbolizes renewal, resilience, and the rising sun.',
        explanation: 'True! Across ancient Greek, Egyptian, and Persian legends, the radiant phoenix cyclically regenerates from ashes.'
      },
      {
        id: 'ft4',
        type: 'single',
        question: 'According to traditional Scandinavian folklore, what kind of friendly miniature creatures wear pointed red caps and look after farmsteads?',
        options: ['Tomte (or Nisse)', 'Minotaurs', 'Gorgons', 'Krakens'],
        correctAnswers: [0],
        hint: 'They love a bowl of warm porridge with butter on winter nights!',
        explanation: 'In Nordic folklore, a Tomte or Nisse is a helpful household guardian spirit known for protecting farms and animals.'
      },
      {
        id: 'ft5',
        type: 'multiple',
        question: 'Which of these objects are classic magical motifs found across world fairytales? (Select all that apply)',
        options: ['A wishing well', 'A magic mirror', 'Seven-league boots', 'A microwave oven'],
        correctAnswers: [0, 1, 2],
        hint: 'One of these is a modern kitchen appliance!',
        explanation: 'Wishing wells, enchanted mirrors, and seven-league boots (which let the wearer stride seven leagues per step) are classic folklore tropes.'
      },
      {
        id: 'ft6',
        type: 'single',
        question: 'In Japanese folklore, what tiny boy—no taller than a thumb—sails down a river in a soup bowl using a chopstick as an oar?',
        options: ['Issun-bōshi ("One-Inch Boy")', 'Momotarō ("Peach Boy")', 'Urashima Tarō', 'Kintarō'],
        correctAnswers: [0],
        hint: 'His name literally means "One-Sun (One-Inch) Boy"!',
        explanation: 'Issun-bōshi is a beloved Japanese fairytale hero who uses a sewing needle as a sword and a bowl as a boat.'
      },
      {
        id: 'ft7',
        type: 'single',
        question: 'In the fairytale "Jack and the Beanstalk," what does Jack trade his family’s cow for?',
        options: ['A handful of magic beans', 'A golden compass', 'A singing harp', 'Three silver coins'],
        correctAnswers: [0],
        hint: 'Overnight, they sprout into a gigantic vine reaching above the clouds!',
        explanation: 'Jack trades the cow for magic beans, which grow into a sky-piercing beanstalk overnight.'
      },
      {
        id: 'ft8',
        type: 'boolean',
        question: 'True or False: The real-world Neuschwanstein Castle in Bavaria, Germany inspired the romantic look of many fairytale castles.',
        options: ['True', 'False'],
        correctAnswers: [0],
        hint: 'Perched dramatically on a rugged Alpine hill with soaring white limestone towers!',
        explanation: 'True! Commissioned by King Ludwig II in 1869, Neuschwanstein Castle’s turrets and mountain backdrop became the quintessential inspiration for storybook castles.'
      },
      {
        id: 'ft9',
        type: 'single',
        question: 'In West African and Caribbean folklore, what clever trickster spider is famous for outsmarting much larger animals through wit and storytelling?',
        options: ['Anansi', 'Puck', 'Merlin', 'Baba Yaga'],
        correctAnswers: [0],
        hint: 'His stories originated among the Akan people of Ghana.',
        explanation: 'Anansi the Spider is a celebrated folklore hero whose cleverness triumphs over brute strength.'
      },
      {
        id: 'ft10',
        type: 'single',
        question: 'In Hans Christian Andersen’s classic tale "The Ugly Duckling," what graceful bird does the duckling grow up to be?',
        options: ['A white swan', 'A peacock', 'A golden eagle', 'A flamingo'],
        correctAnswers: [0],
        hint: 'It glides serenely across the lake in spring!',
        explanation: 'Published in 1843, Andersen’s story reveals that the misunderstood duckling was actually a majestic swan all along.'
      }
    ]
  }
];

// ============================================================================
// 5. CONFETTI CELEBRATION COMPONENT (Lightweight Canvas Effect)
// ============================================================================
const ConfettiBurst = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#fde047'];
    const particles = Array.from({ length: 110 }, () => ({
      x: canvas.width * (0.2 + Math.random() * 0.6),
      y: canvas.height * 0.35,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 14 - 4,
      size: 6 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      gravity: 0.35 + Math.random() * 0.15
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (frame < 180) {
        animId = requestAnimationFrame(render);
      }
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

// ============================================================================
// 6. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Theme & Sound state persisted in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('wq_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem('wq_muted') === 'true';
    } catch {
      return false;
    }
  });

  // Custom Quizzes (for CMS Studio) + Built-in Quizzes
  const [customQuizzes, setCustomQuizzes] = useState(() => {
    try {
      const saved = localStorage.getItem('wq_custom_quizzes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allQuizzes = useMemo(() => [...customQuizzes, ...INITIAL_QUIZZES], [customQuizzes]);

  // Favorites & Progress History in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('wq_favorites');
      return saved ? JSON.parse(saved) : ['q-panda', 'q-space'];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('wq_history');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Navigation / Routing state (supports hash URLs like #/quiz/all-things-panda)
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  // Filtering state on /quizzes page
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [homeTab, setHomeTab] = useState('popular');

  // Sync dark mode & sound
  useEffect(() => {
    try {
      localStorage.setItem('wq_dark_mode', String(darkMode));
    } catch {}
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    sound.muted = muted;
    try {
      localStorage.setItem('wq_muted', String(muted));
    } catch {}
  }, [muted]);

  useEffect(() => {
    try {
      localStorage.setItem('wq_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('wq_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('wq_custom_quizzes', JSON.stringify(customQuizzes));
    } catch {}
  }, [customQuizzes]);

  // Hash route listener
  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.replace(/^#/, '') || '/';
      setRoute(h);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((path) => {
    sound.click();
    window.location.hash = path;
    setRoute(path);
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    setQuickSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleFavorite = (e, quizId) => {
    if (e) e.stopPropagation();
    sound.click();
    setFavorites((prev) =>
      prev.includes(quizId) ? prev.filter((id) => id !== quizId) : [...prev, quizId]
    );
  };

  const launchRandomQuiz = () => {
    sound.click();
    const randomQuiz = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
    navigate(`/quiz/${randomQuiz.slug}`);
  };

  const recordQuizCompletion = (quizId, score, total, timeSeconds) => {
    const pct = Math.round((score / total) * 100);
    setHistory((prev) => {
      const existing = prev[quizId];
      const bestPct = existing ? Math.max(existing.bestPct, pct) : pct;
      const bestScore = existing ? Math.max(existing.bestScore, score) : score;
      return {
        ...prev,
        [quizId]: {
          bestScore,
          bestPct,
          total,
          lastPlayed: Date.now(),
          attempts: (existing?.attempts || 0) + 1,
          lastTimeSeconds: timeSeconds
        }
      };
    });
  };

  // Update dynamic document title for SEO
  useEffect(() => {
    if (route.startsWith('/quiz/')) {
      const slug = route.replace('/quiz/', '');
      const q = allQuizzes.find((item) => item.slug === slug);
      document.title = q ? `${q.title} | WonderQuest Interactive Quizzes` : 'Quiz | WonderQuest';
    } else if (route.startsWith('/category/')) {
      const catId = route.replace('/category/', '');
      const c = CATEGORIES.find((item) => item.id === catId);
      document.title = c ? `${c.name} Quizzes | WonderQuest` : 'Categories | WonderQuest';
    } else if (route === '/quizzes') {
      document.title = 'Explore All Quizzes | WonderQuest';
    } else {
      document.title = 'WonderQuest — Interactive Educational Quizzes & Trivia Adventures';
    }
  }, [route, allQuizzes]);

  // Filtered quizzes for /quizzes route
  const filteredQuizzes = useMemo(() => {
    let list = [...allQuizzes];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          CATEGORIES.find((c) => c.id === item.categoryId)?.name.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.categoryId === selectedCategory);
    }
    if (selectedDifficulty !== 'all') {
      list = list.filter((item) => item.difficulty === selectedDifficulty);
    }
    if (onlyFavorites) {
      list = list.filter((item) => favorites.includes(item.id));
    }
    if (sortBy === 'popular') {
      list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [allQuizzes, searchTerm, selectedCategory, selectedDifficulty, onlyFavorites, sortBy, favorites]);

  const recentlyPlayedQuizzes = useMemo(() => {
    return Object.entries(history)
      .sort((a, b) => b[1].lastPlayed - a[1].lastPlayed)
      .map(([id, stats]) => ({ quiz: allQuizzes.find((q) => q.id === id), stats }))
      .filter((entry) => entry.quiz);
  }, [history, allQuizzes]);

  // ==========================================================================
  // REUSABLE QUIZ CARD COMPONENT
  // ==========================================================================
  const QuizCard = ({ quiz }) => {
    const category = CATEGORIES.find((c) => c.id === quiz.categoryId) || CATEGORIES[0];
    const isFav = favorites.includes(quiz.id);
    const record = history[quiz.id];

    const diffColors = {
      Easy: 'bg-emerald-500/90 text-white',
      Medium: 'bg-amber-500/90 text-white',
      Hard: 'bg-rose-500/90 text-white'
    };

    return (
      <article
        onClick={() => navigate(`/quiz/${quiz.slug}`)}
        className="group cursor-pointer bg-white dark:bg-slate-800/90 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
      >
        {/* Artwork Thumbnail */}
        <div className="relative h-44 sm:h-48 overflow-hidden">
          <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
            <QuizArtwork theme={quiz.theme} className="w-full h-full" />
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm backdrop-blur-md ${diffColors[quiz.difficulty] || diffColors.Easy}`}>
              {quiz.difficulty}
            </span>

            <button
              type="button"
              aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
              onClick={(e) => toggleFavorite(e, quiz.id)}
              className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-transform active:scale-90 ${
                isFav
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/85 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Personal Best Score Pill */}
          {record && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              Best: {record.bestPct}%
            </div>
          )}

          {/* Question Count Pill */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold">
            {quiz.questions.length} Qs
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${category.badge}`}>
                <span>{category.icon}</span>
                {category.name}
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
              {quiz.title}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
              {quiz.description}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> ~{quiz.estimatedMinutes} min
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-extrabold shadow-sm transition-all">
              Play Now <Play className="w-3.5 h-3.5 fill-current" />
            </span>
          </div>
        </div>
      </article>
    );
  };

  // ==========================================================================
  // HEADER NAVIGATION BAR
  // ==========================================================================
  const Header = () => (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 p-0.5 shadow-md group-hover:rotate-6 transition-transform">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-amber-300 dark:via-orange-400 dark:to-pink-400 bg-clip-text text-transparent">
              WonderQuest
            </span>
            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-1">
              Explore • Play • Learn
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
              route === '/'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setOnlyFavorites(false);
              navigate('/quizzes');
            }}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
              route === '/quizzes'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Quizzes
          </button>

          {/* Categories Mega Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCategoriesDropdownOpen(true)}
            onMouseLeave={() => setCategoriesDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCategoriesDropdownOpen((v) => !v)}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-colors ${
                route.startsWith('/category/')
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Categories
              <ChevronRight className={`w-4 h-4 transition-transform ${categoriesDropdownOpen ? 'rotate-90' : ''}`} />
            </button>

            {categoriesDropdownOpen && (
              <div className="absolute left-0 top-full pt-2 w-[560px] z-50">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 grid grid-cols-2 gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => navigate(`/category/${cat.id}`)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/about')}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
              route === '/about'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => navigate('/contact')}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
              route === '/contact'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search Trigger */}
          <button
            type="button"
            aria-label="Search quizzes"
            onClick={() => {
              sound.click();
              setQuickSearchOpen(true);
            }}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Random Quiz Quick Button */}
          <button
            type="button"
            onClick={launchRandomQuiz}
            title="Surprise Random Quiz"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/70 text-xs font-extrabold transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden md:inline">Random</span>
          </button>

          {/* Favorites Shortcut */}
          <button
            type="button"
            aria-label="Saved Favorites"
            onClick={() => {
              setOnlyFavorites(true);
              setSelectedCategory('all');
              navigate('/quizzes');
            }}
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            onClick={() => setMuted((m) => !m)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => {
              sound.click();
              setDarkMode((d) => !d);
            }}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="lg:hidden p-2.5 rounded-xl bg-indigo-600 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-5 space-y-4 max-h-[82vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold text-sm text-left flex items-center gap-2 text-slate-900 dark:text-white"
            >
              <HomeIcon className="w-4 h-4 text-indigo-500" /> Home
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setOnlyFavorites(false);
                navigate('/quizzes');
              }}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold text-sm text-left flex items-center gap-2 text-slate-900 dark:text-white"
            >
              <Grid className="w-4 h-4 text-emerald-500" /> All Quizzes
            </button>
            <button
              type="button"
              onClick={launchRandomQuiz}
              className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/40 font-bold text-sm text-left flex items-center gap-2 text-amber-900 dark:text-amber-200"
            >
              <Shuffle className="w-4 h-4" /> Random Quiz
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/40 font-bold text-sm text-left flex items-center gap-2 text-purple-900 dark:text-purple-200"
            >
              <Plus className="w-4 h-4" /> Quiz Studio
            </button>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Browse 16 Categories
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-left text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500">
            <button type="button" onClick={() => navigate('/about')}>About Us</button>
            <button type="button" onClick={() => navigate('/contact')}>Contact</button>
            <button type="button" onClick={() => navigate('/privacy')}>Privacy</button>
            <button type="button" onClick={() => navigate('/terms')}>Terms</button>
          </div>
        </div>
      )}
    </header>
  );

  // ==========================================================================
  // QUICK SEARCH MODAL
  // ==========================================================================
  const QuickSearchModal = () => {
    if (!quickSearchOpen) return null;
    const matches = allQuizzes.filter((q) =>
      q.title.toLowerCase().includes(quickSearchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(quickSearchQuery.toLowerCase())
    );

    return (
      <div
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4"
        onClick={() => setQuickSearchOpen(false)}
      >
        <div
          className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-indigo-500" />
            <input
              type="text"
              autoFocus
              value={quickSearchQuery}
              onChange={(e) => setQuickSearchQuery(e.target.value)}
              placeholder="Search pandas, space, capitals, math, fairytales..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base font-medium"
            />
            <button
              type="button"
              onClick={() => setQuickSearchOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto p-3 space-y-1.5">
            {matches.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-500">
                No quizzes found matching "{quickSearchQuery}"
              </p>
            ) : (
              matches.map((quiz) => {
                const cat = CATEGORIES.find((c) => c.id === quiz.categoryId);
                return (
                  <button
                    key={quiz.id}
                    type="button"
                    onClick={() => navigate(`/quiz/${quiz.slug}`)}
                    className="w-full p-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-colors"
                  >
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{quiz.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {cat?.icon} {cat?.name} • {quiz.questions.length} Questions • {quiz.difficulty}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // VIEW 1: HOMEPAGE
  // ==========================================================================
  const HomeView = () => {
    const featuredQuizzes = allQuizzes.filter((q) => q.featured).slice(0, 4);
    const spotlightQuiz = allQuizzes[0];

    const discoveryQuizzes = useMemo(() => {
      if (homeTab === 'popular') return [...allQuizzes].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
      if (homeTab === 'trending') return allQuizzes.filter((q) => q.trending).slice(0, 6);
      if (homeTab === 'latest') return [...allQuizzes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
      return [...allQuizzes].sort(() => 0.5 - Math.random()).slice(0, 6);
    }, [homeTab, allQuizzes]);

    return (
      <div className="space-y-16 pb-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          {/* Animated Floating Decorative Shapes */}
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl animate-pulse" />
          <div className="absolute bottom-10 right-16 w-48 h-48 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />

          <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-extrabold text-amber-200">
                <Sparkles className="w-4 h-4" />
                140+ Interactive Brain Adventures • Free & Instant Play
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Curiosity Unlocked.{' '}
                <span className="text-amber-300">Play, Discover</span> & Master the World!
              </h1>

              <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Dive into interactive wildlife expeditions, space missions, world geography challenges, and brain-teasing puzzles crafted for curious explorers of all ages.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/quizzes')}
                  className="px-7 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                >
                  Explore Quizzes <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={launchRandomQuiz}
                  className="px-6 py-4 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white font-extrabold text-base transition-all flex items-center gap-2"
                >
                  <Shuffle className="w-5 h-5 text-amber-300" /> Surprise Me!
                </button>
              </div>

              {/* Quick Trust Stats */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-bold text-indigo-100/90">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> 16 Subject Worlds</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-300" /> Instant Fact Explanations</span>
                <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-pink-300" /> Tracks Best Scores</span>
              </div>
            </div>

            {/* Featured Quiz Spotlight Card */}
            <div className="lg:col-span-5">
              <div
                onClick={() => navigate(`/quiz/${spotlightQuiz.slug}`)}
                className="cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-white/30 hover:scale-[1.02] transition-transform"
              >
                <div className="relative rounded-2xl overflow-hidden h-48 sm:h-52 mb-4">
                  <QuizArtwork theme={spotlightQuiz.theme} className="w-full h-full" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow">
                    <Flame className="w-3.5 h-3.5" /> Quiz of the Day
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  <span>🐼 Animals & Wildlife</span>
                  <span>{spotlightQuiz.questions.length} Questions</span>
                </div>
                <h2 className="text-xl font-black mb-2">{spotlightQuiz.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                  {spotlightQuiz.description}
                </p>
                <button
                  type="button"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  Start Featured Quiz <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RECENTLY PLAYED SHELF (Only shown if user has played quizzes) */}
        {recentlyPlayedQuizzes.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <RotateCcw className="w-6 h-6 text-indigo-500" /> Continue Your Adventure
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pick up where you left off or beat your personal high score!
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentlyPlayedQuizzes.slice(0, 4).map(({ quiz, stats }) => (
                <div
                  key={quiz.id}
                  onClick={() => navigate(`/quiz/${quiz.slug}`)}
                  className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-all flex items-center gap-3.5 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <QuizArtwork theme={quiz.theme} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-extrabold">
                        Best: {stats.bestPct}%
                      </span>
                      <span className="text-xs text-slate-400">
                        {stats.attempts} {stats.attempts === 1 ? 'play' : 'plays'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FEATURED QUIZZES SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Editor’s Picks
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Featured Interactive Quizzes
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/quizzes')}
              className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View All Quizzes <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </section>

        {/* ALL 16 CATEGORIES GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-pink-600 dark:text-pink-400">
              16 Worlds of Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Explore Quizzes by Category
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
              Choose your favorite topic—from wild rainforest creatures and cosmic astronomy to brain-bending math and enchanted folklore.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const count = allQuizzes.filter((q) => q.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className={`group relative overflow-hidden rounded-3xl p-5 text-left text-white bg-gradient-to-br ${cat.color} shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform origin-left">
                    {cat.icon}
                  </div>
                  <h3 className="font-black text-base sm:text-lg leading-tight mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/85 line-clamp-2 mb-3">
                    {cat.desc}
                  </p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/20 text-[11px] font-bold">
                    {count > 0 ? `${count} ${count === 1 ? 'Quiz' : 'Quizzes'}` : 'Explore Topic'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* POPULAR / TRENDING / LATEST / RECOMMENDED DISCOVERY TABS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Discover More Adventures
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Handpicked trivia challenges updated regularly
              </p>
            </div>

            <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800 self-start">
              {[
                { id: 'popular', label: 'Popular', icon: Trophy },
                { id: 'trending', label: 'Trending', icon: Flame },
                { id: 'latest', label: 'Latest', icon: Sparkles },
                { id: 'recommended', label: 'For You', icon: Star }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      sound.click();
                      setHomeTab(tab.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all ${
                      homeTab === tab.id
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoveryQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </section>
      </div>
    );
  };

  // ==========================================================================
  // VIEW 2: ALL QUIZZES & SEARCH / FILTER EXPLORER
  // ==========================================================================
  const AllQuizzesView = ({ forcedCategoryId = null }) => {
    const activeCatId = forcedCategoryId || selectedCategory;
    const categoryObj = CATEGORIES.find((c) => c.id === activeCatId);

    const displayedQuizzes = useMemo(() => {
      if (!forcedCategoryId) return filteredQuizzes;
      return allQuizzes.filter((q) => {
        const matchesCat = q.categoryId === forcedCategoryId;
        const matchesSearch =
          !searchTerm.trim() ||
          q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
        return matchesCat && matchesSearch && matchesDiff;
      });
    }, [forcedCategoryId, filteredQuizzes, allQuizzes, searchTerm, selectedDifficulty]);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <button type="button" onClick={() => navigate('/')} className="hover:text-indigo-600">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white">
            {categoryObj ? categoryObj.name : 'All Quizzes'}
          </span>
        </nav>

        {/* Page Banner */}
        <div
          className={`rounded-3xl p-6 sm:p-10 text-white bg-gradient-to-r ${
            categoryObj ? categoryObj.color : 'from-indigo-600 via-purple-600 to-pink-600'
          } shadow-lg`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-4xl mb-2">{categoryObj ? categoryObj.icon : '🧭'}</div>
              <h1 className="text-3xl sm:text-4xl font-black">
                {categoryObj ? `${categoryObj.name} Quizzes` : 'Explore All Quizzes'}
              </h1>
              <p className="text-white/90 mt-2 max-w-2xl text-sm sm:text-base">
                {categoryObj
                  ? categoryObj.desc
                  : 'Search by topic, filter by difficulty level, or launch a surprise quiz!'}
              </p>
            </div>
            <button
              type="button"
              onClick={launchRandomQuiz}
              className="self-start md:self-center px-5 py-3 rounded-2xl bg-white text-slate-900 font-black text-sm shadow-md hover:bg-amber-300 transition-colors flex items-center gap-2 shrink-0"
            >
              <Shuffle className="w-4 h-4" /> Random Quiz
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="grid md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search quiz titles or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            {!forcedCategoryId && (
              <div className="md:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All 16 Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Difficulty Filter */}
            <div className={forcedCategoryId ? 'md:col-span-4' : 'md:col-span-2'}>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Sort By */}
            <div className={forcedCategoryId ? 'md:col-span-3' : 'md:col-span-2'}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="title">A – Z</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOnlyFavorites((v) => !v)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-colors ${
                  onlyFavorites
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
                Favorites Only ({favorites.length})
              </button>

              {(searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' || onlyFavorites) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setOnlyFavorites(false);
                    if (forcedCategoryId) navigate('/quizzes');
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Reset Filters
                </button>
              )}
            </div>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Showing {displayedQuizzes.length} {displayedQuizzes.length === 1 ? 'quiz' : 'quizzes'}
            </span>
          </div>
        </div>

        {/* Quiz Grid or Friendly Empty State */}
        {displayedQuizzes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <div className="text-5xl mb-3">🔭</div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              No Quizzes Matched Your Search
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
              {forcedCategoryId
                ? `We’re actively crafting brand-new ${categoryObj?.name} quizzes! Meanwhile, explore our full library of 140+ interactive questions.`
                : 'Try clearing your search filters or jump into a random quiz adventure!'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setOnlyFavorites(false);
                navigate('/quizzes');
              }}
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm shadow-md hover:bg-indigo-500"
            >
              Browse All Quizzes
            </button>
          </div>
        )}
      </div>
    );
  };

  // ==========================================================================
  // VIEW 3: INDIVIDUAL QUIZ PAGE (Intro -> Interactive Engine -> Results/Review)
  // ==========================================================================
  const QuizExperienceView = ({ slug }) => {
    const quiz = allQuizzes.find((q) => q.slug === slug);

    // Phase: 'intro' | 'playing' | 'results'
    const [phase, setPhase] = useState('intro');
    const [timerEnabled, setTimerEnabled] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [startTime, setStartTime] = useState(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [userAnswersLog, setUserAnswersLog] = useState([]);
    const [showReview, setShowReview] = useState(false);

    // Reset state if slug changes
    useEffect(() => {
      setPhase('intro');
      setCurrentIdx(0);
      setSelectedOptions([]);
      setIsAnswered(false);
      setShowHint(false);
      setUserAnswersLog([]);
      setShowReview(false);
    }, [slug]);

    const currentQuestion = quiz?.questions[currentIdx];

    // Countdown timer effect when enabled
    useEffect(() => {
      if (phase !== 'playing' || !timerEnabled || isAnswered || !currentQuestion) return;
      if (timeLeft <= 0) {
        // Time expired -> mark as incorrect/timed out
        sound.incorrect();
        setIsAnswered(true);
        setUserAnswersLog((prev) => [
          ...prev,
          {
            question: currentQuestion,
            selected: [],
            isCorrect: false,
            skipped: false,
            timedOut: true
          }
        ]);
        return;
      }
      const interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 6 && t > 1) sound.tick();
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }, [phase, timerEnabled, isAnswered, timeLeft, currentQuestion]);

    if (!quiz) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Quiz Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            That trail seems to have vanished! Let’s head back to the quiz map.
          </p>
          <button
            type="button"
            onClick={() => navigate('/quizzes')}
            className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm"
          >
            Explore All Quizzes
          </button>
        </div>
      );
    }

    const category = CATEGORIES.find((c) => c.id === quiz.categoryId) || CATEGORIES[0];
    const isFav = favorites.includes(quiz.id);
    const personalBest = history[quiz.id];
    const relatedQuizzes = allQuizzes
      .filter((q) => q.id !== quiz.id && (q.categoryId === quiz.categoryId || q.featured))
      .slice(0, 3);

    const startQuiz = () => {
      sound.click();
      setPhase('playing');
      setCurrentIdx(0);
      setSelectedOptions([]);
      setIsAnswered(false);
      setShowHint(false);
      setTimeLeft(30);
      setStartTime(Date.now());
      setUserAnswersLog([]);
      setShowReview(false);
    };

    const evaluateAnswer = (chosenIndices) => {
      if (isAnswered) return;
      const correctSet = [...currentQuestion.correctAnswers].sort((a, b) => a - b);
      const chosenSet = [...chosenIndices].sort((a, b) => a - b);
      const isCorrect =
        correctSet.length === chosenSet.length &&
        correctSet.every((val, index) => val === chosenSet[index]);

      if (isCorrect) {
        sound.correct();
      } else {
        sound.incorrect();
      }

      setSelectedOptions(chosenIndices);
      setIsAnswered(true);
      setUserAnswersLog((prev) => [
        ...prev,
        {
          question: currentQuestion,
          selected: chosenIndices,
          isCorrect,
          skipped: false,
          timedOut: false
        }
      ]);
    };

    const handleOptionClick = (idx) => {
      if (isAnswered) return;
      if (currentQuestion.type === 'multiple') {
        sound.click();
        setSelectedOptions((prev) =>
          prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
        );
      } else {
        // Immediate submission for Single Choice, True/False, and Image-Based questions
        evaluateAnswer([idx]);
      }
    };

    const handleSkipQuestion = () => {
      if (isAnswered) return;
      sound.click();
      setIsAnswered(true);
      setSelectedOptions([]);
      setUserAnswersLog((prev) => [
        ...prev,
        {
          question: currentQuestion,
          selected: [],
          isCorrect: false,
          skipped: true,
          timedOut: false
        }
      ]);
    };

    const handleNextQuestion = () => {
      sound.click();
      if (currentIdx + 1 < quiz.questions.length) {
        setCurrentIdx((i) => i + 1);
        setSelectedOptions([]);
        setIsAnswered(false);
        setShowHint(false);
        setTimeLeft(30);
      } else {
        const totalTime = Math.max(1, Math.round((Date.now() - startTime) / 1000));
        setElapsedSeconds(totalTime);
        const correctCount = userAnswersLog.filter((item) => item.isCorrect).length;
        recordQuizCompletion(quiz.id, correctCount, quiz.questions.length, totalTime);
        sound.fanfare();
        setPhase('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // ------------------------------------------------------------------------
    // PHASE A: QUIZ INTRODUCTION SCREEN
    // ------------------------------------------------------------------------
    if (phase === 'intro') {
      return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-12">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <button type="button" onClick={() => navigate('/')} className="hover:text-indigo-600">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button
              type="button"
              onClick={() => navigate(`/category/${category.id}`)}
              className="hover:text-indigo-600"
            >
              {category.name}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 dark:text-white truncate">{quiz.title}</span>
          </nav>

          {/* Main Intro Hero Card */}
          <div className="bg-white dark:bg-slate-800/95 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="relative h-60 sm:h-80">
              <QuizArtwork theme={quiz.theme} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              <button
                type="button"
                onClick={(e) => toggleFavorite(e, quiz.id)}
                className={`absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-md font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95 ${
                  isFav
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/90 text-slate-900 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                {isFav ? 'Saved' : 'Favorite'}
              </button>

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold mb-3">
                  <span>{category.icon}</span> {category.name}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                  {quiz.title}
                </h1>
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-6">
              {/* Metadata Pills */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> {quiz.questions.length} Questions
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-extrabold flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" /> Difficulty: {quiz.difficulty}
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> ~{quiz.estimatedMinutes} Minutes
                </span>
                {personalBest && (
                  <span className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs font-extrabold flex items-center gap-1.5">
                    <Trophy className="w-4 h-4" /> Your Best: {personalBest.bestPct}% ({personalBest.bestScore}/{personalBest.total})
                  </span>
                )}
              </div>

              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                {quiz.intro || quiz.description}
              </p>

              {/* Optional Pre-Game Mode Toggles */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Speed Challenge Timer (30s per question)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Turn on for extra arcade excitement or leave off for relaxed learning
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setTimerEnabled((v) => !v);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-colors ${
                    timerEnabled
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {timerEnabled ? 'Timer: ON' : 'Timer: OFF'}
                </button>
              </div>

              {/* Start Quiz CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  type="button"
                  onClick={startQuiz}
                  className="flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-lg shadow-xl shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                >
                  <Play className="w-6 h-6 fill-current" /> Start Quiz Now
                </button>
              </div>
            </div>
          </div>

          {/* Related Quizzes */}
          {relatedQuizzes.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                More Quizzes You’ll Love
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedQuizzes.map((rq) => (
                  <QuizCard key={rq.id} quiz={rq} />
                ))}
              </div>
            </section>
          )}
        </div>
      );
    }

    // ------------------------------------------------------------------------
    // PHASE B: INTERACTIVE QUIZ ENGINE
    // ------------------------------------------------------------------------
    if (phase === 'playing') {
      const progressPct = ((currentIdx + (isAnswered ? 1 : 0)) / quiz.questions.length) * 100;
      const latestLog = isAnswered ? userAnswersLog[userAnswersLog.length - 1] : null;
      const optionLetters = ['A', 'B', 'C', 'D', 'E'];

      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
          {/* Top Quiz Status Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPhase('intro')}
                className="text-xs font-extrabold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Quit Quiz
              </button>

              <span className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400">
                Question {currentIdx + 1} of {quiz.questions.length}
              </span>

              {timerEnabled ? (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
                    timeLeft <= 8
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" /> {timeLeft}s
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-400 truncate max-w-[140px]">
                  {quiz.title}
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div
            key={currentQuestion.id}
            className="bg-white dark:bg-slate-800/95 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 animate-[fadeIn_0.3s_ease-out]"
          >
            {/* Question Type Badge & Helper Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold">
                {currentQuestion.type === 'boolean' && 'True or False'}
                {currentQuestion.type === 'multiple' && 'Select All That Apply'}
                {currentQuestion.type === 'image' && 'Visual Challenge'}
                {currentQuestion.type === 'single' && 'Multiple Choice'}
              </span>

              <div className="flex items-center gap-2">
                {currentQuestion.hint && !isAnswered && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.click();
                      setShowHint((h) => !h);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-extrabold flex items-center gap-1 hover:bg-amber-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Need a Hint?'}
                  </button>
                )}

                {!isAnswered && (
                  <button
                    type="button"
                    onClick={handleSkipQuestion}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 hover:bg-slate-200 transition-colors"
                  >
                    Skip <SkipForward className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Question Prompt */}
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
              {currentQuestion.question}
            </h2>

            {/* Optional SVG Diagram for Image-Based Questions */}
            {currentQuestion.diagramId && (
              <div className="py-2">
                <QuestionVisualDiagram diagramId={currentQuestion.diagramId} />
              </div>
            )}

            {/* Collapsible Hint Box */}
            {showHint && !isAnswered && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm font-medium flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Hint:</strong> {currentQuestion.hint}</span>
              </div>
            )}

            {/* Answer Options */}
            <div
              className={`grid gap-3 ${
                currentQuestion.type === 'boolean' ? 'sm:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {currentQuestion.options.map((optionText, idx) => {
                const isSelected = selectedOptions.includes(idx);
                const isRightAnswer = currentQuestion.correctAnswers.includes(idx);

                let styleClass =
                  'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100';

                if (!isAnswered && isSelected) {
                  styleClass =
                    'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-600 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/30';
                } else if (isAnswered) {
                  if (isRightAnswer) {
                    styleClass =
                      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30';
                  } else if (isSelected && !isRightAnswer) {
                    styleClass =
                      'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-100';
                  } else {
                    styleClass =
                      'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-base transition-all flex items-center justify-between gap-3 active:scale-[0.99] ${styleClass}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          isAnswered && isRightAnswer
                            ? 'bg-emerald-500 text-white'
                            : isAnswered && isSelected && !isRightAnswer
                            ? 'bg-rose-500 text-white'
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {optionLetters[idx]}
                      </span>
                      <span>{optionText}</span>
                    </div>

                    {isAnswered && isRightAnswer && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isRightAnswer && (
                      <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit button for Multi-Select questions */}
            {currentQuestion.type === 'multiple' && !isAnswered && (
              <button
                type="button"
                disabled={selectedOptions.length === 0}
                onClick={() => evaluateAnswer(selectedOptions)}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-black text-base shadow-md transition-all"
              >
                Submit Selected Answers ({selectedOptions.length})
              </button>
            )}

            {/* Instant Feedback & Educational Explanation Card */}
            {isAnswered && latestLog && (
              <div
                className={`p-5 rounded-2xl border-2 space-y-3 ${
                  latestLog.isCorrect
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700'
                    : 'bg-amber-50/90 dark:bg-slate-900 border-amber-400 dark:border-amber-700'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-base">
                  {latestLog.isCorrect ? (
                    <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Awesome! That’s Correct!
                    </span>
                  ) : latestLog.skipped ? (
                    <span className="text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <SkipForward className="w-5 h-5" /> Question Skipped — Here’s the Scoop:
                    </span>
                  ) : latestLog.timedOut ? (
                    <span className="text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <Clock className="w-5 h-5" /> Time’s Up! Here’s the Scoop:
                    </span>
                  ) : (
                    <span className="text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <XCircle className="w-5 h-5" /> Not Quite! Let’s Explore Why:
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {currentQuestion.explanation}
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    {currentIdx + 1 < quiz.questions.length ? (
                      <>Next Question <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>See My Results <Trophy className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ------------------------------------------------------------------------
    // PHASE C: ANIMATED QUIZ RESULTS & FULL ANSWER REVIEW
    // ------------------------------------------------------------------------
    const correctCount = userAnswersLog.filter((a) => a.isCorrect).length;
    const skippedCount = userAnswersLog.filter((a) => a.skipped).length;
    const incorrectCount = quiz.questions.length - correctCount - skippedCount;
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);

    let tier = {
      title: 'Keep Exploring!',
      emoji: '🌱',
      color: 'from-amber-500 to-orange-600',
      message: 'Every great explorer starts with curiosity! Review the explanations below and try again to boost your score.'
    };
    if (percentage >= 90) {
      tier = {
        title: 'Legendary Mastermind!',
        emoji: '🏆',
        color: 'from-emerald-500 via-teal-500 to-cyan-600',
        message: 'Extraordinary! You conquered almost every single challenge with true explorer brilliance.'
      };
    } else if (percentage >= 70) {
      tier = {
        title: 'Brilliant Explorer!',
        emoji: '🌟',
        color: 'from-indigo-600 via-purple-600 to-pink-600',
        message: 'Fantastic job! You clearly know your stuff and uncovered tons of awesome facts.'
      };
    } else if (percentage >= 50) {
      tier = {
        title: 'Rising Adventurer!',
        emoji: '🧭',
        color: 'from-sky-500 to-indigo-600',
        message: 'Solid effort! You’re halfway to mastery—check out the review below and take another shot!'
      };
    }

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 pb-24 space-y-10">
        <ConfettiBurst active={percentage >= 70} />

        {/* Score Summary Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl">
          <div className={`p-8 sm:p-10 text-center text-white bg-gradient-to-br ${tier.color}`}>
            <div className="text-6xl mb-3 animate-bounce">{tier.emoji}</div>
            <span className="px-3.5 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest">
              Quiz Complete
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mt-3">{tier.title}</h1>
            <p className="text-white/90 max-w-xl mx-auto mt-2 text-sm sm:text-base">
              {tier.message}
            </p>

            {/* Big Animated Score Circle */}
            <div className="mt-7 inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-white text-slate-900 shadow-xl border-4 border-amber-300">
              <span className="text-4xl font-black text-indigo-600">{percentage}%</span>
              <span className="text-xs font-extrabold text-slate-500">
                {correctCount} of {quiz.questions.length} Correct
              </span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{correctCount}</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Correct</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{incorrectCount}</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Incorrect</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{skippedCount}</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Skipped</p>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{elapsedSeconds}s</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Time Taken</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={startQuiz}
                className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-md flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Restart Quiz
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setShowReview((r) => !r);
                }}
                className="px-6 py-3.5 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 hover:bg-amber-200 font-extrabold text-sm flex items-center gap-2 transition-all"
              >
                <Eye className="w-4 h-4" /> {showReview ? 'Hide Answer Review' : 'Review All Answers'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/quizzes')}
                className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-200 font-extrabold text-sm flex items-center gap-2 transition-all"
              >
                Play Another Quiz <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FULL QUESTION & ANSWER REVIEW LIST */}
        {showReview && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Detailed Question Review
            </h2>
            {userAnswersLog.map((entry, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Question {idx + 1}
                  </span>
                  {entry.isCorrect ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-extrabold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> {entry.skipped ? 'Skipped' : 'Incorrect'}
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  {entry.question.question}
                </h3>

                <div className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <span className="font-bold text-slate-500 block mb-0.5">Your Answer:</span>
                    <span className={`font-extrabold ${entry.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {entry.selected.length > 0
                        ? entry.selected.map((i) => entry.question.options[i]).join(', ')
                        : entry.skipped
                        ? 'Skipped'
                        : 'No answer'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                      Correct Answer:
                    </span>
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-200">
                      {entry.question.correctAnswers.map((i) => entry.question.options[i]).join(', ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-indigo-50/60 dark:bg-slate-900/70 p-3.5 rounded-xl">
                  <strong>Did You Know?</strong> {entry.question.explanation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Related Quizzes */}
        {relatedQuizzes.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Ready for Your Next Quest?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedQuizzes.map((rq) => (
                <QuizCard key={rq.id} quiz={rq} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };

  // ==========================================================================
  // VIEW 4: QUIZ STUDIO / ADMIN CMS PREVIEW (/admin)
  // ==========================================================================
  const AdminStudioView = () => {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('science');
    const [difficulty, setDifficulty] = useState('Easy');
    const [description, setDescription] = useState('');
    const [qPrompt, setQPrompt] = useState('');
    const [opt0, setOpt0] = useState('');
    const [opt1, setOpt1] = useState('');
    const [opt2, setOpt2] = useState('');
    const [opt3, setOpt3] = useState('');
    const [correctIdx, setCorrectIdx] = useState(0);
    const [explanation, setExplanation] = useState('');
    const [statusMsg, setStatusMsg] = useState('');

    const handleCreateQuiz = (e) => {
      e.preventDefault();
      if (!title.trim() || !qPrompt.trim() || !opt0.trim() || !opt1.trim()) {
        setStatusMsg('Please fill in the quiz title, question, and at least two options.');
        return;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);

      const themeMap = {
        'animals-wildlife': 'panda',
        'space-astronomy': 'space',
        geography: 'geography',
        'countries-capitals': 'capitals',
        science: 'science',
        history: 'history',
        nature: 'nature',
        'food-drinks': 'food',
        sports: 'sports',
        'movies-music': 'cinema',
        technology: 'tech',
        mathematics: 'math',
        'kids-learning': 'kids',
        'enchanted-kingdoms': 'fairytale'
      };

      const newQuiz = {
        id: 'custom-' + Date.now(),
        slug,
        title: title.trim(),
        description: description.trim() || 'A custom community quiz created in WonderQuest Studio!',
        intro: description.trim() || 'Test your knowledge with this custom-built WonderQuest quiz!',
        categoryId,
        theme: themeMap[categoryId] || 'science',
        difficulty,
        estimatedMinutes: 2,
        featured: false,
        trending: true,
        popularity: 95,
        createdAt: new Date().toISOString().slice(0, 10),
        questions: [
          {
            id: 'cq-' + Date.now(),
            type: 'single',
            question: qPrompt.trim(),
            options: [opt0.trim(), opt1.trim(), opt2.trim() || 'Option C', opt3.trim() || 'Option D'],
            correctAnswers: [Number(correctIdx)],
            hint: 'Think carefully about the clues in the question!',
            explanation: explanation.trim() || 'Great job completing this custom question!'
          }
        ]
      };

      sound.fanfare();
      setCustomQuizzes((prev) => [newQuiz, ...prev]);
      setTitle('');
      setDescription('');
      setQPrompt('');
      setOpt0('');
      setOpt1('');
      setOpt2('');
      setOpt3('');
      setExplanation('');
      setStatusMsg('Published! Your new quiz is now live across WonderQuest.');
    };

    const deleteCustomQuiz = (id) => {
      sound.click();
      setCustomQuizzes((prev) => prev.filter((q) => q.id !== id));
    };

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 space-y-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider">
            CMS Architecture Preview
          </span>
          <h1 className="text-3xl font-black mt-2">WonderQuest Creator Studio</h1>
          <p className="text-indigo-100 text-sm sm:text-base mt-1">
            Create, preview, and manage custom quizzes using WonderQuest’s modular JSON quiz schema (persisted locally & ready for Supabase).
          </p>
        </div>

        <form
          onSubmit={handleCreateQuiz}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5"
        >
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Create a New Quiz
          </h2>

          {statusMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-sm font-bold">
              {statusMsg}
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">
                Quiz Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Amazing Ocean Sharks"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary shown on quiz cards..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-4">
            <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase">
              Sample Question #1
            </h3>
            <input
              type="text"
              value={qPrompt}
              onChange={(e) => setQPrompt(e.target.value)}
              placeholder="Enter question prompt *"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={opt0}
                onChange={(e) => setOpt0(e.target.value)}
                placeholder="Option A *"
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
              <input
                type="text"
                value={opt1}
                onChange={(e) => setOpt1(e.target.value)}
                placeholder="Option B *"
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
              <input
                type="text"
                value={opt2}
                onChange={(e) => setOpt2(e.target.value)}
                placeholder="Option C"
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
              <input
                type="text"
                value={opt3}
                onChange={(e) => setOpt3(e.target.value)}
                placeholder="Option D"
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">
                  Correct Answer
                </label>
                <select
                  value={correctIdx}
                  onChange={(e) => setCorrectIdx(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-slate-500 uppercase mb-1">
                  Fact Explanation
                </label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Why is this answer right?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-md"
          >
            Publish Quiz to WonderQuest
          </button>
        </form>

        {/* Manage Custom Quizzes */}
        {customQuizzes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Your Custom Published Quizzes ({customQuizzes.length})
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {customQuizzes.map((cq) => (
                <div
                  key={cq.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white">{cq.title}</h3>
                    <p className="text-xs text-slate-500">{cq.difficulty} • {cq.questions.length} Qs</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/quiz/${cq.slug}`)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold"
                    >
                      Play
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCustomQuiz(cq.id)}
                      className="p-2 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================================================
  // VIEW 5: STATIC & INFORMATIONAL PAGES (About, Contact, Privacy, Terms)
  // ==========================================================================
  const InfoPageView = ({ type }) => {
    const [contactSent, setContactSent] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

    if (type === 'contact') {
      return (
        <div className="max-w-2xl mx-auto px-4 py-12 pb-20 space-y-6">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Contact WonderQuest</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Have a quiz topic suggestion, classroom feedback, or spotted an interesting fact? Drop us a note!
          </p>
          {contactSent ? (
            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-900 dark:text-emerald-200 space-y-3">
              <h2 className="text-xl font-black flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Message Received!
              </h2>
              <p className="text-sm">
                Thank you for reaching out to the WonderQuest editorial team. Keep exploring!
              </p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!contactForm.name.trim() || !contactForm.email.trim()) return;
                sound.correct();
                setContactSent(true);
              }}
              className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm"
            >
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-md"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      );
    }

    const contentMap = {
      about: {
        title: 'About WonderQuest',
        body: [
          'WonderQuest is an interactive educational quiz and discovery platform designed to spark lifelong curiosity in learners of all ages.',
          'Every quiz combines factually verified knowledge, custom vector illustrations, multi-format interactive questions, and instant "Did You Know?" explanations so every answer becomes a memorable learning moment.',
          'No account or sign-up is required—your favorite quizzes and personal best scores are saved privately right on your device.'
        ]
      },
      privacy: {
        title: 'Privacy Policy',
        body: [
          'WonderQuest respects learner privacy. You can play all quizzes without creating an account or sharing personal information.',
          'Quiz scores, favorite bookmarks, sound preferences, and dark/light theme settings are stored locally in your browser’s localStorage and never sold to third parties.'
        ]
      },
      terms: {
        title: 'Terms & Conditions',
        body: [
          'All educational quizzes, bespoke SVG illustrations, and explanatory texts on WonderQuest are provided for personal, family, and classroom learning.',
          'Users creating quizzes in the local Creator Studio remain responsible for the accuracy and appropriateness of their custom entries.'
        ]
      },
      disclaimer: {
        title: 'Educational Disclaimer',
        body: [
          'WonderQuest content is carefully researched for factual accuracy and age-appropriate clarity. All characters, illustrations, and stories are 100% original creations of WonderQuest.'
        ]
      }
    };

    const doc = contentMap[type] || contentMap.about;
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 pb-20 space-y-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{doc.title}</h1>
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 text-slate-700 dark:text-slate-200 leading-relaxed">
          {doc.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================================================
  // FOOTER
  // ==========================================================================
  const Footer = () => (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-black text-white">WonderQuest</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Interactive quizzes, visual brain teasers, and verified educational adventures across 16 worlds of discovery.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">Explore</h4>
          <ul className="space-y-2 text-xs font-semibold">
            <li><button type="button" onClick={() => navigate('/')} className="hover:text-amber-300">Home</button></li>
            <li><button type="button" onClick={() => navigate('/quizzes')} className="hover:text-amber-300">All Quizzes</button></li>
            <li><button type="button" onClick={launchRandomQuiz} className="hover:text-amber-300">Random Quiz</button></li>
            <li><button type="button" onClick={() => navigate('/admin')} className="hover:text-amber-300">Creator Studio (CMS)</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">Top Categories</h4>
          <ul className="space-y-2 text-xs font-semibold">
            <li><button type="button" onClick={() => navigate('/category/animals-wildlife')} className="hover:text-amber-300">Animals & Wildlife</button></li>
            <li><button type="button" onClick={() => navigate('/category/space-astronomy')} className="hover:text-amber-300">Space & Astronomy</button></li>
            <li><button type="button" onClick={() => navigate('/category/geography')} className="hover:text-amber-300">World Geography</button></li>
            <li><button type="button" onClick={() => navigate('/category/enchanted-kingdoms')} className="hover:text-amber-300">Enchanted Kingdoms</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">Information</h4>
          <ul className="space-y-2 text-xs font-semibold">
            <li><button type="button" onClick={() => navigate('/about')} className="hover:text-amber-300">About Us</button></li>
            <li><button type="button" onClick={() => navigate('/contact')} className="hover:text-amber-300">Contact Us</button></li>
            <li><button type="button" onClick={() => navigate('/privacy')} className="hover:text-amber-300">Privacy Policy</button></li>
            <li><button type="button" onClick={() => navigate('/terms')} className="hover:text-amber-300">Terms & Conditions</button></li>
            <li><button type="button" onClick={() => navigate('/disclaimer')} className="hover:text-amber-300">Disclaimer</button></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 px-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} WonderQuest Educational Platform. All original content & bespoke illustrations.
      </div>
    </footer>
  );

  // ==========================================================================
  // ROUTE DISPATCHER
  // ==========================================================================
  const renderCurrentRoute = () => {
    if (route === '/' || route === '') return <HomeView />;
    if (route === '/quizzes') return <AllQuizzesView />;
    if (route.startsWith('/category/')) {
      return <AllQuizzesView forcedCategoryId={route.replace('/category/', '')} />;
    }
    if (route.startsWith('/quiz/')) {
      return <QuizExperienceView slug={route.replace('/quiz/', '')} />;
    }
    if (route === '/admin') return <AdminStudioView />;
    if (route === '/about') return <InfoPageView type="about" />;
    if (route === '/contact') return <InfoPageView type="contact" />;
    if (route === '/privacy') return <InfoPageView type="privacy" />;
    if (route === '/terms') return <InfoPageView type="terms" />;
    if (route === '/disclaimer') return <InfoPageView type="disclaimer" />;
    return <HomeView />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors">
      <Header />
      <QuickSearchModal />
      <main className="flex-1">{renderCurrentRoute()}</main>
      <Footer />
    </div>
  );
}

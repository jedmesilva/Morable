import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Heart, Share2, Star, MapPin, BedDouble, Bath,
  Maximize2, Car, Wifi, Dumbbell, PawPrint, Wind, Shield,
  ChevronRight, Play, X, Check, Navigation2, Users, Calendar,
  Clock, TrendingUp, Zap, Home, Search, MessageCircle, User,
  Building2, CheckCircle2, AlertCircle, ChevronDown, Layers
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --bg: #0d1117;
    --surface: #131920;
    --surface2: #1a2230;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --gold: #c9a96e;
    --gold-dim: rgba(201,169,110,0.12);
    --gold-border: rgba(201,169,110,0.25);
    --blue: #4d7cfe;
    --blue-dim: rgba(77,124,254,0.12);
    --green: #3ecf8e;
    --green-dim: rgba(62,207,142,0.1);
    --red: #f66;
    --red-dim: rgba(255,102,102,0.1);
    --amber: #f5a623;
    --text: #fff;
    --text2: rgba(255,255,255,0.55);
    --text3: rgba(255,255,255,0.3);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  .app {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  /* HERO */
  .hero {
    position: relative;
    height: 340px;
    flex-shrink: 0;
    overflow: hidden;
    cursor: pointer;
  }

  .hero-img {
    position: absolute;
    inset: 0;
    background: linear-gradient(145deg, #1e3a5f 0%, #0e1f35 40%, #06111e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s ease;
  }
  .hero:hover .hero-img { transform: scale(1.03); }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.45) 0%,
      rgba(0,0,0,0.0) 35%,
      rgba(0,0,0,0.0) 55%,
      rgba(0,0,0,0.85) 100%
    );
  }

  .hero-tap-hint {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .hero:hover .hero-tap-hint { opacity: 1; }
  .hero-tap-pill {
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 30px;
    padding: 10px 20px;
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hero-top-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    padding: 52px 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }

  .back-btn {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
    color: #fff; cursor: pointer;
    transition: background 0.2s;
  }
  .back-btn:hover { background: rgba(0,0,0,0.7); }

  .hero-actions { display: flex; gap: 8px; }

  .hero-action-btn {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
    color: #fff; cursor: pointer;
    transition: all 0.2s;
  }
  .hero-action-btn:hover { background: rgba(0,0,0,0.7); }
  .hero-action-btn.saved { background: rgba(246,102,102,0.25); border-color: rgba(246,102,102,0.4); color: #f66; }

  .hero-bottom {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 16px 20px;
  }

  .hero-tag-row { display: flex; gap: 8px; margin-bottom: 10px; }

  .hero-tag {
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 10px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
  .hero-tag.available {
    background: rgba(62,207,142,0.18);
    border-color: rgba(62,207,142,0.35);
    color: var(--green);
  }

  .hero-price-row { display: flex; align-items: flex-end; justify-content: space-between; }
  .hero-price {
    font-family: 'Sora', sans-serif;
    font-size: 28px; font-weight: 800; color: #fff;
  }
  .hero-price span { font-size: 13px; font-weight: 400; color: rgba(255,255,255,0.55); margin-left: 2px; }

  .hero-rating {
    display: flex; align-items: center; gap: 5px;
    background: rgba(0,0,0,0.45); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px; padding: 5px 10px;
  }
  .hero-rating-val { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: #fff; }
  .hero-rating-count { font-size: 11px; color: rgba(255,255,255,0.45); }

  /* PHOTO COUNT */
  .photo-count-badge {
    position: absolute;
    bottom: 60px; right: 20px;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 4px 10px;
    font-size: 11px; color: rgba(255,255,255,0.7);
    display: flex; align-items: center; gap: 5px;
  }

  /* SCROLL CONTENT */
  .scroll-content {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    padding-bottom: 120px;
  }
  .scroll-content::-webkit-scrollbar { display: none; }

  /* TITLE SECTION */
  .title-section {
    padding: 20px 20px 0;
  }

  .prop-name {
    font-family: 'Sora', sans-serif;
    font-size: 22px; font-weight: 700; color: var(--text);
    margin-bottom: 6px;
  }

  .prop-location {
    display: flex; align-items: center; gap: 5px;
    font-size: 13px; color: var(--text2);
    margin-bottom: 16px;
  }

  .quick-stats {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 8px;
    margin-bottom: 20px;
  }

  .qs-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 12px 8px;
    text-align: center;
  }

  .qs-icon { color: var(--gold); margin-bottom: 5px; display: flex; justify-content: center; }
  .qs-val { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .qs-label { font-size: 9px; font-weight: 500; color: var(--text3); letter-spacing: 0.8px; text-transform: uppercase; }

  /* DIVIDER */
  .divider { height: 1px; background: var(--border); margin: 4px 20px; }

  /* SECTIONS */
  .section { padding: 20px 20px 0; }

  .section-title {
    font-family: 'Sora', sans-serif;
    font-size: 13px; font-weight: 600; color: var(--text3);
    letter-spacing: 1.2px; text-transform: uppercase;
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-title-line {
    flex: 1; height: 1px; background: var(--border);
  }

  /* GALLERY STRIP */
  .gallery-strip {
    display: flex; gap: 8px;
    overflow-x: auto; scrollbar-width: none;
    padding-bottom: 4px;
  }
  .gallery-strip::-webkit-scrollbar { display: none; }

  .gallery-thumb {
    flex-shrink: 0;
    width: 88px; height: 72px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    border: 1px solid var(--border);
    transition: transform 0.18s, border-color 0.18s;
  }
  .gallery-thumb:hover { transform: scale(1.04); border-color: var(--border2); }

  .gallery-thumb-bg {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .gt-1 { background: linear-gradient(135deg, #1a3a5c, #0a1e35); }
  .gt-2 { background: linear-gradient(135deg, #1a2e20, #0a1a10); }
  .gt-3 { background: linear-gradient(135deg, #2e1a1a, #1a0a0a); }
  .gt-4 { background: linear-gradient(135deg, #2e2a1a, #1a180a); }
  .gt-5 { background: linear-gradient(135deg, #1a1a2e, #0a0a1a); }

  .video-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
  }
  .play-icon {
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(255,255,255,0.9);
    display: flex; align-items: center; justify-content: center;
    color: #000;
  }

  .gallery-see-all {
    flex-shrink: 0; width: 88px; height: 72px;
    border-radius: 12px; border: 1px dashed rgba(255,255,255,0.15);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 4px; cursor: pointer; color: var(--text3);
    transition: border-color 0.2s, color 0.2s;
  }
  .gallery-see-all:hover { border-color: var(--gold); color: var(--gold); }
  .gallery-see-all-count { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; }
  .gallery-see-all-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px; }

  /* MATCH BREAKDOWN */
  .match-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 14px;
  }
  .match-score-big {
    display: flex; align-items: baseline; gap: 4px;
  }
  .match-number {
    font-family: 'Sora', sans-serif;
    font-size: 42px; font-weight: 800;
    background: linear-gradient(135deg, var(--green), #7effc0);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }
  .match-pct { font-size: 18px; font-weight: 600; color: var(--green); }
  .match-label { font-size: 11px; color: var(--text3); margin-top: 2px; }

  .match-bar-wrap {
    background: rgba(255,255,255,0.05);
    border-radius: 4px; height: 6px; overflow: hidden; margin-bottom: 16px;
  }
  .match-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--green), #7effc0);
    border-radius: 4px;
    transition: width 1s ease;
  }

  .match-items { display: flex; flex-direction: column; gap: 8px; }

  .match-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid transparent;
  }
  .match-item.pass {
    background: rgba(62,207,142,0.06);
    border-color: rgba(62,207,142,0.15);
  }
  .match-item.fail {
    background: rgba(255,102,102,0.05);
    border-color: rgba(255,102,102,0.12);
  }
  .match-item-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .match-item.pass .match-item-icon { background: rgba(62,207,142,0.15); color: var(--green); }
  .match-item.fail .match-item-icon { background: rgba(255,102,102,0.12); color: var(--red); }
  .match-item-text { flex: 1; }
  .match-item-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .match-item-detail { font-size: 11px; color: var(--text3); margin-top: 1px; }
  .match-check { flex-shrink: 0; }

  /* PROPERTY DETAILS */
  .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

  .detail-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .detail-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--gold-dim); border: 1px solid var(--gold-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold); flex-shrink: 0;
  }
  .detail-val { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--text); }
  .detail-label { font-size: 10px; color: var(--text3); margin-top: 1px; text-transform: uppercase; letter-spacing: 0.7px; }

  /* AMENITIES */
  .amenities-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }

  .amenity-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 12px 10px;
    display: flex; flex-direction: column; align-items: center; gap: 7px;
    cursor: default;
    transition: border-color 0.18s;
  }
  .amenity-item.active { border-color: rgba(201,169,110,0.25); }
  .amenity-item.inactive { opacity: 0.4; }
  .amenity-icon { color: var(--gold); }
  .amenity-label { font-size: 11px; font-weight: 500; color: var(--text2); text-align: center; }

  /* RULES */
  .rules-list { display: flex; flex-direction: column; gap: 8px; }
  .rule-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
  }
  .rule-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .rule-dot.ok { background: var(--green); box-shadow: 0 0 6px var(--green); }
  .rule-dot.no { background: var(--red); }
  .rule-text { font-size: 13px; color: var(--text2); }

  /* OCCUPANCY HISTORY */
  .occupancy-header {
    display: flex; gap: 10px; margin-bottom: 14px;
  }
  .occ-stat {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 12px;
    text-align: center;
  }
  .occ-stat-val {
    font-family: 'Sora', sans-serif;
    font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 3px;
  }
  .occ-stat-val.green { color: var(--green); }
  .occ-stat-val.gold { color: var(--gold); }
  .occ-stat-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.7px; }

  .timeline { position: relative; padding-left: 20px; }
  .timeline::before {
    content: '';
    position: absolute; left: 6px; top: 8px; bottom: 8px;
    width: 1px; background: var(--border);
  }

  .timeline-item { position: relative; margin-bottom: 14px; }
  .timeline-dot {
    position: absolute; left: -17px; top: 4px;
    width: 8px; height: 8px; border-radius: 50%;
    border: 2px solid var(--bg);
  }
  .timeline-dot.current { background: var(--green); box-shadow: 0 0 8px var(--green); }
  .timeline-dot.past { background: var(--text3); }

  .timeline-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 12px 14px;
  }
  .timeline-card.current-card { border-color: rgba(62,207,142,0.2); }

  .tl-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .tl-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .tl-duration {
    font-size: 11px; font-weight: 600;
    padding: 2px 8px; border-radius: 20px;
  }
  .tl-duration.current { background: rgba(62,207,142,0.12); color: var(--green); }
  .tl-duration.past { background: rgba(255,255,255,0.06); color: var(--text3); }
  .tl-period { font-size: 11px; color: var(--text3); }

  /* MAP SECTION */
  .map-container {
    border-radius: 18px; overflow: hidden;
    border: 1px solid var(--border);
    position: relative;
    height: 160px;
    background: linear-gradient(135deg, #0d1e2e 0%, #091520 100%);
    cursor: pointer;
    margin-bottom: 10px;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.2s;
  }
  .map-container:hover { opacity: 0.85; }

  .map-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(77,124,254,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(77,124,254,0.04) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .map-roads {
    position: absolute; inset: 0;
  }

  .map-pin {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -60%);
    display: flex; flex-direction: column; align-items: center;
  }
  .map-pin-dot {
    width: 14px; height: 14px; border-radius: 50%;
    background: var(--blue); border: 3px solid rgba(255,255,255,0.9);
    box-shadow: 0 0 0 6px rgba(77,124,254,0.2), 0 4px 16px rgba(77,124,254,0.5);
  }
  .map-pin-line { width: 2px; height: 12px; background: rgba(255,255,255,0.3); }

  .map-label {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, 14px);
    background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 4px 10px;
    font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.85);
    white-space: nowrap;
  }

  .map-open-label {
    position: absolute; bottom: 12px; right: 12px;
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: var(--blue); font-weight: 600;
  }

  .nearby-chips { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
  .nearby-chips::-webkit-scrollbar { display: none; }
  .nearby-chip {
    flex-shrink: 0;
    display: flex; align-items: center; gap: 6px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 6px 12px;
    font-size: 11px; color: var(--text2);
    cursor: default;
  }
  .nearby-chip-dot { width: 6px; height: 6px; border-radius: 50%; }

  /* BOTTOM CTA */
  .bottom-cta {
    position: fixed;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 100%; max-width: 480px;
    padding: 16px 20px 32px;
    background: linear-gradient(to top, rgba(13,17,23,1) 60%, rgba(13,17,23,0) 100%);
    display: flex; gap: 10px;
    z-index: 100;
  }

  .save-btn {
    width: 52px; height: 52px; flex-shrink: 0;
    border-radius: 16px;
    background: var(--surface);
    border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    color: var(--text2); cursor: pointer;
    transition: all 0.2s;
  }
  .save-btn:hover { border-color: var(--gold-border); color: var(--gold); }
  .save-btn.saved { background: rgba(246,102,102,0.15); border-color: rgba(246,102,102,0.35); color: var(--red); }

  .subscribe-btn {
    flex: 1; height: 52px;
    border-radius: 16px;
    background: linear-gradient(135deg, #c9a96e 0%, #a07840 100%);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    font-family: 'Sora', sans-serif;
    font-size: 15px; font-weight: 700; color: #fff;
    letter-spacing: 0.3px;
    box-shadow: 0 8px 32px rgba(201,169,110,0.3);
    transition: all 0.2s;
  }
  .subscribe-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 40px rgba(201,169,110,0.4); }
  .subscribe-btn:active { transform: translateY(0); }

  /* LIGHTBOX */
  .lightbox {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.96);
    z-index: 200;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .lightbox-close {
    position: absolute; top: 52px; right: 20px;
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.1); border: none;
    display: flex; align-items: center; justify-content: center;
    color: #fff; cursor: pointer; font-size: 18px;
  }

  .lightbox-img {
    width: 90%; max-width: 400px;
    aspect-ratio: 4/3;
    border-radius: 20px; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }

  .lightbox-strip {
    display: flex; gap: 8px;
    overflow-x: auto; scrollbar-width: none;
    padding: 0 20px;
  }
  .lightbox-strip::-webkit-scrollbar { display: none; }

  .lb-thumb {
    flex-shrink: 0; width: 56px; height: 44px;
    border-radius: 8px; overflow: hidden;
    border: 2px solid transparent; cursor: pointer;
    transition: border-color 0.18s;
    position: relative;
  }
  .lb-thumb.active { border-color: var(--gold); }
  .lb-thumb-bg { position: absolute; inset: 0; }

  .lightbox-counter {
    position: absolute; top: 52px; left: 20px;
    font-family: 'Sora', sans-serif; font-size: 13px;
    font-weight: 600; color: rgba(255,255,255,0.6);
  }
`;

const media = [
  { type: "photo", cls: "gt-1", label: "Fachada" },
  { type: "photo", cls: "gt-2", label: "Sala" },
  { type: "video", cls: "gt-3", label: "Tour" },
  { type: "photo", cls: "gt-4", label: "Cozinha" },
  { type: "photo", cls: "gt-5", label: "Quarto" },
];

const matchItems = [
  { icon: <PawPrint size={14} />, name: "Aceita pets", detail: "Cães e gatos permitidos", pass: true },
  { icon: <Wifi size={14} />, name: "Internet inclusa", detail: "Fibra 500 Mbps", pass: true },
  { icon: <Car size={14} />, name: "Vaga de garagem", detail: "1 vaga coberta", pass: true },
  { icon: <Dumbbell size={14} />, name: "Academia", detail: "No condomínio", pass: true },
  { icon: <Users size={14} />, name: "Para casal", detail: "Permitido", pass: true },
  { icon: <Wind size={14} />, name: "Ar condicionado", detail: "Não incluso nesta unidade", pass: false },
];

const amenities = [
  { icon: <Wifi size={16} />, label: "Internet", active: true },
  { icon: <Car size={16} />, label: "Garagem", active: true },
  { icon: <Dumbbell size={16} />, label: "Academia", active: true },
  { icon: <PawPrint size={16} />, label: "Pets OK", active: true },
  { icon: <Shield size={16} />, label: "Portaria 24h", active: true },
  { icon: <Wind size={16} />, label: "Ar cond.", active: false },
];

const rules = [
  { ok: true, text: "Pets permitidos (cães e gatos)" },
  { ok: true, text: "Casais e famílias bem-vindos" },
  { ok: true, text: "Home office · ambiente silencioso" },
  { ok: false, text: "Sem festas ou eventos" },
  { ok: false, text: "Fumar proibido nas dependências" },
];

const occupancy = [
  { name: "Você · atual", period: "Mar 2026 → presente", duration: "Entrando", current: true },
  { name: "Morador anterior", period: "Jun 2024 → Fev 2026", duration: "20 meses", current: false },
  { name: "Morador anterior", period: "Jan 2023 → Mai 2024", duration: "16 meses", current: false },
  { name: "Morador anterior", period: "Mar 2021 → Dez 2022", duration: "21 meses", current: false },
];

export default function PropertyDetail() {
  const [saved, setSaved] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [matchVisible, setMatchVisible] = useState(false);
  const matchRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setMatchVisible(true); },
      { threshold: 0.3 }
    );
    if (matchRef.current) obs.observe(matchRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* HERO */}
        <div className="hero" onClick={() => setLightbox(0)}>
          <div className="hero-img">
            <Building2 size={80} color="rgba(255,255,255,0.04)" />
          </div>
          <div className="hero-overlay" />

          <div className="hero-top-bar">
            <div className="back-btn"><ArrowLeft size={18} /></div>
            <div className="hero-actions">
              <div className="hero-action-btn"><Share2 size={16} /></div>
              <div className={`hero-action-btn ${saved ? "saved" : ""}`} onClick={e => { e.stopPropagation(); setSaved(s => !s); }}>
                <Heart size={16} fill={saved ? "currentColor" : "none"} />
              </div>
            </div>
          </div>

          <div className="photo-count-badge">
            <Layers size={11} /> 8 fotos · 1 vídeo
          </div>

          <div className="hero-tap-hint">
            <div className="hero-tap-pill">
              <Maximize2 size={13} /> Toque para ver em tela cheia
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-tag-row">
              <div className="hero-tag available">● Disponível</div>
              <div className="hero-tag">Apartamento</div>
              <div className="hero-tag">Torre B</div>
            </div>
            <div className="hero-price-row">
              <div className="hero-price">R$ 4.500<span>/mês</span></div>
              <div className="hero-rating">
                <Star size={12} fill="#f5a623" color="#f5a623" />
                <span className="hero-rating-val">4.8</span>
                <span className="hero-rating-count">(24 avaliações)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLL */}
        <div className="scroll-content">

          {/* TITLE */}
          <div className="title-section">
            <div className="prop-name">Apto 304 · Torre B</div>
            <div className="prop-location">
              <MapPin size={13} color="#4d7cfe" />
              Jardins, São Paulo · SP
              <span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"3px",fontSize:"11px",color:"#4d7cfe",fontWeight:600}}>
                <Navigation2 size={10} /> 1,2 km de você
              </span>
            </div>
            <div className="quick-stats">
              {[
                { icon: <BedDouble size={15} />, val: "2", label: "Quartos" },
                { icon: <Bath size={15} />, val: "1", label: "Banheiros" },
                { icon: <Maximize2 size={15} />, val: "72m²", label: "Área" },
                { icon: <Car size={15} />, val: "1", label: "Vaga" },
              ].map((s, i) => (
                <div className="qs-item" key={i}>
                  <div className="qs-icon">{s.icon}</div>
                  <div className="qs-val">{s.val}</div>
                  <div className="qs-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* GALLERY */}
          <div className="section">
            <div className="section-title">Fotos e vídeos <div className="section-title-line" /></div>
            <div className="gallery-strip">
              {media.map((m, i) => (
                <div className="gallery-thumb" key={i} onClick={() => setLightbox(i)}>
                  <div className={`gallery-thumb-bg ${m.cls}`}>
                    <Building2 size={28} color="rgba(255,255,255,0.05)" />
                  </div>
                  {m.type === "video" && (
                    <div className="video-overlay">
                      <div className="play-icon"><Play size={10} fill="#000" /></div>
                    </div>
                  )}
                </div>
              ))}
              <div className="gallery-see-all" onClick={() => setLightbox(0)}>
                <div className="gallery-see-all-count">+3</div>
                <div className="gallery-see-all-label">Ver tudo</div>
              </div>
            </div>
          </div>

          <div className="divider" style={{margin:"20px 20px 0"}} />

          {/* MATCH */}
          <div className="section" ref={matchRef}>
            <div className="section-title">Por que é pra você <div className="section-title-line" /></div>
            <div className="match-header">
              <div className="match-score-big">
                <div>
                  <div style={{display:"flex",alignItems:"baseline",gap:"2px"}}>
                    <span className="match-number">94</span>
                    <span className="match-pct">%</span>
                  </div>
                  <div className="match-label">de compatibilidade</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:"11px",color:"var(--text3)",marginBottom:"4px"}}>5 de 6 critérios</div>
                <div style={{display:"flex",gap:"4px",justifyContent:"flex-end"}}>
                  {[1,1,1,1,1,0].map((v,i) => (
                    <div key={i} style={{width:"18px",height:"4px",borderRadius:"2px",background: v ? "var(--green)" : "rgba(255,102,102,0.4)"}} />
                  ))}
                </div>
              </div>
            </div>
            <div className="match-bar-wrap">
              <div className="match-bar-fill" style={{width: matchVisible ? "94%" : "0%"}} />
            </div>
            <div className="match-items">
              {matchItems.map((m, i) => (
                <div className={`match-item ${m.pass ? "pass" : "fail"}`} key={i}>
                  <div className="match-item-icon">{m.icon}</div>
                  <div className="match-item-text">
                    <div className="match-item-name">{m.name}</div>
                    <div className="match-item-detail">{m.detail}</div>
                  </div>
                  <div className="match-check">
                    {m.pass
                      ? <CheckCircle2 size={16} color="var(--green)" />
                      : <AlertCircle size={16} color="var(--red)" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" style={{margin:"20px 20px 0"}} />

          {/* AMENITIES + RULES */}
          <div className="section">
            <div className="section-title">Comodidades <div className="section-title-line" /></div>
            <div className="amenities-grid" style={{marginBottom:"16px"}}>
              {amenities.map((a, i) => (
                <div className={`amenity-item ${a.active ? "active" : "inactive"}`} key={i}>
                  <div className="amenity-icon">{a.icon}</div>
                  <div className="amenity-label">{a.label}</div>
                </div>
              ))}
            </div>
            <div className="section-title" style={{marginTop:"4px"}}>Regras do imóvel <div className="section-title-line" /></div>
            <div className="rules-list">
              {rules.map((r, i) => (
                <div className="rule-item" key={i}>
                  <div className={`rule-dot ${r.ok ? "ok" : "no"}`} />
                  <div className="rule-text">{r.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" style={{margin:"20px 20px 0"}} />

          {/* OCCUPANCY */}
          <div className="section">
            <div className="section-title">Histórico de ocupação <div className="section-title-line" /></div>
            <div className="occupancy-header">
              <div className="occ-stat">
                <div className="occ-stat-val gold">4</div>
                <div className="occ-stat-label">Moradores</div>
              </div>
              <div className="occ-stat">
                <div className="occ-stat-val green">19m</div>
                <div className="occ-stat-label">Tempo médio</div>
              </div>
              <div className="occ-stat">
                <div className="occ-stat-val">2021</div>
                <div className="occ-stat-label">Desde</div>
              </div>
            </div>
            <div className="timeline">
              {occupancy.map((o, i) => (
                <div className="timeline-item" key={i}>
                  <div className={`timeline-dot ${o.current ? "current" : "past"}`} />
                  <div className={`timeline-card ${o.current ? "current-card" : ""}`}>
                    <div className="tl-header">
                      <div className="tl-name">{o.name}</div>
                      <div className={`tl-duration ${o.current ? "current" : "past"}`}>{o.duration}</div>
                    </div>
                    <div className="tl-period">{o.period}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" style={{margin:"20px 20px 0"}} />

          {/* MAP */}
          <div className="section">
            <div className="section-title">Localização <div className="section-title-line" /></div>
            <div className="map-container">
              <div className="map-grid" />
              <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.15}}>
                <line x1="0" y1="80" x2="100%" y2="80" stroke="#4d7cfe" strokeWidth="8"/>
                <line x1="0" y1="110" x2="100%" y2="110" stroke="#4d7cfe" strokeWidth="3"/>
                <line x1="120" y1="0" x2="120" y2="100%" stroke="#4d7cfe" strokeWidth="5"/>
                <line x1="240" y1="0" x2="240" y2="100%" stroke="#4d7cfe" strokeWidth="3"/>
                <line x1="310" y1="0" x2="260" y2="100%" stroke="#4d7cfe" strokeWidth="2"/>
              </svg>
              <div className="map-pin">
                <div className="map-pin-dot" />
                <div className="map-pin-line" />
              </div>
              <div className="map-label">Jardins, São Paulo</div>
              <div className="map-open-label"><Navigation2 size={11} /> Abrir no mapa</div>
            </div>
            <div className="nearby-chips">
              {[
                { color: "#4ade80", label: "Metrô · 400m" },
                { color: "#4d7cfe", label: "Supermercado · 200m" },
                { color: "#f5a623", label: "Farmácia · 150m" },
                { color: "#a78bfa", label: "Parque · 600m" },
              ].map((c, i) => (
                <div className="nearby-chip" key={i}>
                  <div className="nearby-chip-dot" style={{background: c.color}} />
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          <div style={{height:"40px"}} />
        </div>

        {/* CTA */}
        <div className="bottom-cta">
          <div className={`save-btn ${saved ? "saved" : ""}`} onClick={() => setSaved(s => !s)}>
            <Heart size={20} fill={saved ? "currentColor" : "none"} />
          </div>
          <button className="subscribe-btn">
            <Zap size={18} fill="rgba(255,255,255,0.8)" />
            Assinar este imóvel
          </button>
        </div>

        {/* LIGHTBOX */}
        {lightbox !== null && (
          <div className="lightbox">
            <div className="lightbox-counter">{lightbox + 1} / {media.length}</div>
            <button className="lightbox-close" onClick={() => setLightbox(null)}><X size={18} /></button>
            <div className="lightbox-img">
              <div style={{width:"100%",height:"100%",background: `linear-gradient(135deg, #1a2e4a, #0a1520)`, display:"flex", alignItems:"center", justifyContent:"center"}}>
                <Building2 size={80} color="rgba(255,255,255,0.05)" />
              </div>
            </div>
            <div className="lightbox-strip">
              {media.map((m, i) => (
                <div className={`lb-thumb ${lightbox === i ? "active" : ""}`} key={i} onClick={() => setLightbox(i)}>
                  <div className={`lb-thumb-bg ${m.cls}`} />
                  {m.type === "video" && (
                    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Play size={10} fill="#fff" color="#fff" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}

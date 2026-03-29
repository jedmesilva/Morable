import { useState } from "react";
import {
  ArrowLeft, Camera, ChevronRight, Star, Shield, Zap,
  Heart, PawPrint, Home, Users, Briefcase, MapPin,
  Edit3, CheckCircle2, Clock, TrendingUp, Award,
  Wifi, Dumbbell, Car, Moon, CreditCard, Calendar,
  Building2, LogOut, Sparkles, BarChart2, Settings,
  UserCheck
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --bg: #0d1117;
    --surface: #131920;
    --surface2: #1a2230;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.13);
    --gold: #c9a96e;
    --gold-dim: rgba(201,169,110,0.10);
    --gold-border: rgba(201,169,110,0.22);
    --blue: #4d7cfe;
    --blue-dim: rgba(77,124,254,0.10);
    --green: #3ecf8e;
    --green-dim: rgba(62,207,142,0.10);
    --text: #fff;
    --text2: rgba(255,255,255,0.52);
    --text3: rgba(255,255,255,0.28);
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
    overflow: hidden;
  }

  .screen {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    padding-bottom: 48px;
  }
  .screen::-webkit-scrollbar { display: none; }

  /* ── HERO ── */
  .hero {
    background: linear-gradient(170deg, #141c2e 0%, #0f1520 55%, #0d1117 100%);
    padding: 56px 24px 28px;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -100px; right: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
  }

  .hero-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; margin-bottom: 24px;
  }

  .edit-btn {
    width: 38px; height: 38px; border-radius: 50%;
    background: rgba(255,255,255,0.06); border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    color: var(--text2); cursor: pointer; transition: all 0.2s;
  }
  .edit-btn:hover { background: rgba(255,255,255,0.1); color: var(--text); }

  .avatar-wrap {
    position: relative; display: inline-flex; cursor: pointer;
  }
  .avatar {
    width: 86px; height: 86px; border-radius: 50%;
    background: linear-gradient(135deg, #2a4a7f, #1a2e50);
    border: 3px solid rgba(201,169,110,0.35);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Sora', sans-serif; font-size: 30px; font-weight: 700; color: #fff;
    box-shadow: 0 0 0 6px rgba(201,169,110,0.08);
  }
  .avatar-cam {
    position: absolute; bottom: 2px; right: 2px;
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--gold); border: 2px solid var(--bg);
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }

  .hero-identity { margin-bottom: 18px; }
  .user-name {
    font-family: 'Sora', sans-serif;
    font-size: 24px; font-weight: 700; color: var(--text);
    margin-bottom: 4px;
  }
  .user-meta {
    display: flex; align-items: center; gap: 10px;
    font-size: 12px; color: var(--text2);
  }
  .user-meta-dot {
    width: 3px; height: 3px; border-radius: 50%;
    background: var(--text3);
  }

  /* PLAN BADGE */
  .plan-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 20px;
    font-family: 'Sora', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 0.8px;
    text-transform: uppercase;
    background: linear-gradient(135deg, rgba(201,169,110,0.18), rgba(201,169,110,0.08));
    border: 1px solid var(--gold-border);
    color: var(--gold);
    margin-bottom: 18px;
  }

  /* COMPLETION BAR */
  .completion-wrap {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 16px;
  }
  .completion-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 8px;
  }
  .completion-label { font-size: 12px; color: var(--text2); }
  .completion-pct {
    font-family: 'Sora', sans-serif;
    font-size: 13px; font-weight: 700; color: var(--gold);
  }
  .completion-track {
    height: 5px; border-radius: 3px;
    background: rgba(255,255,255,0.07); overflow: hidden;
    margin-bottom: 8px;
  }
  .completion-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, var(--gold), #e8c98a);
    width: 72%;
    transition: width 1s ease;
  }
  .completion-hint {
    font-size: 11px; color: var(--text3);
    display: flex; align-items: center; gap: 5px;
  }

  /* ── SECTIONS ── */
  .sections-wrap { padding: 20px 20px 0; display: flex; flex-direction: column; gap: 12px; }

  .section-label {
    font-size: 10px; font-weight: 600;
    color: var(--text3); letter-spacing: 1.4px;
    text-transform: uppercase;
    margin-bottom: 8px; margin-top: 4px;
    padding-left: 2px;
  }

  /* BLOCK CARD */
  .block-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.18s;
  }
  .block-card:hover { border-color: var(--border2); transform: translateY(-1px); }
  .block-card:active { transform: translateY(0); }

  .block-header {
    display: flex; align-items: center; gap: 12px;
    padding: 16px 18px 14px;
  }

  .block-icon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .block-title-wrap { flex: 1; }
  .block-title {
    font-family: 'Sora', sans-serif;
    font-size: 14px; font-weight: 600; color: var(--text);
    margin-bottom: 2px;
  }
  .block-sub { font-size: 12px; color: var(--text2); }

  .block-chevron { color: var(--text3); flex-shrink: 0; }

  /* PILLS ROW inside block */
  .block-pills {
    display: flex; gap: 7px; flex-wrap: wrap;
    padding: 0 18px 16px;
  }
  .pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 20px;
    font-size: 11px; font-weight: 500;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    color: var(--text2);
  }
  .pill.gold { background: var(--gold-dim); border-color: var(--gold-border); color: var(--gold); }
  .pill.blue { background: var(--blue-dim); border-color: rgba(77,124,254,0.22); color: var(--blue); }
  .pill.green { background: var(--green-dim); border-color: rgba(62,207,142,0.2); color: var(--green); }

  /* METRICS ROW */
  .metrics-row {
    display: grid; grid-template-columns: repeat(3,1fr);
    border-top: 1px solid var(--border);
  }
  .metric-cell {
    padding: 14px 12px;
    text-align: center;
    border-right: 1px solid var(--border);
  }
  .metric-cell:last-child { border-right: none; }
  .metric-val {
    font-family: 'Sora', sans-serif;
    font-size: 18px; font-weight: 700; color: var(--text);
    margin-bottom: 3px;
  }
  .metric-val.gold { color: var(--gold); }
  .metric-val.green { color: var(--green); }
  .metric-label {
    font-size: 9px; font-weight: 500;
    color: var(--text3); letter-spacing: 0.7px;
    text-transform: uppercase;
  }

  /* HISTORY TIMELINE (mini) */
  .mini-timeline {
    border-top: 1px solid var(--border);
    padding: 14px 18px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .mini-tl-item {
    display: flex; align-items: center; gap: 10px;
  }
  .mini-tl-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }
  .mini-tl-name { font-size: 12px; color: var(--text2); flex: 1; }
  .mini-tl-duration {
    font-size: 11px; font-weight: 500; color: var(--text3);
  }

  /* PREFERENCES GRID */
  .pref-grid {
    border-top: 1px solid var(--border);
    padding: 14px 18px;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .pref-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--text2);
  }
  .pref-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* PLAN CARD */
  .plan-card {
    background: linear-gradient(135deg, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0.04) 100%);
    border: 1px solid var(--gold-border);
    border-radius: 20px;
    padding: 18px;
    display: flex; align-items: center; gap: 14px;
    cursor: pointer;
    transition: transform 0.18s;
  }
  .plan-card:hover { transform: translateY(-1px); }

  .plan-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: linear-gradient(135deg, var(--gold), #a07840);
    display: flex; align-items: center; justify-content: center;
    color: #fff; flex-shrink: 0;
  }
  .plan-info { flex: 1; }
  .plan-name {
    font-family: 'Sora', sans-serif;
    font-size: 15px; font-weight: 700; color: var(--gold);
    margin-bottom: 3px;
  }
  .plan-detail { font-size: 12px; color: var(--text2); }
  .plan-renew {
    display: flex; align-items: center; gap: 4px;
    font-size: 10px; color: var(--text3); margin-top: 4px;
  }

  /* LOGOUT */
  .logout-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px;
    border-radius: 16px;
    background: rgba(255,102,102,0.06);
    border: 1px solid rgba(255,102,102,0.14);
    color: rgba(255,102,102,0.7);
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 4px;
  }
  .logout-btn:hover { background: rgba(255,102,102,0.1); color: #f66; }

  /* ── DETAIL PANEL (slide-in) ── */
  .detail-panel {
    position: fixed; inset: 0;
    background: var(--bg);
    z-index: 100;
    max-width: 480px; margin: 0 auto;
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
  }
  .detail-panel.open { transform: translateX(0); }

  .panel-header {
    padding: 52px 20px 20px;
    background: linear-gradient(160deg, #141c2e 0%, #0d1117 100%);
    display: flex; align-items: center; gap: 14px;
    flex-shrink: 0;
  }
  .panel-back {
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.06); border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    color: #fff; cursor: pointer; flex-shrink: 0;
  }
  .panel-title {
    font-family: 'Sora', sans-serif;
    font-size: 18px; font-weight: 700; color: var(--text);
  }

  .panel-content {
    flex: 1; overflow-y: auto; scrollbar-width: none;
    padding: 20px; display: flex; flex-direction: column; gap: 12px;
  }
  .panel-content::-webkit-scrollbar { display: none; }

  /* DETAIL CARDS */
  .detail-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 18px;
  }
  .detail-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 13px; font-weight: 600; color: var(--text3);
    letter-spacing: 1px; text-transform: uppercase;
    margin-bottom: 14px;
  }
  .detail-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .detail-row:last-child { border-bottom: none; padding-bottom: 0; }
  .detail-row-label { font-size: 13px; color: var(--text2); display: flex; align-items: center; gap: 8px; }
  .detail-row-val {
    font-size: 13px; font-weight: 500; color: var(--text);
    font-family: 'Sora', sans-serif;
  }

  /* PET CARDS */
  .pet-cards { display: flex; flex-direction: column; gap: 10px; }
  .pet-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    display: flex; align-items: center; gap: 14px;
  }
  .pet-avatar {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; flex-shrink: 0;
  }
  .pet-name {
    font-family: 'Sora', sans-serif;
    font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 3px;
  }
  .pet-detail { font-size: 12px; color: var(--text2); }

  /* HISTORY FULL */
  .history-item {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    display: flex; align-items: center; gap: 14px;
  }
  .history-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--blue-dim); border: 1px solid rgba(77,124,254,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--blue); flex-shrink: 0;
  }
  .history-name {
    font-family: 'Sora', sans-serif;
    font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 2px;
  }
  .history-sub { font-size: 11px; color: var(--text2); }
  .history-duration {
    font-family: 'Sora', sans-serif;
    font-size: 13px; font-weight: 600; color: var(--text3);
    text-align: right;
  }
  .history-stars { display: flex; gap: 2px; margin-top: 3px; justify-content: flex-end; }
`;

const panels = {
  vida: {
    title: "Minha vida",
    content: (
      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
        <div className="detail-card">
          <div className="detail-card-title">Pessoal</div>
          {[
            { label: "Estado civil", val: "Casado" },
            { label: "Profissão", val: "Designer de produto" },
            { label: "Trabalha de casa", val: "3× por semana" },
            { label: "Rotina noturna", val: "Dorme cedo" },
          ].map((r, i) => (
            <div className="detail-row" key={i}>
              <div className="detail-row-label">{r.label}</div>
              <div className="detail-row-val">{r.val}</div>
            </div>
          ))}
        </div>
        <div className="detail-card">
          <div className="detail-card-title">Cônjuge</div>
          {[
            { label: "Nome", val: "Carlos Oliveira" },
            { label: "Nascimento", val: "12 Mar 1988 · 37 anos" },
            { label: "Profissão", val: "Engenheiro civil" },
          ].map((r, i) => (
            <div className="detail-row" key={i}>
              <div className="detail-row-label">{r.label}</div>
              <div className="detail-row-val">{r.val}</div>
            </div>
          ))}
        </div>
        <div className="detail-card">
          <div className="detail-card-title">Filhos · 1</div>
          <div className="pet-cards">
            <div className="pet-card">
              <div className="pet-avatar">👦</div>
              <div>
                <div className="pet-name">Pedro Oliveira</div>
                <div className="pet-detail">4 anos · nascido em 08 Jun 2021</div>
              </div>
            </div>
          </div>
        </div>
        <div className="detail-card">
          <div className="detail-card-title">Pets · 3 no total</div>
          <div className="pet-cards">
            {[
              { emoji: "🐕", name: "Bolinha", detail: "Golden Retriever · 3 anos" },
              { emoji: "🐕", name: "Fred", detail: "Labrador · 5 anos" },
              { emoji: "🐈", name: "Mia", detail: "Siamesa · 2 anos" },
            ].map((p, i) => (
              <div className="pet-card" key={i}>
                <div className="pet-avatar">{p.emoji}</div>
                <div>
                  <div className="pet-name">{p.name}</div>
                  <div className="pet-detail">{p.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  historico: {
    title: "Meu histórico",
    content: (
      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px"}}>
          {[
            { val: "3", label: "Imóveis", color: "" },
            { val: "19m", label: "Média", color: "green" },
            { val: "2021", label: "Membro desde", color: "gold" },
          ].map((m, i) => (
            <div key={i} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"16px",padding:"16px 12px",textAlign:"center"}}>
              <div className={`metric-val ${m.color}`}>{m.val}</div>
              <div className="metric-label">{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {[
            { name: "Apto 304 · Torre B", loc: "Jardins, SP", period: "Mar 2026 → atual", dur: "Atual", stars: 0, current: true },
            { name: "Apto 201 · Torre A", loc: "Vila Madalena, SP", period: "Jun 2024 – Fev 2026", dur: "20 meses", stars: 5, current: false },
            { name: "Studio 12 · Ed. Central", loc: "Pinheiros, SP", period: "Jan 2023 – Mai 2024", dur: "16 meses", stars: 4, current: false },
          ].map((h, i) => (
            <div className="history-item" key={i}>
              <div className="history-icon"><Building2 size={20} /></div>
              <div style={{flex:1}}>
                <div className="history-name">{h.name}</div>
                <div className="history-sub">{h.loc} · {h.period}</div>
              </div>
              <div>
                <div className="history-duration">{h.dur}</div>
                {h.stars > 0 && (
                  <div className="history-stars">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={10} fill={s<=h.stars?"#c9a96e":"none"} color={s<=h.stars?"#c9a96e":"rgba(255,255,255,0.2)"} strokeWidth={1.5} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  preferencias: {
    title: "Minhas preferências",
    content: (
      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
        <div className="detail-card">
          <div className="detail-card-title">Imóvel ideal</div>
          {[
            { label: "Tipo", val: "Apartamento" },
            { label: "Tamanho mínimo", val: "60m²" },
            { label: "Quartos", val: "2+" },
            { label: "Orçamento", val: "Até R$ 5.500/mês" },
          ].map((r, i) => (
            <div className="detail-row" key={i}>
              <div className="detail-row-label">{r.label}</div>
              <div className="detail-row-val">{r.val}</div>
            </div>
          ))}
        </div>
        <div className="detail-card">
          <div className="detail-card-title">Prioridades</div>
          {[
            { icon: "🐾", label: "Aceita pets", rank: "#1" },
            { icon: "📶", label: "Internet inclusa", rank: "#2" },
            { icon: "🔇", label: "Silencioso", rank: "#3" },
            { icon: "🚗", label: "Vaga de garagem", rank: "#4" },
            { icon: "💪", label: "Academia", rank: "#5" },
          ].map((p, i) => (
            <div className="detail-row" key={i}>
              <div className="detail-row-label">{p.icon}&nbsp;&nbsp;{p.label}</div>
              <div className="detail-row-val" style={{color:"var(--text3)",fontSize:"12px"}}>{p.rank}</div>
            </div>
          ))}
        </div>
        <div className="detail-card">
          <div className="detail-card-title">Bairros favoritos</div>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap",paddingTop:"4px"}}>
            {["Jardins","Vila Madalena","Pinheiros","Itaim Bibi"].map((b,i) => (
              <div key={i} className="pill blue"><MapPin size={10}/>{b}</div>
            ))}
          </div>
        </div>
      </div>
    )
  }
};

function DetailPanel({ panelKey, onClose }) {
  const panel = panels[panelKey];
  return (
    <div className={`detail-panel ${panelKey ? "open" : ""}`}>
      <div className="panel-header">
        <div className="panel-back" onClick={onClose}><ArrowLeft size={18} /></div>
        <div className="panel-title">{panel?.title}</div>
      </div>
      <div className="panel-content">
        {panel?.content}
      </div>
    </div>
  );
}

export default function ProfileScreen() {
  const [activePanel, setActivePanel] = useState(null);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="screen">

          {/* ── HERO ── */}
          <div className="hero">
            <div className="hero-top">
              <div className="avatar-wrap">
                <div className="avatar">M</div>
                <div className="avatar-cam"><Camera size={12} /></div>
              </div>
              <div className="edit-btn"><Edit3 size={15} /></div>
            </div>

            <div className="hero-identity">
              <div className="user-name">Marina Oliveira</div>
              <div className="user-meta">
                <span>São Paulo, SP</span>
                <div className="user-meta-dot" />
                <span>Membro desde 2021</span>
              </div>
            </div>

            <div className="plan-badge">
              <Star size={12} fill="currentColor" />
              Assinante HaaS · desde 2021
            </div>

            <div className="completion-wrap">
              <div className="completion-header">
                <span className="completion-label">Completude do perfil</span>
                <span className="completion-pct">72%</span>
              </div>
              <div className="completion-track">
                <div className="completion-fill" />
              </div>
              <div className="completion-hint">
                <Zap size={11} color="var(--gold)" />
                Complete seu perfil para matches mais precisos
              </div>
            </div>
          </div>

          {/* ── BLOCKS ── */}
          <div className="sections-wrap">

            {/* MINHA VIDA */}
            <div className="section-label">Sobre mim</div>
            <div className="block-card" onClick={() => setActivePanel("vida")}>
              <div className="block-header">
                <div className="block-icon" style={{background:"rgba(201,169,110,0.1)",border:"1px solid rgba(201,169,110,0.2)"}}>
                  <Users size={18} color="var(--gold)" />
                </div>
                <div className="block-title-wrap">
                  <div className="block-title">Minha vida</div>
                  <div className="block-sub">Casado · 1 filho · Trabalha de casa</div>
                </div>
                <ChevronRight size={16} className="block-chevron" />
              </div>
              <div className="block-pills">
                <div className="pill">🐕 2 cães</div>
                <div className="pill">🐈 1 gato</div>
                <div className="pill gold">👶 1 filho</div>
              </div>
            </div>

            {/* HISTÓRICO */}
            <div className="section-label" style={{marginTop:"4px"}}>Trajetória</div>
            <div className="block-card" onClick={() => setActivePanel("historico")}>
              <div className="block-header">
                <div className="block-icon" style={{background:"var(--blue-dim)",border:"1px solid rgba(77,124,254,0.2)"}}>
                  <TrendingUp size={18} color="var(--blue)" />
                </div>
                <div className="block-title-wrap">
                  <div className="block-title">Meu histórico</div>
                  <div className="block-sub">3 imóveis · média de 19 meses</div>
                </div>
                <ChevronRight size={16} className="block-chevron" />
              </div>
              <div className="metrics-row">
                <div className="metric-cell">
                  <div className="metric-val">3</div>
                  <div className="metric-label">Imóveis</div>
                </div>
                <div className="metric-cell">
                  <div className="metric-val green">19m</div>
                  <div className="metric-label">Média</div>
                </div>
                <div className="metric-cell">
                  <div className="metric-val gold">4,7</div>
                  <div className="metric-label">Nota média</div>
                </div>
              </div>
              <div className="mini-timeline">
                {[
                  { name: "Apto 304 · Torre B · atual", dur: "→", dot: "#3ecf8e" },
                  { name: "Apto 201 · Vila Madalena", dur: "20m", dot: "rgba(255,255,255,0.2)" },
                  { name: "Studio 12 · Pinheiros", dur: "16m", dot: "rgba(255,255,255,0.2)" },
                ].map((t, i) => (
                  <div className="mini-tl-item" key={i}>
                    <div className="mini-tl-dot" style={{background: t.dot, boxShadow: t.dot === "#3ecf8e" ? "0 0 6px #3ecf8e" : "none"}} />
                    <div className="mini-tl-name">{t.name}</div>
                    <div className="mini-tl-duration">{t.dur}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PREFERÊNCIAS */}
            <div className="block-card" style={{marginTop:"-2px"}} onClick={() => setActivePanel("preferencias")}>
              <div className="block-header">
                <div className="block-icon" style={{background:"var(--green-dim)",border:"1px solid rgba(62,207,142,0.2)"}}>
                  <Heart size={18} color="var(--green)" />
                </div>
                <div className="block-title-wrap">
                  <div className="block-title">Minhas preferências</div>
                  <div className="block-sub">Alimenta o match dos imóveis</div>
                </div>
                <ChevronRight size={16} className="block-chevron" />
              </div>
              <div className="pref-grid">
                {[
                  { icon: <PawPrint size={13} color="var(--green)" />, label: "Pets OK", bg: "var(--green-dim)" },
                  { icon: <Wifi size={13} color="var(--blue)" />, label: "Internet", bg: "var(--blue-dim)" },
                  { icon: <Car size={13} color="var(--gold)" />, label: "Garagem", bg: "var(--gold-dim)" },
                  { icon: <Dumbbell size={13} color="rgba(167,139,250,0.9)" />, label: "Academia", bg: "rgba(167,139,250,0.08)" },
                ].map((p, i) => (
                  <div className="pref-item" key={i}>
                    <div className="pref-icon" style={{background: p.bg}}>{p.icon}</div>
                    <span>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PLANO */}
            <div className="section-label" style={{marginTop:"4px"}}>Assinatura atual</div>
            <div className="plan-card">
              <div className="plan-icon"><Building2 size={22} /></div>
              <div className="plan-info">
                <div className="plan-name">Apto 304 · Torre B</div>
                <div className="plan-detail">Jardins, São Paulo · R$ 4.500/mês</div>
                <div className="plan-renew"><Calendar size={10} /> Vence em 05 Abr 2026</div>
              </div>
              <ChevronRight size={16} color="var(--gold)" />
            </div>

            {/* LOGOUT */}
            <div className="logout-btn">
              <LogOut size={15} />
              Sair da conta
            </div>

          </div>
        </div>

        {/* DETAIL PANELS */}
        {activePanel && (
          <DetailPanel panelKey={activePanel} onClose={() => setActivePanel(null)} />
        )}
      </div>
    </>
  );
}

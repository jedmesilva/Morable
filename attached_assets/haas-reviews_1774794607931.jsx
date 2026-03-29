import { useState } from "react";
import {
  ArrowLeft, Star, ThumbsUp, ChevronDown, Filter
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
    --green: #3ecf8e;
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
  }

  /* HEADER */
  .header {
    padding: 52px 20px 20px;
    background: linear-gradient(160deg, #141c2e 0%, #0d1117 100%);
    position: relative;
    flex-shrink: 0;
  }

  .header-top {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 24px;
  }

  .back-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.06); border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    color: #fff; cursor: pointer; flex-shrink: 0;
    transition: background 0.2s;
  }
  .back-btn:hover { background: rgba(255,255,255,0.1); }

  .header-title {
    font-family: 'Sora', sans-serif;
    font-size: 18px; font-weight: 700; color: var(--text);
  }
  .header-sub { font-size: 12px; color: var(--text3); margin-top: 1px; }

  /* SUMMARY BLOCK */
  .summary {
    display: flex; gap: 16px; align-items: center;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 20px;
  }

  .score-left { text-align: center; flex-shrink: 0; }

  .score-big {
    font-family: 'Sora', sans-serif;
    font-size: 52px; font-weight: 800;
    color: var(--text); line-height: 1;
    margin-bottom: 6px;
  }

  .stars-row {
    display: flex; gap: 3px; justify-content: center; margin-bottom: 5px;
  }

  .score-count { font-size: 11px; color: var(--text3); }

  .score-divider {
    width: 1px; background: var(--border); align-self: stretch; flex-shrink: 0;
  }

  .bars-right { flex: 1; display: flex; flex-direction: column; gap: 6px; }

  .bar-row { display: flex; align-items: center; gap: 8px; }

  .bar-label {
    font-size: 11px; font-weight: 600;
    color: var(--text3); width: 14px; text-align: right; flex-shrink: 0;
  }

  .bar-track {
    flex: 1; height: 5px; border-radius: 3px;
    background: rgba(255,255,255,0.07); overflow: hidden;
  }

  .bar-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, var(--gold), #e8c98a);
    transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  }

  .bar-count { font-size: 10px; color: var(--text3); width: 18px; flex-shrink: 0; }

  /* CHIPS */
  .chips-wrap {
    padding: 16px 20px 0;
    display: flex; gap: 8px;
    overflow-x: auto; scrollbar-width: none;
    flex-shrink: 0;
  }
  .chips-wrap::-webkit-scrollbar { display: none; }

  .chip {
    flex-shrink: 0;
    padding: 7px 16px; border-radius: 20px;
    font-size: 12px; font-weight: 500; cursor: pointer;
    border: 1px solid var(--border); color: var(--text3);
    background: rgba(255,255,255,0.03);
    transition: all 0.18s; white-space: nowrap;
  }
  .chip.active {
    background: var(--gold-dim); border-color: var(--gold-border); color: var(--gold);
  }

  /* LIST */
  .reviews-list {
    flex: 1; overflow-y: auto; scrollbar-width: none;
    padding: 16px 20px 32px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .reviews-list::-webkit-scrollbar { display: none; }

  /* REVIEW CARD */
  .review-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 18px;
    animation: slideUp 0.3s ease both;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .review-top {
    display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
  }

  .avatar {
    width: 42px; height: 42px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700;
    color: #fff; flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .reviewer-info { flex: 1; }
  .reviewer-name { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 2px; }

  .tenure-badge {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
    border-radius: 20px; padding: 2px 8px;
    font-size: 10px; font-weight: 500; color: var(--text3);
  }
  .tenure-dot {
    width: 4px; height: 4px; border-radius: 50%; background: var(--green);
    box-shadow: 0 0 4px var(--green);
  }

  .review-stars { display: flex; gap: 2px; }

  .review-date { font-size: 11px; color: var(--text3); margin-top: 1px; }

  /* TAGS */
  .review-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .review-tag {
    font-size: 10px; font-weight: 600; letter-spacing: 0.5px;
    padding: 3px 9px; border-radius: 20px;
    border: 1px solid; text-transform: uppercase;
  }

  /* TEXT */
  .review-text {
    font-size: 13px; line-height: 1.6;
    color: var(--text2);
    margin-bottom: 12px;
  }

  .review-text.collapsed {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .expand-btn {
    font-size: 12px; color: var(--gold); cursor: pointer;
    display: inline-flex; align-items: center; gap: 3px;
    margin-bottom: 12px; margin-top: -6px;
    background: none; border: none;
  }

  /* FOOTER */
  .review-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }

  .helpful-btn {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--text3); cursor: pointer;
    background: none; border: none;
    padding: 5px 10px; border-radius: 8px;
    border: 1px solid transparent;
    transition: all 0.18s;
  }
  .helpful-btn:hover { border-color: var(--border); color: var(--text2); }
  .helpful-btn.voted { color: var(--green); border-color: rgba(62,207,142,0.2); }

  .verified-badge {
    display: flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 600; color: var(--green);
    background: rgba(62,207,142,0.08); border: 1px solid rgba(62,207,142,0.18);
    border-radius: 20px; padding: 3px 8px;
  }
`;

const avatarColors = ["#2a4a7f","#2a6b4a","#6b2a4a","#4a2a6b","#6b4a2a","#2a6b6b"];

const reviews = [
  {
    initials: "R.M.", color: 0,
    name: "R. Mendes",
    tenure: "20 meses",
    period: "Jun 2024 – Fev 2026",
    stars: 5,
    date: "Mar 2026",
    tags: [{ label: "Silencioso", color: "#4d7cfe" }, { label: "Bem localizado", color: "#3ecf8e" }],
    text: "Imóvel excelente, muito silencioso apesar de ser bem centralizado. A gestão da HaaS foi super eficiente em todos os chamados que abri — nunca esperei mais de 24h para resolução. Entrega e saída sem burocracia nenhuma, tudo pelo app. Saí só porque mudei de cidade, com certeza voltaria.",
    helpful: 14,
  },
  {
    initials: "C.A.", color: 1,
    name: "C. Almeida",
    tenure: "16 meses",
    period: "Jan 2023 – Mai 2024",
    stars: 4,
    date: "Jun 2024",
    tags: [{ label: "Boa estrutura", color: "#c9a96e" }],
    text: "Apartamento bem conservado, estrutura boa. A portaria funciona bem. Tive um problema com o chuveiro no segundo mês mas foi resolvido em dois dias. O único ponto de atenção é que o sol da tarde bate forte no quarto principal — não é um problema sério, mas vale saber.",
    helpful: 8,
  },
  {
    initials: "L.F.", color: 2,
    name: "L. Ferreira",
    tenure: "21 meses",
    period: "Mar 2021 – Dez 2022",
    stars: 5,
    date: "Jan 2023",
    tags: [{ label: "Pet friendly", color: "#3ecf8e" }, { label: "Silencioso", color: "#4d7cfe" }],
    text: "Morei com minha cachorra por quase dois anos e nunca tive nenhum problema relacionado a isso. Vizinhança tranquila, condomínio bem gerido. Recomendo muito para quem tem pet.",
    helpful: 21,
  },
  {
    initials: "A.B.", color: 3,
    name: "A. Barbosa",
    tenure: "9 meses",
    period: "Abr 2020 – Dez 2020",
    stars: 4,
    date: "Jan 2021",
    tags: [{ label: "Bem localizado", color: "#3ecf8e" }],
    text: "Localização impecável, a pé de tudo. O imóvel em si é bom, mas estava com alguns itens de acabamento um pouco desgastados na época. A HaaS fez a manutenção depois que reportei.",
    helpful: 5,
  },
];

const dist = [
  { stars: 5, count: 18 },
  { stars: 4, count: 4 },
  { stars: 3, count: 1 },
  { stars: 2, count: 1 },
  { stars: 1, count: 0 },
];
const total = dist.reduce((a, b) => a + b.count, 0);
const score = (dist.reduce((a, b) => a + b.stars * b.count, 0) / total).toFixed(1);

function StarRow({ count, size = 14, filled = true }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={size}
          fill={filled && i <= count ? "#c9a96e" : "none"}
          color={i <= count ? "#c9a96e" : "rgba(255,255,255,0.15)"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function ReviewCard({ r, delay }) {
  const [expanded, setExpanded] = useState(false);
  const [voted, setVoted] = useState(false);
  const [helpCount, setHelpCount] = useState(r.helpful);
  const long = r.text.length > 160;

  return (
    <div className="review-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="review-top">
        <div className="avatar" style={{ background: avatarColors[r.color] }}>{r.initials}</div>
        <div className="reviewer-info">
          <div className="reviewer-name">{r.name}</div>
          <div className="tenure-badge">
            <div className="tenure-dot" />
            {r.tenure} · {r.period}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="review-stars" style={{ justifyContent: "flex-end" }}>
            <StarRow count={r.stars} size={12} />
          </div>
          <div className="review-date">{r.date}</div>
        </div>
      </div>

      {r.tags.length > 0 && (
        <div className="review-tags">
          {r.tags.map((t, i) => (
            <div
              key={i}
              className="review-tag"
              style={{
                color: t.color,
                borderColor: t.color + "40",
                background: t.color + "12",
              }}
            >
              {t.label}
            </div>
          ))}
        </div>
      )}

      <div className={`review-text ${long && !expanded ? "collapsed" : ""}`}>{r.text}</div>
      {long && (
        <button className="expand-btn" onClick={() => setExpanded(e => !e)}>
          {expanded ? "Ver menos" : "Ver mais"} <ChevronDown size={12} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>
      )}

      <div className="review-footer">
        <button
          className={`helpful-btn ${voted ? "voted" : ""}`}
          onClick={() => {
            setVoted(v => !v);
            setHelpCount(c => voted ? c - 1 : c + 1);
          }}
        >
          <ThumbsUp size={13} fill={voted ? "currentColor" : "none"} />
          Útil · {helpCount}
        </button>
        <div className="verified-badge">
          <Star size={9} fill="currentColor" /> Morador verificado
        </div>
      </div>
    </div>
  );
}

const filters = ["Todas", "5 ★", "4 ★", "3 ★ ou menos"];

export default function ReviewsScreen() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [barsVisible] = useState(true);

  const filtered = reviews.filter(r => {
    if (activeFilter === 0) return true;
    if (activeFilter === 1) return r.stars === 5;
    if (activeFilter === 2) return r.stars === 4;
    if (activeFilter === 3) return r.stars <= 3;
    return true;
  });

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        <div className="header">
          <div className="header-top">
            <div className="back-btn"><ArrowLeft size={18} /></div>
            <div>
              <div className="header-title">Avaliações</div>
              <div className="header-sub">Apto 304 · Torre B · Jardins</div>
            </div>
          </div>

          <div className="summary">
            <div className="score-left">
              <div className="score-big">{score}</div>
              <div className="stars-row"><StarRow count={5} size={14} /></div>
              <div className="score-count">{total} avaliações</div>
            </div>

            <div className="score-divider" />

            <div className="bars-right">
              {dist.map((d, i) => (
                <div className="bar-row" key={i}>
                  <div className="bar-label">{d.stars}</div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: barsVisible ? `${(d.count / total) * 100}%` : "0%" }}
                    />
                  </div>
                  <div className="bar-count">{d.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chips-wrap">
          {filters.map((f, i) => (
            <div
              key={i}
              className={`chip ${activeFilter === i ? "active" : ""}`}
              onClick={() => setActiveFilter(i)}
            >
              {f}
            </div>
          ))}
        </div>

        <div className="reviews-list">
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text3)", fontSize: "13px", marginTop: "40px" }}>
              Nenhuma avaliação nessa categoria ainda.
            </div>
          ) : (
            filtered.map((r, i) => <ReviewCard key={i} r={r} delay={i * 60} />)
          )}
        </div>

      </div>
    </>
  );
}

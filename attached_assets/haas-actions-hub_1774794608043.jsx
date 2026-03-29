import { useState } from "react";
import {
  ArrowLeft, Receipt, Wrench, FileText, Heart,
  Calendar, CreditCard, Users, Headphones,
  ChevronRight, Bell, Shield, Star, Zap,
  Building2, Map, ClipboardList, Gift, MessageCircle,
  AlertTriangle, Truck, Wifi, Sparkles, Package
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

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
    --blue-border: rgba(77,124,254,0.22);
    --green: #3ecf8e;
    --green-dim: rgba(62,207,142,0.10);
    --green-border: rgba(62,207,142,0.20);
    --red: #f66;
    --red-dim: rgba(255,102,102,0.10);
    --purple: #a78bfa;
    --purple-dim: rgba(167,139,250,0.10);
    --amber: #f5a623;
    --amber-dim: rgba(245,166,35,0.10);
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
  }

  /* HEADER */
  .header {
    background: linear-gradient(160deg, #141c2e 0%, #0d1117 100%);
    padding: 52px 20px 24px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }
  .header::before {
    content: '';
    position: absolute;
    top: -80px; right: -60px;
    width: 240px; height: 240px;
    background: radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
  }

  .header-top {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 6px;
  }

  .back-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.06); border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    color: #fff; cursor: pointer; transition: background 0.2s; flex-shrink: 0;
  }
  .back-btn:hover { background: rgba(255,255,255,0.1); }

  .header-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px; font-weight: 700; color: var(--text);
  }
  .header-sub {
    font-size: 13px; color: var(--text3);
    padding-left: 54px;
  }

  /* SCROLL */
  .scroll {
    flex: 1; overflow-y: auto; scrollbar-width: none;
    padding: 20px 20px 48px;
    display: flex; flex-direction: column; gap: 24px;
  }
  .scroll::-webkit-scrollbar { display: none; }

  /* GROUP */
  .group-label {
    font-size: 10px; font-weight: 600;
    color: var(--text3); letter-spacing: 1.4px;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .group-label-line {
    flex: 1; height: 1px; background: var(--border);
  }

  .group-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  /* ACTION CARD */
  .action-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 18px 16px;
    cursor: pointer;
    transition: transform 0.18s, border-color 0.18s, box-shadow 0.18s;
    display: flex; flex-direction: column; gap: 12px;
    position: relative;
    overflow: hidden;
  }
  .action-card:hover {
    transform: translateY(-2px);
    border-color: var(--border2);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .action-card:active { transform: translateY(0); }

  /* WIDE card (full width) */
  .action-card.wide {
    grid-column: span 2;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 16px 18px;
  }
  .action-card.wide .action-body { flex: 1; }
  .action-card.wide .action-chevron {
    color: var(--text3); flex-shrink: 0;
  }

  .action-icon {
    width: 44px; height: 44px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .action-name {
    font-family: 'Sora', sans-serif;
    font-size: 13px; font-weight: 600; color: var(--text);
    margin-bottom: 2px;
    line-height: 1.3;
  }
  .action-desc {
    font-size: 11px; color: var(--text3);
    line-height: 1.4;
  }

  /* BADGE */
  .action-badge {
    position: absolute; top: 12px; right: 12px;
    font-size: 10px; font-weight: 700;
    padding: 2px 7px; border-radius: 20px;
    font-family: 'Sora', sans-serif;
  }
  .badge-red { background: rgba(255,102,102,0.18); color: var(--red); border: 1px solid rgba(255,102,102,0.25); }
  .badge-green { background: var(--green-dim); color: var(--green); border: 1px solid var(--green-border); }
  .badge-gold { background: var(--gold-dim); color: var(--gold); border: 1px solid var(--gold-border); }

  /* HIGHLIGHT card (featured) */
  .action-card.highlight {
    background: linear-gradient(135deg, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0.04) 100%);
    border-color: var(--gold-border);
  }
  .action-card.highlight:hover { border-color: rgba(201,169,110,0.4); }
`;

const groups = [
  {
    label: "Minha moradia",
    items: [
      {
        icon: <Receipt size={20} />,
        iconBg: "var(--gold-dim)", iconColor: "var(--gold)",
        name: "Fatura",
        desc: "Ver e pagar mensalidade",
        badge: { text: "Vence em 5d", cls: "badge-red" },
      },
      {
        icon: <Wrench size={20} />,
        iconBg: "var(--blue-dim)", iconColor: "var(--blue)",
        name: "Chamados",
        desc: "Manutenção e reparos",
        badge: { text: "1 aberto", cls: "badge-gold" },
      },
      {
        icon: <FileText size={20} />,
        iconBg: "var(--blue-dim)", iconColor: "var(--blue)",
        name: "Documentos",
        desc: "CPF, comprovantes, etc.",
      },
      {
        icon: <Shield size={20} />,
        iconBg: "var(--amber-dim)", iconColor: "var(--amber)",
        name: "Seguro",
        desc: "Cobertura do imóvel",
      },
      {
        icon: <ClipboardList size={20} />,
        iconBg: "var(--green-dim)", iconColor: "var(--green)",
        name: "Contrato",
        desc: "Ver termos da assinatura",
        badge: { text: "Ativo", cls: "badge-green" },
      },
      {
        icon: <Building2 size={20} />,
        iconBg: "var(--purple-dim)", iconColor: "var(--purple)",
        name: "Trocar imóvel",
        desc: "Iniciar busca por mudança",
      },
    ],
  },
  {
    label: "Financeiro",
    items: [
      {
        icon: <CreditCard size={20} />,
        iconBg: "var(--green-dim)", iconColor: "var(--green)",
        name: "Histórico de pagamentos",
        desc: "Todas as faturas pagas",
        wide: true,
      },
    ],
  },
  {
    label: "Serviços",
    items: [
      {
        icon: <Truck size={20} />,
        iconBg: "var(--blue-dim)", iconColor: "var(--blue)",
        name: "Mudança",
        desc: "Fretes e transportes parceiros",
        badge: { text: "Parceiro", cls: "badge-green" },
        wide: true,
      },
      {
        icon: <Wifi size={20} />,
        iconBg: "var(--purple-dim)", iconColor: "var(--purple)",
        name: "Internet",
        desc: "Planos de fibra no endereço",
        badge: { text: "Parceiro", cls: "badge-green" },
      },
      {
        icon: <Sparkles size={20} />,
        iconBg: "var(--gold-dim)", iconColor: "var(--gold)",
        name: "Limpeza",
        desc: "Pontual ou recorrente",
      },
      {
        icon: <Package size={20} />,
        iconBg: "var(--amber-dim)", iconColor: "var(--amber)",
        name: "Montagem",
        desc: "Móveis e instalações",
      },
      {
        icon: <Shield size={20} />,
        iconBg: "var(--green-dim)", iconColor: "var(--green)",
        name: "Seguro de pertences",
        desc: "Cobertura dos seus bens",
      },
    ],
  },
  {
    label: "Descoberta",
    items: [
      {
        icon: <Heart size={20} />,
        iconBg: "var(--red-dim)", iconColor: "var(--red)",
        name: "Imóveis salvos",
        desc: "Seus favoritos",
        badge: { text: "3 salvos", cls: "badge-red" },
        wide: true,
        highlight: true,
      },
      {
        icon: <Map size={20} />,
        iconBg: "var(--blue-dim)", iconColor: "var(--blue)",
        name: "Explorar no mapa",
        desc: "Ver imóveis próximos",
      },
      {
        icon: <Star size={20} />,
        iconBg: "var(--gold-dim)", iconColor: "var(--gold)",
        name: "Recomendados",
        desc: "Baseado no seu perfil",
      },
    ],
  },
  {
    label: "Comunidade",
    items: [
      {
        icon: <Gift size={20} />,
        iconBg: "var(--purple-dim)", iconColor: "var(--purple)",
        name: "Indicações",
        desc: "Indique e ganhe benefícios",
        wide: true,
      },
      {
        icon: <Headphones size={20} />,
        iconBg: "var(--green-dim)", iconColor: "var(--green)",
        name: "Suporte",
        desc: "Falar com a equipe",
      },
      {
        icon: <MessageCircle size={20} />,
        iconBg: "var(--blue-dim)", iconColor: "var(--blue)",
        name: "Chat com IA",
        desc: "Assistente HaaS",
      },
      {
        icon: <AlertTriangle size={20} />,
        iconBg: "rgba(255,255,255,0.05)", iconColor: "var(--text3)",
        name: "Reportar ocorrência",
        desc: "Vizinhança, segurança, gestão",
      },
    ],
  },
];

export default function ActionsHub() {
  return (
    <>
      <style>{styles}</style>
      <div className="app">

        <div className="header">
          <div className="header-top">
            <div className="back-btn"><ArrowLeft size={18} /></div>
            <div className="header-title">Todas as ações</div>
          </div>
          <div className="header-sub">O que você precisa fazer hoje?</div>
        </div>

        <div className="scroll">
          {groups.map((g, gi) => (
            <div key={gi}>
              <div className="group-label">
                {g.label}
                <div className="group-label-line" />
              </div>
              <div className="group-grid">
                {g.items.map((item, ii) => (
                  <div
                    key={ii}
                    className={`action-card ${item.wide ? "wide" : ""} ${item.highlight ? "highlight" : ""}`}
                  >
                    <div
                      className="action-icon"
                      style={{ background: item.iconBg, color: item.iconColor }}
                    >
                      {item.icon}
                    </div>
                    <div className="action-body">
                      <div className="action-name">{item.name}</div>
                      <div className="action-desc">{item.desc}</div>
                    </div>
                    {item.wide && <ChevronRight size={16} className="action-chevron" />}
                    {item.badge && (
                      <div className={`action-badge ${item.badge.cls}`}>{item.badge.text}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

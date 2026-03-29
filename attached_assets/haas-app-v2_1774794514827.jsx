import { useState, useEffect } from "react";
import {
  Bell, Building2, Wrench, Headphones, ChevronRight,
  Home, Search, FileText, MessageCircle, User, CheckCircle2,
  Receipt, CreditCard, ClipboardList, MapPin, BedDouble, Bath, SlidersHorizontal, Eye, EyeOff, Navigation2, ChevronDown, Loader
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .app {
    font-family: 'DM Sans', sans-serif;
    background: #10151e;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .screen {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
  }
  .screen::-webkit-scrollbar { display: none; }
  @media (min-width: 480px) {
    .screen { max-width: 480px; margin: 0 auto; width: 100%; }
    .bottom-nav { max-width: 480px; margin: 0 auto; width: 100%; }
  }

  .header {
    background: linear-gradient(160deg, #141c2e 0%, #0f1520 60%, #0d1117 100%);
    padding: 60px 28px 32px;
    position: relative;
    overflow: hidden;
  }
  .header::before {
    content: '';
    position: absolute;
    top: -80px; right: -60px;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(99,170,255,0.08) 0%, transparent 70%);
    border-radius: 50%;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .welcome-label {
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,0.4);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .welcome-name {
    font-family: 'Sora', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .wave {
    font-size: 24px;
    animation: wave 2.5s infinite;
    display: inline-block;
    transform-origin: 70% 70%;
  }
  @keyframes wave {
    0%,100% { transform: rotate(0deg); }
    15% { transform: rotate(14deg); }
    30% { transform: rotate(-8deg); }
    45% { transform: rotate(14deg); }
    60% { transform: rotate(-4deg); }
    75% { transform: rotate(10deg); }
  }

  .header-actions { display: flex; gap: 10px; margin-top: 4px; }

  .icon-btn {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: rgba(210,185,150,0.14);
    border: 1px solid rgba(210,185,150,0.18);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d2b896;
    transition: all 0.2s;
    position: relative;
  }
  .icon-btn:hover { background: rgba(210,185,150,0.24); transform: scale(1.05); }

  .notif-dot {
    position: absolute;
    top: 8px; right: 8px;
    width: 8px; height: 8px;
    background: #ff6b6b;
    border-radius: 50%;
    border: 2px solid #141c2e;
  }

  .avatar-btn {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: rgba(210,185,150,0.18);
    border: 1px solid rgba(210,185,150,0.25);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d2b896;
    font-family: 'Sora', sans-serif;
    font-size: 17px;
    font-weight: 600;
    transition: all 0.2s;
  }
  .avatar-btn:hover { background: rgba(210,185,150,0.28); }

  .card-section {
    padding: 0 20px 28px;
    background: linear-gradient(180deg, #0f1520 0%, #10151e 100%);
  }

  .property-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .property-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
  .property-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  }

  .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .card-top-left { display: flex; align-items: center; gap: 10px; }
  .eye-btn {
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.3); display: flex; align-items: center;
    padding: 2px; transition: color 0.2s;
  }
  .eye-btn:hover { color: rgba(255,255,255,0.6); }
  .hidden-value {
    letter-spacing: 2px; color: rgba(255,255,255,0.25); font-size: 13px; font-weight: 500;
  }

  .card-badge {
    background: rgba(210,185,150,0.12);
    border: 1px solid rgba(210,185,150,0.25);
    border-radius: 20px;
    padding: 5px 14px;
    font-size: 10px;
    font-weight: 600;
    color: #d2b896;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .building-icon {
    width: 54px; height: 54px;
    background: linear-gradient(135deg, #1a2540 0%, #141d32 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(99,140,255,0.2);
    color: #6384ff;
  }

  .apt-name {
    font-family: 'Sora', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 6px;
  }
  .apt-location { font-size: 14px; color: rgba(255,255,255,0.45); }

  .card-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

  .stat-box {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 12px 10px;
    text-align: center;
  }

  .stat-label {
    font-size: 9px;
    font-weight: 600;
    color: rgba(255,255,255,0.35);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .stat-value {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
  }

  .stat-value.status {
    color: #4ade80;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 12px;
  }

  .status-dot {
    width: 6px; height: 6px;
    background: #4ade80;
    border-radius: 50%;
    box-shadow: 0 0 6px #4ade80;
  }

  .actions-section { padding: 28px 20px 20px; background: #10151e; }

  .actions-title {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.3);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .action-item:hover { transform: translateY(-3px); }
  .action-item:hover .action-icon { box-shadow: 0 8px 24px rgba(210,185,150,0.18); }

  .action-icon {
    width: 62px; height: 62px;
    border-radius: 20px;
    background: rgba(210,185,150,0.09);
    border: 1px solid rgba(210,185,150,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d2b896;
    transition: all 0.2s;
  }
  .action-icon.more {
    background: #1a2540;
    border-color: rgba(99,140,255,0.25);
    color: #6384ff;
  }

  .action-label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.65);
    text-align: center;
    font-family: 'Sora', sans-serif;
  }

  .recent-section { padding: 12px 20px 20px; background: #10151e; }

  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }

  .section-title {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: rgba(255,255,255,0.8);
  }

  .see-all { font-size: 12px; color: #d2b896; cursor: pointer; opacity: 0.8; }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .activity-item:hover { background: rgba(255,255,255,0.06); }

  .activity-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .activity-icon.blue { background: rgba(99,132,255,0.15); color: #6384ff; }
  .activity-icon.green { background: rgba(74,222,128,0.12); color: #4ade80; }
  .activity-icon.amber { background: rgba(251,191,36,0.12); color: #fbbf24; }

  .activity-info { flex: 1; }
  .activity-title { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.85); margin-bottom: 2px; }
  .activity-sub { font-size: 11px; color: rgba(255,255,255,0.35); }
  .activity-amount { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #fff; }

  /* DISCOVER SCREEN */
  .discover-screen { padding: 56px 20px 20px; background: #10151e; flex: 1; }

  .location-bar {
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 11px 14px; margin-bottom: 20px; cursor: pointer;
    transition: background 0.2s;
  }
  .location-bar:hover { background: rgba(255,255,255,0.07); }
  .location-bar-left { display: flex; align-items: center; gap: 8px; }
  .location-bar-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(99,132,255,0.15); display: flex; align-items: center;
    justify-content: center; color: #6384ff; flex-shrink: 0;
  }
  .location-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 1px; }
  .location-value { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: #fff; }
  .location-value.loading { color: rgba(255,255,255,0.35); font-weight: 400; font-size: 12px; }
  .location-change { display: flex; align-items: center; gap: 3px; font-size: 11px; color: #d2b896; opacity: 0.7; }

  .listing-distance {
    display: flex; align-items: center; gap: 3px;
    font-size: 11px; color: #6384ff; font-weight: 500;
  }
  .discover-title { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .discover-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 20px; }
  .search-row { display: flex; gap: 10px; margin-bottom: 16px; }
  .search-bar {
    flex: 1; display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px; padding: 12px 14px; color: rgba(255,255,255,0.35); font-size: 13px; cursor: text;
  }
  .filter-btn {
    width: 48px; height: 48px; background: rgba(210,185,150,0.1); border: 1px solid rgba(210,185,150,0.2);
    border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #d2b896; cursor: pointer; flex-shrink: 0;
  }
  .chips { display: flex; gap: 8px; margin-bottom: 22px; overflow-x: auto; scrollbar-width: none; }
  .chips::-webkit-scrollbar { display: none; }
  .chip {
    white-space: nowrap; padding: 7px 16px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer;
    border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.45); background: rgba(255,255,255,0.04); transition: all 0.18s;
  }
  .chip.active { background: rgba(210,185,150,0.14); border-color: rgba(210,185,150,0.35); color: #d2b896; }
  .listings { display: flex; flex-direction: column; gap: 14px; }
  .listing-card {
    border-radius: 20px; overflow: hidden; cursor: pointer;
    position: relative; height: 0; padding-bottom: 100%;
    border: 1px solid rgba(255,255,255,0.07);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .listing-card:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(0,0,0,0.5); }
  .listing-img { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .listing-img-1 { background: linear-gradient(135deg, #1e2d4a 0%, #0e1a2e 100%); }
  .listing-img-2 { background: linear-gradient(135deg, #1a2e2a 0%, #0a1e1a 100%); }
  .listing-img-3 { background: linear-gradient(135deg, #2e1e2e 0%, #1a0e20 100%); }
  .listing-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.0) 100%);
  }
  .match-badge {
    position: absolute; top: 12px; right: 12px;
    border-radius: 10px; padding: 5px 10px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.3px;
    display: flex; align-items: center; gap: 5px;
    backdrop-filter: blur(8px);
  }
  .match-badge.high {
    background: rgba(74,222,128,0.18); border: 1px solid rgba(74,222,128,0.35); color: #4ade80;
  }
  .match-badge.mid {
    background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.3); color: #fbbf24;
  }
  .match-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  .listing-tag {
    position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.45); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 4px 10px;
    font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.8); letter-spacing: 0.5px;
  }
  .listing-body {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 14px 16px;
  }
  .listing-name { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 4px; }
  .listing-location { display: flex; align-items: center; gap: 4px; font-size: 12px; color: rgba(255,255,255,0.55); margin-bottom: 10px; }
  .listing-footer { display: flex; justify-content: space-between; align-items: center; }
  .listing-price { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; color: #fff; }
  .listing-price span { font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.55); }
  .listing-meta { display: flex; gap: 10px; }
  .listing-meta-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: rgba(255,255,255,0.55); }

  .bottom-nav {
    background: rgba(13,17,23,0.97);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 14px 32px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    opacity: 0.35;
    transition: opacity 0.2s;
    padding: 4px 12px;
    border-radius: 12px;
    color: #fff;
  }
  .nav-item.active { opacity: 1; color: #d2b896; }
  .nav-dot { width: 4px; height: 4px; border-radius: 50%; background: transparent; }
  .nav-item.active .nav-dot { background: #d2b896; }
`;

function DiscoverScreen() {
  const [activeChip, setActiveChip] = useState(0);
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(true);

  const chips = ["Todos", "Apartamentos", "Casas", "Studios", "Coberturas"];
  const listings = [
    { cls: "listing-img-1", tag: "NOVO", name: "Apto 201 · Torre A", loc: "Vila Madalena", dist: "0,8 km", price: "R$ 3.800", beds: 2, baths: 1, match: 94 },
    { cls: "listing-img-2", tag: "DESTAQUE", name: "Casa Garden", loc: "Pinheiros", dist: "2,1 km", price: "R$ 6.200", beds: 3, baths: 2, match: 76 },
    { cls: "listing-img-3", tag: "ÚLTIMO", name: "Studio Premium", loc: "Itaim Bibi", dist: "3,4 km", price: "R$ 2.900", beds: 1, baths: 1, match: 88 },
  ];

  useEffect(() => {
    if (!navigator.geolocation) { setLocation("Localização indisponível"); setLocLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || "";
          const city = data.address?.city || data.address?.town || "";
          setLocation(suburb ? `${suburb}, ${city}` : city || "São Paulo, SP");
        } catch { setLocation("São Paulo, SP"); }
        setLocLoading(false);
      },
      () => { setLocation("São Paulo, SP"); setLocLoading(false); }
    );
  }, []);

  return (
    <div className="discover-screen">
      <div className="discover-title">Explorar</div>
      <div className="discover-sub">Encontre seu próximo lar</div>

      <div className="location-bar">
        <div className="location-bar-left">
          <div className="location-bar-icon"><Navigation2 size={13} /></div>
          <div>
            <div className="location-label">Sua localização</div>
            {locLoading
              ? <div className="location-value loading">Detectando...</div>
              : <div className="location-value">{location}</div>
            }
          </div>
        </div>
        <div className="location-change">Alterar <ChevronDown size={12} /></div>
      </div>

      <div className="search-row">
        <div className="search-bar">
          <Search size={16} />
          <span>Buscar por bairro, cidade...</span>
        </div>
        <div className="filter-btn"><SlidersHorizontal size={18} /></div>
      </div>
      <div className="chips">
        {chips.map((c, i) => (
          <div key={i} className={`chip ${activeChip === i ? "active" : ""}`} onClick={() => setActiveChip(i)}>{c}</div>
        ))}
      </div>
      <div className="listings">
        {listings.map((l, i) => (
          <div className="listing-card" key={i}>
            <div className={`listing-img ${l.cls}`}>
              <Building2 size={64} color="rgba(255,255,255,0.04)" />
            </div>
            <div className="listing-overlay" />
            <div className="listing-tag">{l.tag}</div>
            {l.match >= 60 && (
              <div className={`match-badge ${l.match >= 85 ? "high" : "mid"}`}>
                <div className="match-dot" />
                Match {l.match}%
              </div>
            )}
            <div className="listing-body">
              <div className="listing-name">{l.name}</div>
              <div className="listing-location" style={{justifyContent:"space-between"}}>
                <span style={{display:"flex",alignItems:"center",gap:"4px"}}><MapPin size={11} />{l.loc}</span>
                <span className="listing-distance"><Navigation2 size={10} />{l.dist}</span>
              </div>
              <div className="listing-footer">
                <div className="listing-price">{l.price}<span>/mês</span></div>
                <div className="listing-meta">
                  <div className="listing-meta-item"><BedDouble size={12} />{l.beds}</div>
                  <div className="listing-meta-item"><Bath size={12} />{l.baths}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ImovelApp() {
  const [activeNav, setActiveNav] = useState(0);
  const [hidden, setHidden] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="screen">
          {activeNav === 1 ? <DiscoverScreen /> : (
            <>
              <div className="header">
                <div className="header-top">
                  <div>
                    <div className="welcome-label">Bem-vinda de volta</div>
                    <div className="welcome-name">
                      Olá, Marina <span className="wave">👋</span>
                    </div>
                  </div>
                  <div className="header-actions">
                    <button className="icon-btn">
                      <Bell size={18} />
                      <div className="notif-dot" />
                    </button>
                    <button className="avatar-btn">M</button>
                  </div>
                </div>
              </div>

              <div className="card-section">
                <div className="property-card">
                  <div className="card-top">
                    <div className="card-top-left">
                      <div className="card-badge">Meu Imóvel</div>
                      <button className="eye-btn" onClick={() => setHidden(h => !h)}>
                        {hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <div className="building-icon">
                      <Building2 size={24} />
                    </div>
                  </div>
                  <div>
                    <div className="apt-name">Apto 304 · Torre B</div>
                    <div className="apt-location">{hidden ? <span className="hidden-value">••••••••••••</span> : "Jardins, São Paulo"}</div>
                  </div>
                  <div className="card-stats">
                    <div className="stat-box">
                      <div className="stat-label">Assinatura</div>
                      <div className="stat-value">{hidden ? <span className="hidden-value">R$ ••••</span> : "R$ 4.500"}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Vence em</div>
                      <div className="stat-value">5 dias</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Status</div>
                      <div className="stat-value status">
                        <div className="status-dot" />
                        Em dia
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="actions-section">
                <div className="actions-title">Ações rápidas</div>
                <div className="actions-grid">
                  {[
                    { icon: <Receipt size={24} />, label: "Fatura" },
                    { icon: <Wrench size={24} />, label: "Serviços" },
                    { icon: <Headphones size={24} />, label: "Assistência" },
                    { icon: <ChevronRight size={22} />, label: "Ver mais", more: true },
                  ].map((a, i) => (
                    <div className="action-item" key={i}>
                      <div className={`action-icon ${a.more ? "more" : ""}`}>{a.icon}</div>
                      <div className="action-label">{a.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="recent-section">
                <div className="section-header">
                  <div className="section-title">Atividade recente</div>
                  <div className="see-all">Ver tudo</div>
                </div>
                {[
                  { icon: <CreditCard size={18} />, color: "blue", title: "Fatura de Fevereiro", sub: "Pago em 25/02/2026", amount: "R$ 4.500" },
                  { icon: <CheckCircle2 size={18} />, color: "green", title: "Chamado resolvido", sub: "Manutenção elétrica · 20/02", amount: "" },
                  { icon: <ClipboardList size={18} />, color: "amber", title: "Renovação de contrato", sub: "Vence em 30/03/2026", amount: "Pendente" },
                ].map((item, i) => (
                  <div className="activity-item" key={i}>
                    <div className={`activity-icon ${item.color}`}>{item.icon}</div>
                    <div className="activity-info">
                      <div className="activity-title">{item.title}</div>
                      <div className="activity-sub">{item.sub}</div>
                    </div>
                    {item.amount && <div className="activity-amount">{item.amount}</div>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* bottom-nav agora fora do .screen, fixo no rodapé do .app */}
        <div className="bottom-nav">
          {[
            <Home size={20} />,
            <Search size={20} />,
            <MessageCircle size={20} />,
            <User size={20} />,
          ].map((icon, i) => (
            <div
              className={`nav-item ${activeNav === i ? "active" : ""}`}
              key={i}
              onClick={() => setActiveNav(i)}
            >
              {icon}
              <div className="nav-dot" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";

const SERVICES = ["Credit Solutions", "Trust & Estate", "Life Insurance"];

const STAGES = {
  "Credit Solutions": ["Lead", "Intake Sent", "Analysis", "Active Disputes", "Monitoring", "Closed"],
  "Trust & Estate": ["Lead", "Discovery Call", "Intake Sent", "Strategy Session", "Referral Coordination", "Closed"],
  "Life Insurance": ["Lead", "Needs Analysis", "Quote Sent", "Application", "Underwriting", "Closed"],
};

const STAGE_COLORS = {
  Lead: "#94a3b8",
  "Intake Sent": "#60a5fa",
  Analysis: "#a78bfa",
  "Active Disputes": "#f59e0b",
  Monitoring: "#34d399",
  Closed: "#10b981",
  "Discovery Call": "#60a5fa",
  "Strategy Session": "#a78bfa",
  "Referral Coordination": "#f59e0b",
  "Needs Analysis": "#60a5fa",
  "Quote Sent": "#a78bfa",
  Application: "#f59e0b",
  Underwriting: "#fb923c",
};

const EMPTY_CLIENT = {
  id: null,
  name: "",
  phone: "",
  email: "",
  service: "Credit Solutions",
  stage: "Lead",
  value: "",
  notes: "",
  followUp: "",
  createdAt: "",
};

const formatCurrency = (val) => {
  if (!val) return "—";
  return "$" + Number(val).toLocaleString();
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const serviceIcon = (s) => {
  if (s === "Credit Solutions") return "◈";
  if (s === "Trust & Estate") return "⬡";
  return "◎";
};

const serviceAccent = (s) => {
  if (s === "Credit Solutions") return "#4ade80";
  if (s === "Trust & Estate") return "#818cf8";
  return "#fb923c";
};

export default function JKMCRM() {
  const [clients, setClients] = useState([
    {
      id: 1, name: "Marcus & Linda Thompson", phone: "555-0101", email: "mthompson@email.com",
      service: "Trust & Estate", stage: "Discovery Call", value: "3500", notes: "Grandparents trust, 2 life policies. John Deere referral.",
      followUp: "2026-04-29", createdAt: "2026-04-20",
    },
    {
      id: 2, name: "Family Member - Trust", phone: "555-0102", email: "",
      service: "Trust & Estate", stage: "Intake Sent", value: "1500", notes: "Family referral. Follow up on intake form.",
      followUp: "2026-04-28", createdAt: "2026-04-22",
    },
    {
      id: 3, name: "Darnell W.", phone: "555-0199", email: "dw@email.com",
      service: "Credit Solutions", stage: "Active Disputes", value: "300", notes: "Collections + identity issues. 3 items in dispute.",
      followUp: "2026-05-01", createdAt: "2026-04-15",
    },
  ]);

  const [view, setView] = useState("pipeline"); // pipeline | list | detail | form
  const [activeService, setActiveService] = useState("Trust & Estate");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_CLIENT);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.service.toLowerCase().includes(search.toLowerCase()) ||
    c.stage.toLowerCase().includes(search.toLowerCase())
  );

  const pipelineClients = clients.filter(c => c.service === activeService);

  const totalValue = clients.reduce((sum, c) => sum + (Number(c.value) || 0), 0);
  const openClients = clients.filter(c => c.stage !== "Closed").length;
  const todayStr = new Date().toISOString().split("T")[0];
  const dueFollowUps = clients.filter(c => c.followUp && c.followUp <= todayStr && c.stage !== "Closed").length;

  const openForm = (client = null) => {
    if (client) {
      setForm({ ...client });
      setIsEditing(true);
    } else {
      setForm({ ...EMPTY_CLIENT, service: activeService, stage: STAGES[activeService][0], createdAt: todayStr });
      setIsEditing(false);
    }
    setView("form");
  };

  const saveClient = () => {
    if (!form.name.trim()) return;
    if (isEditing) {
      setClients(prev => prev.map(c => c.id === form.id ? form : c));
      setSelected(form);
    } else {
      const newClient = { ...form, id: Date.now() };
      setClients(prev => [...prev, newClient]);
    }
    setView(isEditing ? "detail" : "pipeline");
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
    setView("pipeline");
    setSelected(null);
  };

  const openDetail = (client) => {
    setSelected(client);
    setView("detail");
  };

  return (
    <div style={{
      fontFamily: "'DM Mono', 'Courier New', monospace",
      background: "#0a0a0f",
      minHeight: "100vh",
      color: "#e2e8f0",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        input, textarea, select {
          font-family: 'DM Mono', monospace;
          background: #0f1117;
          border: 1px solid #1e293b;
          color: #e2e8f0;
          border-radius: 6px;
          padding: 10px 12px;
          width: 100%;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus, textarea:focus, select:focus { border-color: #4ade80; }
        select option { background: #0f1117; }
        button { cursor: pointer; font-family: 'DM Mono', monospace; }
        .pill {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
        }
        .card {
          background: #0f1117;
          border: 1px solid #1e293b;
          border-radius: 10px;
          transition: border-color 0.2s, transform 0.15s;
        }
        .card:hover { border-color: #334155; transform: translateY(-1px); }
        .btn-primary {
          background: #4ade80;
          color: #0a0a0f;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: opacity 0.2s;
        }
        .btn-primary:hover { opacity: 0.85; }
        .btn-ghost {
          background: transparent;
          color: #94a3b8;
          border: 1px solid #1e293b;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 13px;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover { border-color: #475569; color: #e2e8f0; }
        .stage-dot {
          width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px;
        }
        .follow-up-badge {
          background: #7f1d1d;
          color: #fca5a5;
          border-radius: 4px;
          padding: 2px 8px;
          font-size: 11px;
        }
      `}</style>

      {/* Header */}
      <div style={{ background: "#0a0a0f", borderBottom: "1px solid #1e293b", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>JKM</span>
          <span style={{ color: "#4ade80", fontSize: 12, letterSpacing: "0.15em" }}>CLIENT OS</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["pipeline", "list"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? "#1e293b" : "transparent",
              color: view === v ? "#e2e8f0" : "#475569",
              border: "1px solid",
              borderColor: view === v ? "#334155" : "transparent",
              padding: "6px 14px",
              borderRadius: 6,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>{v}</button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: "flex", gap: 1, borderBottom: "1px solid #1e293b" }}>
        {[
          { label: "Pipeline Value", value: formatCurrency(totalValue), accent: "#4ade80" },
          { label: "Active Clients", value: openClients, accent: "#818cf8" },
          { label: "Due Follow-ups", value: dueFollowUps, accent: dueFollowUps > 0 ? "#f87171" : "#4ade80" },
          { label: "Total Clients", value: clients.length, accent: "#94a3b8" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "14px 20px", background: "#0a0a0f", borderRight: i < 3 ? "1px solid #1e293b" : "none" }}>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: s.accent, fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "24px 28px" }}>

        {/* PIPELINE VIEW */}
        {(view === "pipeline" || view === "list") && (
          <>
            {/* Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {SERVICES.map(s => (
                  <button key={s} onClick={() => setActiveService(s)} style={{
                    background: activeService === s ? serviceAccent(s) + "18" : "transparent",
                    color: activeService === s ? serviceAccent(s) : "#475569",
                    border: `1px solid ${activeService === s ? serviceAccent(s) + "50" : "#1e293b"}`,
                    padding: "7px 14px",
                    borderRadius: 6,
                    fontSize: 12,
                    letterSpacing: "0.05em",
                  }}>
                    {serviceIcon(s)} {s}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {view === "list" && (
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." style={{ width: 200, padding: "8px 12px" }} />
                )}
                <button className="btn-primary" onClick={() => openForm()}>+ New Client</button>
              </div>
            </div>

            {/* Pipeline Kanban */}
            {view === "pipeline" && (
              <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12 }}>
                {STAGES[activeService].map(stage => {
                  const stageClients = pipelineClients.filter(c => c.stage === stage);
                  return (
                    <div key={stage} style={{ minWidth: 220, flex: "0 0 220px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className="stage-dot" style={{ background: STAGE_COLORS[stage] || "#475569" }} />
                          <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b" }}>{stage}</span>
                        </div>
                        <span style={{ fontSize: 11, color: "#334155", background: "#1e293b", borderRadius: 10, padding: "1px 8px" }}>{stageClients.length}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {stageClients.map(c => (
                          <div key={c.id} className="card" onClick={() => openDetail(c)} style={{ padding: "12px 14px", cursor: "pointer" }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0", marginBottom: 6, lineHeight: 1.3 }}>{c.name}</div>
                            {c.value && <div style={{ fontSize: 12, color: serviceAccent(c.service), marginBottom: 4 }}>{formatCurrency(c.value)}</div>}
                            {c.followUp && c.followUp <= todayStr && c.stage !== "Closed" && (
                              <span className="follow-up-badge">Follow up overdue</span>
                            )}
                            {c.followUp && c.followUp > todayStr && (
                              <div style={{ fontSize: 11, color: "#475569" }}>↻ {formatDate(c.followUp)}</div>
                            )}
                          </div>
                        ))}
                        {stageClients.length === 0 && (
                          <div style={{ border: "1px dashed #1e293b", borderRadius: 8, padding: "20px 12px", textAlign: "center", color: "#1e293b", fontSize: 12 }}>empty</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {view === "list" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.length === 0 && <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>No clients found.</div>}
                {filtered.map(c => (
                  <div key={c.id} className="card" onClick={() => openDetail(c)} style={{ padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 20, color: serviceAccent(c.service) }}>{serviceIcon(c.service)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{c.service} · {c.phone || "no phone"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ marginBottom: 4 }}>
                        <span className="pill" style={{ background: (STAGE_COLORS[c.stage] || "#475569") + "22", color: STAGE_COLORS[c.stage] || "#475569" }}>{c.stage}</span>
                      </div>
                      <div style={{ fontSize: 12, color: serviceAccent(c.service) }}>{formatCurrency(c.value)}</div>
                    </div>
                    {c.followUp && c.followUp <= todayStr && c.stage !== "Closed" && (
                      <span className="follow-up-badge">!</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* DETAIL VIEW */}
        {view === "detail" && selected && (() => {
          const client = clients.find(c => c.id === selected.id) || selected;
          return (
            <div style={{ maxWidth: 620 }}>
              <button className="btn-ghost" onClick={() => setView("pipeline")} style={{ marginBottom: 20, fontSize: 12 }}>← Back</button>
              <div className="card" style={{ padding: "28px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 11, color: serviceAccent(client.service), letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                      {serviceIcon(client.service)} {client.service}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 500, fontFamily: "'Syne', sans-serif", color: "#fff", lineHeight: 1.2 }}>{client.name}</div>
                  </div>
                  <span className="pill" style={{ background: (STAGE_COLORS[client.stage] || "#475569") + "22", color: STAGE_COLORS[client.stage] || "#475569", marginTop: 4 }}>{client.stage}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  {[
                    { label: "Phone", value: client.phone },
                    { label: "Email", value: client.email },
                    { label: "Deal Value", value: formatCurrency(client.value) },
                    { label: "Follow-up", value: formatDate(client.followUp) },
                    { label: "Added", value: formatDate(client.createdAt) },
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{f.label}</div>
                      <div style={{ fontSize: 13, color: f.value === "—" ? "#334155" : "#e2e8f0" }}>{f.value || "—"}</div>
                    </div>
                  ))}
                </div>

                {client.notes && (
                  <div style={{ background: "#0a0a0f", border: "1px solid #1e293b", borderRadius: 8, padding: "14px 16px", marginBottom: 20 }}>
                    <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Notes</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{client.notes}</div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-primary" onClick={() => openForm(client)}>Edit</button>
                  <button className="btn-ghost" onClick={() => deleteClient(client.id)} style={{ color: "#f87171", borderColor: "#7f1d1d" }}>Delete</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* FORM VIEW */}
        {view === "form" && (
          <div style={{ maxWidth: 560 }}>
            <button className="btn-ghost" onClick={() => setView(isEditing ? "detail" : "pipeline")} style={{ marginBottom: 20, fontSize: 12 }}>← Back</button>
            <div className="card" style={{ padding: "28px 28px" }}>
              <div style={{ fontSize: 16, fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 24, color: "#fff" }}>
                {isEditing ? "Edit Client" : "New Client"}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Full Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Client full name" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Phone</label>
                    <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="555-0100" />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email</label>
                    <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Service</label>
                    <select value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value, stage: STAGES[e.target.value][0] }))}>
                      {SERVICES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Stage</label>
                    <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}>
                      {STAGES[form.service].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Deal Value ($)</label>
                    <input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="0" />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Follow-up Date</label>
                    <input type="date" value={form.followUp} onChange={e => setForm(p => ({ ...p, followUp: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Situation, assets, goals, anything relevant..." rows={4} style={{ resize: "vertical" }} />
                </div>

                <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
                  <button className="btn-primary" onClick={saveClient}>{isEditing ? "Save Changes" : "Add Client"}</button>
                  <button className="btn-ghost" onClick={() => setView(isEditing ? "detail" : "pipeline")}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

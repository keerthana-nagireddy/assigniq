import TEAM from "../data/team";

function PeopleView({ tasks }) {
  const allMembers = Object.values(TEAM).flat();

  const getStats = (memberId) => {
    const assigned = tasks.filter(t => t.assignee === memberId);
    const completed = assigned.filter(t => t.status === "done");
    return {
      total: assigned.length,
      completed: completed.length,
      pending: assigned.length - completed.length,
      performance: assigned.length === 0
        ? 0
        : Math.round((completed.length / assigned.length) * 100)
    };
  };

  const getPerformanceColor = (p) => {
    if (p === 100) return "#10b981";
    if (p >= 30)   return "#f59e0b";
    return "#ef4444";
  };

  const getInitials = (name) =>
    name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={container}>
      <h2 style={heading}>👥 Team Overview</h2>

      <div style={grid}>
        {allMembers.map(member => {
          const stats = getStats(member.id);
          const color = getPerformanceColor(stats.performance);

          return (
            <div
              key={member.id}
              style={card}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)";
              }}
            >
              {/* AVATAR */}
              <div style={avatar}>{getInitials(member.name)}</div>

              <h3 style={name}>{member.name}</h3>

              <p style={text}>📋 Tasks: <strong>{stats.total}</strong></p>
              <p style={{ ...text, color: "#10b981" }}>✅ Done: {stats.completed}</p>
              <p style={{ ...text, color: "#f59e0b" }}>⏳ Pending: {stats.pending}</p>

              {/* PROGRESS */}
              <div style={progressBar}>
                <div
                  style={{
                    ...progressFill,
                    width: `${stats.performance}%`,
                    background: color
                  }}
                />
              </div>

              <p style={{ ...percent, color }}>{stats.performance}% Performance</p>

              {/* STATUS TAGS */}
              {stats.total === 0 && (
                <span style={{
                  ...pill,
                  background: "rgba(16,185,129,0.1)",
                  color: "#10b981",
                  border: "1px solid rgba(16,185,129,0.25)"
                }}>
                  🟢 Available
                </span>
              )}

              {stats.total > 5 && (
                <span style={{
                  ...pill,
                  background: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.25)"
                }}>
                  🔴 Overloaded
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== PARCHMENT + INDIGO ===================== */

const container = {
  padding: "20px"
};

const heading = {
  textAlign: "center",
  color: "#2d1b69",
  marginBottom: "24px",
  fontSize: "22px",
  fontWeight: "700"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px"
};

const card = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  border: "1px solid rgba(79,70,229,0.08)",
  transition: "all 0.2s ease",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const avatar = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "16px",
  marginBottom: "12px"
};

const name = {
  color: "#2d1b69",
  marginBottom: "10px",
  fontWeight: "700",
  fontSize: "15px"
};

const text = {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "4px",
  alignSelf: "flex-start"
};

const progressBar = {
  height: "7px",
  background: "rgba(0,0,0,0.05)",
  borderRadius: "6px",
  marginTop: "12px",
  width: "100%"
};

const progressFill = {
  height: "100%",
  borderRadius: "6px",
  transition: "width 0.6s ease"
};

const percent = {
  fontSize: "12px",
  marginTop: "8px",
  fontWeight: "700"
};

const pill = {
  display: "inline-block",
  marginTop: "8px",
  padding: "4px 12px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "700"
};

export default PeopleView;
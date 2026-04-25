import TEAM from "../data/team";

/* TYPE COLORS (INDIGO SYSTEM) */
const getTypeColor = (type) => {
  const map = {
    frontend: { color: "#4f46e5", bg: "rgba(79,70,229,0.1)", border: "rgba(79,70,229,0.25)" },
    backend:  { color: "#0ea5e9", bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.25)" },
    ai:       { color: "#7c3aed", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.25)" },
    ml:       { color: "#9333ea", bg: "rgba(147,51,234,0.1)", border: "rgba(147,51,234,0.25)" },
    design:   { color: "#db2777", bg: "rgba(219,39,119,0.1)", border: "rgba(219,39,119,0.25)" },
    devops:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
    testing:  { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  };
  return map[type] || { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)" };
};

function TaskCard({ task, updateStatus, deleteTask }) {
  const allMembers = Object.values(TEAM).flat();
  const user = allMembers.find(m => m.id === task.assignee);

  /* STATUS */
  const getStatus = () => {
    if (task.status === "todo")
      return { label: "To Do", bg: "rgba(79,70,229,0.1)", color: "#4f46e5", border: "rgba(79,70,229,0.25)" };

    if (task.status === "inprogress")
      return { label: "In Progress", bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.25)" };

    return { label: "Done", bg: "rgba(16,185,129,0.1)", color: "#10b981", border: "rgba(16,185,129,0.25)" };
  };

  /* PRIORITY BAR (REFINED) */
  const getPriority = () => {
    if (task.priority === "high")   return "#ef4444";
    if (task.priority === "medium") return "#f59e0b";
    return "#10b981";
  };

  const status = getStatus();
  const priorityColor = getPriority();
  const tc = getTypeColor(task.type);

  const formattedDate = task.deadline
    ? new Date(task.deadline).toLocaleDateString()
    : null;

  return (
    <div
      style={card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)";
      }}
    >
      {/* PRIORITY BAR */}
      <div style={{ ...priorityBar, background: priorityColor }} />

      {/* TITLE */}
      <h3 style={title}>{task.title}</h3>

      {/* ASSIGNEE */}
      <p style={meta}>👤 {user ? user.name : "Unassigned"}</p>

      {/* TYPE */}
      <span style={{
        ...pill,
        color: tc.color,
        background: tc.bg,
        border: `1px solid ${tc.border}`
      }}>
        {task.type}
      </span>

      {/* DEADLINE */}
      {formattedDate && <p style={deadline}>📅 {formattedDate}</p>}

      {/* STATUS */}
      <span style={{
        ...badge,
        background: status.bg,
        color: status.color,
        border: `1px solid ${status.border}`
      }}>
        {status.label}
      </span>

      {/* ACTIONS */}
      <div style={actions}>
        <button
          onClick={() => updateStatus(task.id, "todo")}
          style={btn}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(79,70,229,0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(79,70,229,0.08)"}
        >📝</button>

        <button
          onClick={() => updateStatus(task.id, "inprogress")}
          style={btn}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(79,70,229,0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(79,70,229,0.08)"}
        >⚡</button>

        <button
          onClick={() => updateStatus(task.id, "done")}
          style={btn}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(79,70,229,0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(79,70,229,0.08)"}
        >✅</button>

        <button
          onClick={() => deleteTask(task.id)}
          style={deleteBtn}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
        >🗑</button>
      </div>
    </div>
  );
}

/* ===================== FINAL STYLES ===================== */

const card = {
  position: "relative",
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  color: "#2d1b69",
  borderRadius: "16px",
  padding: "16px 16px 14px 20px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  border: "1px solid rgba(79,70,229,0.08)",
  transition: "all 0.2s ease"
};

const priorityBar = {
  position: "absolute",
  left: 0,
  top: 0,
  width: "5px",
  height: "100%",
  borderRadius: "16px 0 0 16px"
};

const title = {
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "6px",
  color: "#2d1b69"
};

const meta = {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "6px"
};

const deadline = {
  fontSize: "12px",
  color: "#9ca3af",
  marginBottom: "8px"
};

const pill = {
  display: "inline-block",
  fontSize: "10px",
  padding: "3px 10px",
  borderRadius: "999px",
  marginBottom: "8px",
  fontWeight: "700",
  letterSpacing: "1px",
  textTransform: "uppercase"
};

const badge = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  marginBottom: "12px",
  fontWeight: "700"
};

const actions = {
  display: "flex",
  gap: "6px"
};

const btn = {
  flex: 1,
  padding: "6px",
  borderRadius: "8px",
  border: "1px solid rgba(79,70,229,0.15)",
  background: "rgba(79,70,229,0.08)",
  color: "#4f46e5",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.2s ease"
};

const deleteBtn = {
  flex: 1,
  padding: "6px",
  borderRadius: "8px",
  border: "1px solid rgba(239,68,68,0.2)",
  background: "rgba(239,68,68,0.1)",
  color: "#ef4444",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.2s ease"
};

export default TaskCard;
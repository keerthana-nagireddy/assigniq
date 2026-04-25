import TEAM from "../data/team";

function TodayTasksView({ tasks }) {
  const today = new Date().toDateString();

  const todayTasks = tasks
    .filter(task => {
      if (!task.deadline) return false;
      return new Date(task.deadline).toDateString() === today;
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const allMembers = Object.values(TEAM).flat();
  const getUser = (id) => allMembers.find(m => m.id === id);

  return (
    <div style={container}>
      <h2 style={heading}>📅 Today’s Tasks</h2>

      {todayTasks.length === 0 && (
        <p style={emptyMsg}>✨ Nothing scheduled for today — enjoy the calm</p>
      )}

      <div style={grid}>
        {todayTasks.map(task => {
          const user = getUser(task.assignee);
          const diff = (new Date(task.deadline) - new Date()) / (1000 * 60);
          const isUrgent = diff <= 60 && diff > 0;

          return (
            <div
              key={task.id}
              style={{
                ...card,
                borderLeft: isUrgent
                  ? "4px solid #ef4444"
                  : "4px solid #4f46e5"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)";
              }}
            >
              <h3 style={taskTitle}>{task.title}</h3>

              <p style={meta}>👤 {user ? user.name : "Unassigned"}</p>
              <p style={meta}>📂 {task.type}</p>

              <p style={deadlineStyle}>
                ⏰ {new Date(task.deadline).toLocaleTimeString()}
              </p>

              {isUrgent && <p style={urgent}>⚠️ Due within 1 hour</p>}

              <span style={statusBadge(task.status)}>
                {task.status}
              </span>
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
  fontWeight: "700",
  letterSpacing: "0.5px"
};

const emptyMsg = {
  textAlign: "center",
  color: "#6b7280",
  fontSize: "15px",
  marginTop: "40px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "16px"
};

const card = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  padding: "18px",
  borderRadius: "16px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  border: "1px solid rgba(79,70,229,0.08)",
  transition: "all 0.2s ease",
  color: "#2d1b69"
};

const taskTitle = {
  fontSize: "15px",
  fontWeight: "600",
  marginBottom: "10px",
  color: "#2d1b69"
};

const meta = {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "4px"
};

const deadlineStyle = {
  marginTop: "8px",
  fontWeight: "600",
  color: "#4f46e5",
  fontSize: "13px"
};

const urgent = {
  color: "#ef4444",
  fontWeight: "700",
  marginTop: "6px",
  fontSize: "12px"
};

const statusBadge = (status) => ({
  display: "inline-block",
  marginTop: "10px",
  padding: "4px 12px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "700",

  background:
    status === "done"       ? "rgba(16,185,129,0.1)" :
    status === "inprogress" ? "rgba(245,158,11,0.1)" :
                              "rgba(79,70,229,0.1)",

  color:
    status === "done"       ? "#10b981" :
    status === "inprogress" ? "#f59e0b" :
                              "#4f46e5",

  border: `1px solid ${
    status === "done"       ? "rgba(16,185,129,0.25)" :
    status === "inprogress" ? "rgba(245,158,11,0.25)" :
                              "rgba(79,70,229,0.25)"
  }`
});

export default TodayTasksView;
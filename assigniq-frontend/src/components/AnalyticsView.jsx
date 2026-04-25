import TEAM from "../data/team";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function AnalyticsView({ tasks }) {

  /* INDIGO SYSTEM COLORS */
  const COLORS = ["#4f46e5", "#f59e0b", "#10b981"];

  const statusData = [
    { name: "To Do",       value: tasks.filter(t => t.status === "todo").length },
    { name: "In Progress", value: tasks.filter(t => t.status === "inprogress").length },
    { name: "Done",        value: tasks.filter(t => t.status === "done").length }
  ];

  const departmentCards = Object.keys(TEAM).map(dept => ({
    dept,
    members: TEAM[dept].map(member => {
      const assigned  = tasks.filter(t => t.assignee === member.id);
      const completed = assigned.filter(t => t.status === "done");
      const percent   = assigned.length === 0
        ? 0
        : Math.round((completed.length / assigned.length) * 100);
      return { ...member, total: assigned.length, completed: completed.length, percent };
    })
  }));

  const getInitials = (name) =>
    name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const getBarColor = (p) =>
    p >= 100 ? "#10b981" : p >= 30 ? "#f59e0b" : "#ef4444";

  return (
    <div style={container}>
      <h2 style={mainTitle}>📊 Team Analytics</h2>

      {/* PIE CHART */}
      <div style={box}>
        <h3 style={sectionTitle}>📌 Task Distribution</h3>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={statusData} dataKey="value" outerRadius={95} label>
              {statusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid rgba(79,70,229,0.15)",
                borderRadius: "10px",
                color: "#2d1b69"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* DEPARTMENTS */}
      {departmentCards.map(dept => (
        <div key={dept.dept} style={deptSection}>
          <h3 style={deptTitle}>{dept.dept.toUpperCase()}</h3>

          <div style={grid}>
            {dept.members.map(member => (
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
                <div style={memberAvatar}>
                  {getInitials(member.name)}
                </div>

                <div style={stats}>
                  <p style={taskText}>📋 {member.total} tasks</p>
                  <p style={doneText}>✅ {member.completed} done</p>
                </div>

                <div style={progressBg}>
                  <div
                    style={{
                      ...progressFill,
                      width: `${member.percent}%`,
                      background: getBarColor(member.percent)
                    }}
                  />
                </div>

                <p style={percentStyle}>{member.percent}%</p>
                <p style={nameStyle}>{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* DEADLINES */}
      <div style={box}>
        <h3 style={sectionTitle}>⏰ Upcoming Deadlines</h3>

        {tasks
          .filter(t => t.deadline)
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 5)
          .map(task => (
            <div key={task.id} style={deadlineRow}>
              <span style={dot}>●</span>
              <span style={deadlineTitle}>{task.title}</span>
              <span style={deadlineDate}>
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ===================== PARCHMENT + INDIGO ===================== */

const container = {
  padding: "20px"
};

const mainTitle = {
  textAlign: "center",
  marginBottom: "24px",
  fontSize: "22px",
  fontWeight: "700",
  color: "#2d1b69"
};

const box = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  padding: "22px",
  borderRadius: "16px",
  marginBottom: "25px",
  border: "1px solid rgba(79,70,229,0.08)",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
};

const sectionTitle = {
  color: "#4f46e5",
  marginBottom: "14px",
  fontWeight: "700",
  fontSize: "15px"
};

const deptSection = {
  marginBottom: "30px"
};

const deptTitle = {
  marginBottom: "14px",
  fontSize: "13px",
  fontWeight: "700",
  color: "#6b7280",
  letterSpacing: "2px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "14px"
};

const card = {
  background: "rgba(255,255,255,0.85)",
  borderRadius: "14px",
  padding: "16px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  border: "1px solid rgba(79,70,229,0.08)",
  transition: "all 0.2s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const memberAvatar = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "13px",
  marginBottom: "10px"
};

const stats = {
  fontSize: "12px",
  marginBottom: "10px",
  textAlign: "center"
};

const taskText = { color: "#6b7280" };
const doneText = { color: "#10b981" };

const progressBg = {
  width: "100%",
  height: "6px",
  background: "rgba(0,0,0,0.05)",
  borderRadius: "10px",
  overflow: "hidden",
  marginBottom: "6px"
};

const progressFill = {
  height: "100%",
  borderRadius: "10px",
  transition: "width 0.6s ease"
};

const percentStyle = {
  fontSize: "12px",
  color: "#6b7280"
};

const nameStyle = {
  fontWeight: "700",
  marginTop: "6px",
  color: "#2d1b69",
  fontSize: "13px"
};

const deadlineRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
  fontSize: "13px",
  padding: "10px 14px",
  borderRadius: "10px",
  background: "rgba(79,70,229,0.05)",
  border: "1px solid rgba(79,70,229,0.1)"
};

const dot = {
  color: "#4f46e5",
  fontSize: "10px"
};

const deadlineTitle = {
  flex: 1,
  color: "#2d1b69"
};

const deadlineDate = {
  color: "#f59e0b",
  fontWeight: "700",
  fontSize: "12px"
};

export default AnalyticsView;
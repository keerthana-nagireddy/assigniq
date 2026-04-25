import { useState, useRef, useEffect } from "react";

function Sidebar({ setView }) {
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState("board");
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const navigate = (v) => {
    setView(v);
    setActiveView(v);
    setOpen(false);
  };

  const navItems = [
    { key: "board",     icon: "🧩", label: "Board"       },
    { key: "people",    icon: "👥", label: "People"      },
    { key: "analytics", icon: "📊", label: "Analytics"   },
    { key: "today",     icon: "📅", label: "Today Tasks" },
  ];

  return (
    <>
      {/* HAMBURGER */}
      <div style={hamburger} onClick={() => setOpen(!open)}>☰</div>

      {/* OVERLAY */}
      {open && <div style={overlay} />}

      {/* SIDEBAR */}
      <div
        ref={sidebarRef}
        style={{
          ...sidebar,
          transform: open ? "translateX(0)" : "translateX(-100%)"
        }}
      >
        {/* LOGO */}
        <div style={logoArea}>
          <span style={logoIcon}>💜</span>
          <h2 style={logoText}>AssignIQ</h2>
        </div>

        <div style={divider} />

        {/* NAV */}
        {navItems.map(item => (
          <button
            key={item.key}
            style={{
              ...navItem,
              ...(activeView === item.key && navItemActive)
            }}
            onClick={() => navigate(item.key)}
            onMouseEnter={(e) => {
              if (activeView !== item.key) {
                e.currentTarget.style.background = "rgba(79,70,229,0.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== item.key) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <span style={{ fontSize: "16px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

        <div style={{ ...divider, marginTop: "auto" }} />

        <p style={version}>AssignIQ v2.0 · Indigo</p>
      </div>
    </>
  );
}

/* ===================== PARCHMENT + INDIGO ===================== */

const hamburger = {
  position: "fixed",
  top: "20px",
  left: "20px",
  fontSize: "18px",
  cursor: "pointer",
  zIndex: 1002,
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#ffffff",
  padding: "10px 14px",
  borderRadius: "10px",
  boxShadow: "0 6px 18px rgba(79,70,229,0.3)",
  border: "none",
  transition: "all 0.2s ease"
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backdropFilter: "blur(6px)",
  background: "rgba(0,0,0,0.15)",
  zIndex: 1000
};

const sidebar = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100%",
  width: "240px",
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(14px)",
  color: "#2d1b69",
  padding: "24px 16px",
  transition: "0.3s ease",
  zIndex: 1001,
  boxShadow: "4px 0 30px rgba(0,0,0,0.08)",
  borderRight: "1px solid rgba(79,70,229,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "6px"
};

const logoArea = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "6px",
  padding: "4px 8px"
};

const logoIcon = {
  fontSize: "22px"
};

const logoText = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#4f46e5",
  letterSpacing: "1px"
};

const divider = {
  borderTop: "1px solid rgba(79,70,229,0.08)",
  margin: "8px 0"
};

const navItem = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  width: "100%",
  padding: "11px 14px",
  border: "1px solid transparent",
  borderRadius: "10px",
  background: "transparent",
  color: "#6b7280",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s ease"
};

const navItemActive = {
  background: "rgba(79,70,229,0.1)",
  border: "1px solid rgba(79,70,229,0.2)",
  color: "#4f46e5",
  boxShadow: "inset 0 1px 0 rgba(79,70,229,0.08)"
};

const version = {
  fontSize: "11px",
  color: "#9ca3af",
  textAlign: "center",
  marginTop: "8px"
};

export default Sidebar;
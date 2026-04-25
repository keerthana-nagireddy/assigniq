import { useState, useEffect } from "react";
import TaskCard from "./components/TaskCard";
import Sidebar from "./components/Sidebar";
import TodayTasksView from "./components/TodayTasksView";
import PeopleView from "./components/PeopleView";
import AnalyticsView from "./components/AnalyticsView";
import TEAM from "./data/team";
import assignTask from "./utils/assignTask";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("board");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("frontend");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));

    socket.on("taskAdded", (task) => {
      setTasks(prev =>
        prev.find(t => Number(t.id) === Number(task.id)) ? prev : [...prev, task]
      );
    });
    socket.on("taskUpdated", ({ id, status }) => {
      setTasks(prev =>
        prev.map(t => Number(t.id) === Number(id) ? { ...t, status } : t)
      );
    });
    socket.on("taskDeleted", ({ id }) => {
      setTasks(prev => prev.filter(t => Number(t.id) !== Number(id)));
    });
    return () => {
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        if (!task.deadline) return;
        const diff = new Date(task.deadline) - now;
        const mins = diff / (1000 * 60);
        if (mins > 0 && mins <= 60) {
          alert(`⚠️ "${task.title}" due in ${Math.floor(mins)} mins!`);
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || task.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddTask = () => {
    if (!title.trim()) return;
    const today = new Date().toISOString().split("T")[0];
    if (deadline && deadline < today) {
      alert("❌ Deadline cannot be in the past");
      return;
    }
    let finalDeadline = deadline;
    if (deadline) finalDeadline = `${deadline}T18:00:00`;

    const newTask = {
      id: Date.now(),
      title,
      type,
      status: "todo",
      deadline: finalDeadline,
      priority
    };
    const assignedUser = assignTask(newTask, TEAM, tasks);
    newTask.assignee = assignedUser.id;

    setTasks(prev => [...prev, newTask]);
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    });
    setTitle("");
    setDeadline("");
  };

  const updateStatus = (id, newStatus) => {
    setTasks(prev =>
      prev.map(task =>
        Number(task.id) === Number(id) ? { ...task, status: newStatus } : task
      )
    );
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => Number(t.id) !== Number(id)));
    fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
  };

  return (
    <div style={container}>
      <Sidebar setView={setView} />

      <h1 style={header}>AssignIQ 🧠</h1>

      {view === "today"     && <TodayTasksView tasks={tasks} />}
      {view === "people"    && <PeopleView tasks={tasks} />}
      {view === "analytics" && <AnalyticsView tasks={tasks} />}

      {view === "board" && (
        <>
          {/* SEARCH & FILTER */}
          <div style={toolbar}>
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={input}
            />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={input}>
              <option value="all">All Types</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="testing">Testing</option>
              <option value="ai">AI</option>
              <option value="ml">ML</option>
              <option value="design">Design</option>
              <option value="devops">DevOps</option>
            </select>
          </div>

          {/* ADD TASK */}
          <div style={addBar}>
            <input
              placeholder="Create new issue..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={input}
            />
            <select value={type} onChange={(e) => setType(e.target.value)} style={input}>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="testing">Testing</option>
              <option value="ai">AI</option>
              <option value="ml">ML</option>
              <option value="design">Design</option>
              <option value="devops">DevOps</option>
            </select>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={input}
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={input}>
              <option value="low">Low 🟢</option>
              <option value="medium">Medium 🟡</option>
              <option value="high">High 🔴</option>
            </select>
            <button style={button} onClick={handleAddTask}>+ Create</button>
          </div>

          {/* BOARD */}
          <DragDropContext
            onDragEnd={(result) => {
              if (!result.destination) return;
              updateStatus(Number(result.draggableId), result.destination.droppableId);
            }}
          >
            <div style={board}>
              {["todo", "inprogress", "done"].map(status => (
                <Droppable droppableId={status} key={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        ...column,
                        ...(status === "todo"       && columnTodo),
                        ...(status === "inprogress" && columnInProgress),
                        ...(status === "done"       && columnDone),
                      }}
                    >
                      <h3 style={{
                        ...columnTitle,
                        ...(status === "todo"       && { color: "#4f46e5", borderBottomColor: "rgba(79,70,229,0.2)"  }),
                        ...(status === "inprogress" && { color: "#b45309", borderBottomColor: "rgba(180,83,9,0.2)"   }),
                        ...(status === "done"       && { color: "#047857", borderBottomColor: "rgba(4,120,87,0.2)"   }),
                      }}>
                        {status === "todo"       && "📝 To Do"}
                        {status === "inprogress" && "⚡ In Progress"}
                        {status === "done"       && "✅ Done"}
                      </h3>

                      {filteredTasks
                        .filter(task => task.status === status)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{ marginBottom: "10px", ...provided.draggableProps.style }}
                              >
                                <TaskCard
                                  task={task}
                                  updateStatus={updateStatus}
                                  deleteTask={deleteTask}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </>
      )}
    </div>
  );
}

/* ===================== PARCHMENT & INDIGO ===================== */

const container = {
  padding: "25px",
  background: "linear-gradient(145deg, #f0ebe0 0%, #ede7d9 40%, #e8e1d4 100%)",
  minHeight: "100vh"
};

const header = {
  textAlign: "center",
  fontSize: "32px",
  marginBottom: "20px",
  fontWeight: "800",
  color: "#2d1b69",
  letterSpacing: "1px",
};

const toolbar = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "15px"
};

const addBar = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "25px",
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(12px)",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid rgba(79,70,229,0.12)",
  boxShadow: "0 2px 16px rgba(79,70,229,0.08), 0 1px 0 rgba(255,255,255,0.9) inset"
};

const board = {
  display: "flex",
  gap: "18px",
  padding: "10px"
};

const column = {
  flex: 1,
  padding: "16px",
  borderRadius: "20px",
  minHeight: "520px",
};

const columnTodo = {
  background: "rgba(255,255,255,0.6)",
  border: "1px solid rgba(79,70,229,0.12)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
};

const columnInProgress = {
  background: "rgba(255,255,255,0.6)",
  border: "1px solid rgba(79,70,229,0.12)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
};

const columnDone = {
  background: "rgba(255,255,255,0.6)",
  border: "1px solid rgba(79,70,229,0.12)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
};

const columnTitle = {
  textAlign: "center",
  marginBottom: "14px",
  fontWeight: "800",
  fontSize: "12px",
  letterSpacing: "2px",
  textTransform: "uppercase",
  borderBottom: "2px solid",
  paddingBottom: "12px"
};

const input = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(79,70,229,0.2)",
  outline: "none",
  background: "rgba(255,255,255,0.9)",
  color: "#2d1b69",
  fontSize: "14px",
  transition: "all 0.2s ease",
 boxShadow: "0 0 0 3px rgba(79,70,229,0.15)"
};

const button = {
  padding: "10px 22px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #4338ca, #6d28d9)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
  letterSpacing: "0.3px",
  boxShadow: "0 4px 16px rgba(79,70,229,0.4)"
};

export default App;
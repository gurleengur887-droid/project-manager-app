import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://project-manager-app-ka5u.onrender.com", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

function TaskList({ project }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    socket.emit("joinProject", project._id);

    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `https://project-manager-app-ka5u.onrender.com/api/tasks/${project._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTasks(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTasks();

    socket.on("taskCreated", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
    };
  }, [project]);

  // CREATE TASK
  const createTask = async () => {
    const title = prompt("Task title?");
    const description = prompt("Description?");
    if (!title) return;

    try {
      const res = await axios.post(
        "https://project-manager-app-ka5u.onrender.com/api/tasks",
        {
          title,
          description,
          projectId: project._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTasks([...tasks, res.data]);
    } catch (err) {
      alert("Error creating task");
    }
  };

  // TOGGLE STATUS
  const toggleTask = async (task) => {
    let newStatus = "done";

    if (task.status === "done") newStatus = "todo";
    else if (task.status === "todo") newStatus = "in-progress";
    else if (task.status === "in-progress") newStatus = "done";

    try {
      const res = await axios.put(
        `https://project-manager-app-ka5u.onrender.com/api/tasks/${task._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch (err) {
      alert("Error updating task");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `https://project-manager-app-ka5u.onrender.com/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Error deleting task");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{project.name}</h2>

      <button style={styles.addBtn} onClick={createTask}>
        + Add Task
      </button>

      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <div style={styles.list}>
          {tasks.map((t) => (
            <div key={t._id} style={styles.card}>
              <h4
                style={{
                  textDecoration:
                    t.status === "done" ? "line-through" : "none",
                }}
              >
                {t.title}
              </h4>

              <p>{t.description}</p>

              {/* ✅ ADDED INFO */}
              <p>Status: {t.status}</p>
              <p style={{ fontSize: "12px", color: "gray" }}>
                Created:{" "}
                {t.createdAt
                  ? new Date(t.createdAt).toLocaleString()
                  : "N/A"}
              </p>

              <div style={styles.actions}>
                <button
                  style={styles.completeBtn}
                  onClick={() => toggleTask(t)}
                >
                  {t.status === "done" ? "Undo" : "Done"}
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteTask(t._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    color: "white",
  },
  heading: {
    marginBottom: "15px",
  },
  addBtn: {
    padding: "8px 12px",
    background: "#3b82f6",
    border: "none",
    borderRadius: "5px",
    color: "white",
    marginBottom: "15px",
    cursor: "pointer",
  },
  list: {
    display: "grid",
    gap: "10px",
  },
  card: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "8px",
  },
  actions: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  completeBtn: {
    padding: "5px 10px",
    background: "#22c55e",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "5px 10px",
    background: "#ef4444",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
};

export default TaskList;
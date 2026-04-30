import { useEffect, useState } from "react";
import axios from "axios";
import TaskList from "../components/TaskList";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
  }
}, []);
  // 🔹 Fetch projects
  useEffect(() => {
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`https://project-manager-app-ka5u.onrender.com/api/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
     setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchProjects();
}, []);

  // 🔹 Create project
  const createProject = async () => {
    const name = prompt("Project name?");
    const description = prompt("Description?");

    if (!name) return;

    try {
     const res = await axios.post(
  "https://project-manager-app-ka5u.onrender.com/api/projects",
  { name, description },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

      setProjects([...projects, res.data]);
    } catch (err) {
      alert("Error creating project");
    }
  };

  // 🔹 Select project
  const selectProject = (project) => {
    setSelectedProject(project);
  };

  // 🔹 Back
  const goBack = () => {
    setSelectedProject(null);
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // 🔹 Add Member
  const addMember = async (projectId, e) => {
    e.stopPropagation();

    const email = prompt("Enter user email");
    if (!email) return;

    try {
      await axios.post(
        `https://project-manager-app-ka5u.onrender.com/api/projects/${projectId}/add-member`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Member added!");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };
if (loading) return <p>Loading projects...</p>;
  return (
    <div style={styles.container}>
      {!selectedProject ? (
        <>
          <h2 style={styles.heading}>Your Projects</h2>

          <button style={styles.button} onClick={createProject}>
            + Create Project
          </button>

          {projects.length === 0 ? (
            <p>No projects yet. Create one to get started 🚀</p>
          ) : (
            <div style={styles.grid}>
             {projects && projects.map((p) => (
                <div
                  key={p._id}
                  style={styles.card}
                  onClick={() => selectProject(p)}
                >
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>

                  {/* 🔥 ADD MEMBER BUTTON */}
                  <button
                    style={styles.addBtn}
                    onClick={(e) => addMember(p._id, e)}
                  >
                    Add Member
                  </button>
                </div>
              ))}
            </div>
          )}

          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <button style={styles.backBtn} onClick={goBack}>
            ← Back
          </button>

          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>

          <TaskList project={selectedProject} />
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
  },
  heading: {
    marginBottom: "20px",
  },
  button: {
    padding: "10px 15px",
    marginBottom: "20px",
    background: "#3b82f6",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
  logoutBtn: {
    marginTop: "20px",
    padding: "8px 12px",
    background: "#ef4444",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
  backBtn: {
    padding: "8px 12px",
    marginBottom: "15px",
    background: "#334155",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  addBtn: {
    marginTop: "10px",
    padding: "6px 10px",
    background: "#22c55e",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
};

export default Dashboard;
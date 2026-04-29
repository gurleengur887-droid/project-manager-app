import { useEffect, useState } from "react";
import API from "../api";
import TaskList from "./TaskList";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await API.get("/projects");
      setProjects(res.data);
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h3>Projects</h3>

      {projects.map((p) => (
        <div key={p._id} onClick={() => setSelected(p._id)}>
          {p.name}
        </div>
      ))}

      {selected && <TaskList projectId={selected} />}
    </div>
  );
}
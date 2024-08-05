
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Container,
  Box,
  Paper,
} from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

type Task = {
  id: number;
  title: string;
  description: string;
  persona: string;
  group: number;
  completed: boolean;
};

export default function Home() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [persona, setPersona] = useState("");
  const [group, setGroup] = useState<number>(0);
  const [updatingTask, setUpdatingTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning User!!");

  useEffect(() => {
    fetchTasks("all");
    fetchTasks("active");
    fetchTasks("completed");
    updateGreeting();
  }, []);

  const updateGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning User!");
    } else if (hours < 18) {
      setGreeting("Good Afternoon User!");
    } else {
      setGreeting("Good Evening User!");
    }
  };

  const fetchTasks = async (type: string) => {
    const res = await fetch(`/api/hello?type=${type}`);
    const tasks = await res.json();
    if (type === "active") {
      setActiveTasks(tasks);
    } else if(type === "completed") {
      setCompletedTasks(tasks);
    } else {
      setAllTasks(tasks);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/hello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, persona, group }),
    });
    if (res.ok) {
      fetchTasks("active");
      setTitle("");
      setDescription("");
      setPersona("");
      setGroup(0);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    const res = await fetch("/api/hello", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: taskId, completed: true }),
    });
    if (res.ok) {
      setAllTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      fetchTasks("active");
      fetchTasks("completed"); 
    }
  };

  const handleUpdateTask = (task: Task) => {
    setUpdatingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPersona(task.persona);
    setGroup(task.group);
    setShowModal(true);
  };

  const handleSubmitUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatingTask) {
      const res = await fetch("/api/hello", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatingTask.id,
          title,
          description,
          persona,
          group,
        }),
      });
      if (res.ok) {
        fetchTasks("active");
        setUpdatingTask(null);
        setTitle("");
        setDescription("");
        setPersona("");
        setGroup(0);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const res = await fetch(`/api/hello?id=${taskId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchTasks("active");
      fetchTasks("completed");
    }
  };

   return (
    <Container maxWidth="lg">
    <Typography variant="h3" color="primary" align="center" gutterBottom mt={4}>
      {greeting}
    </Typography>

    <Box display="flex" justifyContent="center" mb={4}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FaPlus />}
        onClick={() => setShowModal(true)}
      >
        Create Task
      </Button>
    </Box>

    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Typography variant="h4" color="primary" gutterBottom>
          To-Do
        </Typography>
        <Box>
          {allTasks.map((task) => (
            <Paper key={task.id} elevation={3} className="p-4 mb-4">
              <Typography variant="h6">{task.title}</Typography>
              <Typography>{task.description}</Typography>
              <Typography>{task.persona}</Typography>
              <Box mt={2} display="flex">
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<FaPen />}
                  onClick={() => handleUpdateTask(task)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<MdDelete />}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography variant="h4" color="primary" gutterBottom>
          In Progress
        </Typography>
        <Box>
          {activeTasks.map((task) => (
            <Paper key={task.id} elevation={3} className="p-4 mb-4">
              <Typography variant="h6">{task.title}</Typography>
              <Typography>{task.description}</Typography>
              <Typography>{task.persona}</Typography>
              <Box mt={2} display="flex">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleCompleteTask(task.id)}
                  className="mr-2"
                >
                  Complete
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<FaPen />}
                  onClick={() => handleUpdateTask(task)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<MdDelete />}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography variant="h4" color="primary" gutterBottom>
          Completed Tasks
        </Typography>
        <Box>
          {completedTasks.map((task) => (
            <Paper key={task.id} elevation={3} className="p-4 mb-4">
              <Typography variant="h6">{task.title}</Typography>
              <Typography>{task.description}</Typography>
              <Typography>{task.persona}</Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<MdDelete />}
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </Button>
            </Paper>
          ))}
        </Box>
      </Grid>
    </Grid>

    <Dialog open={showModal} onClose={() => setShowModal(false)}>
      <DialogTitle>{updatingTask ? "Update Task" : "Create Task"}</DialogTitle>
      <DialogContent>
        <form onSubmit={updatingTask ? handleSubmitUpdateTask : handleCreateTask}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Persona"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Group"
            type="number"
            value={group}
            onChange={(e) => setGroup(Number(e.target.value))}
            fullWidth
            margin="normal"
            required
          />
          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
              {updatingTask ? "Update Task" : "Create Task"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setShowModal(false);
                setUpdatingTask(null);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  </Container>
  ); 
}

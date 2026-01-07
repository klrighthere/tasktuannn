import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-e1ba9efb/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all tasks
app.get("/make-server-e1ba9efb/tasks", async (c) => {
  try {
    const tasks = await kv.getByPrefix("task:");
    const taskList = tasks.map(task => task.value);
    return c.json({ tasks: taskList });
  } catch (error) {
    console.log(`Error fetching tasks: ${error}`);
    return c.json({ error: "Failed to fetch tasks", details: String(error) }, 500);
  }
});

// Create a new task
app.post("/make-server-e1ba9efb/tasks", async (c) => {
  try {
    const body = await c.req.json();
    const { title, dayOfWeek, completed = false } = body;
    
    if (!title || !dayOfWeek) {
      return c.json({ error: "Title and dayOfWeek are required" }, 400);
    }
    
    const taskId = crypto.randomUUID();
    const task = {
      id: taskId,
      title,
      dayOfWeek,
      completed,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`task:${taskId}`, task);
    return c.json({ task });
  } catch (error) {
    console.log(`Error creating task: ${error}`);
    return c.json({ error: "Failed to create task", details: String(error) }, 500);
  }
});

// Update a task
app.put("/make-server-e1ba9efb/tasks/:id", async (c) => {
  try {
    const taskId = c.req.param("id");
    const body = await c.req.json();
    
    const existingTask = await kv.get(`task:${taskId}`);
    if (!existingTask) {
      return c.json({ error: "Task not found" }, 404);
    }
    
    const updatedTask = {
      ...existingTask,
      ...body,
      id: taskId, // Ensure ID doesn't change
    };
    
    await kv.set(`task:${taskId}`, updatedTask);
    return c.json({ task: updatedTask });
  } catch (error) {
    console.log(`Error updating task ${c.req.param("id")}: ${error}`);
    return c.json({ error: "Failed to update task", details: String(error) }, 500);
  }
});

// Delete a task
app.delete("/make-server-e1ba9efb/tasks/:id", async (c) => {
  try {
    const taskId = c.req.param("id");
    await kv.del(`task:${taskId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting task ${c.req.param("id")}: ${error}`);
    return c.json({ error: "Failed to delete task", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
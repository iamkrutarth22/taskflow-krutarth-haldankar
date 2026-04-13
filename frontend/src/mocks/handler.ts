import type { IProject } from "@/models/IProject";
import type { ITask, TaskStatus, TaskPriority } from "@/models/ITask";
import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";

interface DB_User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

let users: DB_User[] = [
  {
    id: "seed-user-1",
    name: "Krutarth",
    email: "test@example.com",
    password: "password123",
    created_at: new Date().toISOString(),
  },
];

let projects: IProject[] = [
  {
    id: "seed-proj-1",
    name: "Website Redesign",
    description: "Q2 redesign project",
    owner_id: "seed-user-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-proj-2",
    name: "Mobile App",
    description: "React Native project",
    owner_id: "seed-user-1",
    created_at: new Date().toISOString(),
  },
];

let tasks: ITask[] = [
  {
    id: "seed-task-1",
    title: "Design homepage",
    description: "Create wireframes for the homepage",
    status: "todo",
    priority: "high",
    project_id: "seed-proj-1",
    assignee_id: "seed-user-1",
    created_by: "seed-user-1",
    due_date: "2026-04-20",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-task-2",
    title: "Setup CI/CD pipeline",
    description: "Configure Github Actions",
    status: "in_progress",
    priority: "medium",
    project_id: "seed-proj-1",
    assignee_id: "seed-user-1",
    created_by: "seed-user-1",
    due_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-task-3",
    title: "Write unit tests",
    description: "Cover auth and task endpoints",
    status: "done",
    priority: "low",
    project_id: "seed-proj-1",
    assignee_id: "seed-user-1",
    created_by: "seed-user-1",
    due_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const makeToken = (userId: string) => btoa(userId);

const getCurrentUser = (request: Request) => {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const userId = atob(auth.slice(7));
    return users.find((u) => u.id === userId) || null;
  } catch {
    return null;
  }
};

export const handlers = [
  http.post("http://localhost:4000/auth/register", async ({ request }) => {
    const body = (await request.json()) as any;

    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json(
        {
          error: "validation failed",
          fields: { email: "all fields required" },
        },
        { status: 400 },
      );
    }

    if (users.find((u) => u.email === body.email)) {
      return HttpResponse.json(
        { error: "validation failed", fields: { email: "already taken" } },
        { status: 400 },
      );
    }

    const user = {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      password: body.password,
      created_at: new Date().toISOString(),
    };
    users.push(user);

    return HttpResponse.json(
      {
        token: makeToken(user.id),
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 },
    );
  }),

  http.post("http://localhost:4000/auth/login", async ({ request }) => {
    const body = (await request.json()) as any;
    const user = users.find(
      (u) => u.email === body.email && u.password === body.password,
    );

    if (!user) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    return HttpResponse.json({
      token: makeToken(user.id),
      user: { id: user.id, name: user.name, email: user.email },
    });
  }),

  // ─── Users Handlers ───────────────────────────────────────────────

  // needed for assignee dropdown when creating tasks
  http.get("http://localhost:4000/users", ({ request }) => {
    const currentUser = getCurrentUser(request);
    if (!currentUser)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const safeUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
    }));
    return HttpResponse.json({ users: safeUsers });
  }),

  //  Project Handlers 

  http.get("http://localhost:4000/projects", ({ request }) => {
    const currentUser = getCurrentUser(request);
    if (!currentUser)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    // return projects i own + projects where i am assigned a task
    const accessible = projects.filter(
      (p) =>
        p.owner_id === currentUser.id ||
        tasks.some(
          (t) => t.project_id === p.id && t.assignee_id === currentUser.id,
        ),
    );

    return HttpResponse.json({ projects: accessible });
  }),

  http.post("http://localhost:4000/projects", async ({ request }) => {
    const currentUser = getCurrentUser(request);
    if (!currentUser)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = (await request.json()) as any;
    if (!body.name) {
      return HttpResponse.json(
        { error: "validation failed", fields: { name: "required" } },
        { status: 400 },
      );
    }

    const project = {
      id: uuidv4(),
      name: body.name,
      description: body.description || "",
      owner_id: currentUser.id,
      created_at: new Date().toISOString(),
    };
    projects.push(project);

    return HttpResponse.json(project, { status: 201 });
  }),

  http.get("http://localhost:4000/projects/:id", ({ request, params }) => {
    const currentUser = getCurrentUser(request);
    if (!currentUser)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const project = projects.find((p) => p.id === params.id);
    if (!project)
      return HttpResponse.json({ error: "not found" }, { status: 404 });

    const projectTasks = tasks.filter((t) => t.project_id === params.id);
    return HttpResponse.json({ ...project, tasks: projectTasks });
  }),

  http.patch(
    "http://localhost:4000/projects/:id",
    async ({ request, params }) => {
      const currentUser = getCurrentUser(request);
      if (!currentUser)
        return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

      const idx = projects.findIndex((p) => p.id === params.id);
      if (idx === -1)
        return HttpResponse.json({ error: "not found" }, { status: 404 });
      if (projects[idx].owner_id !== currentUser.id) {
        return HttpResponse.json({ error: "forbidden" }, { status: 403 });
      }

      const body = (await request.json()) as any;
      projects[idx] = { ...projects[idx], ...body };
      return HttpResponse.json(projects[idx]);
    },
  ),

  http.delete("http://localhost:4000/projects/:id", ({ request, params }) => {
    const currentUser = getCurrentUser(request);
    if (!currentUser)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const idx = projects.findIndex((p) => p.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    if (projects[idx].owner_id !== currentUser.id) {
      return HttpResponse.json({ error: "forbidden" }, { status: 403 });
    }

    projects.splice(idx, 1);
    tasks = tasks.filter((t) => t.project_id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  //Task Handlers

  http.get(
    "http://localhost:4000/projects/:id/tasks",
    ({ request, params }) => {
      const currentUser = getCurrentUser(request);
      if (!currentUser)
        return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

      const url = new URL(request.url);
      const status = url.searchParams.get("status");
      const assignee = url.searchParams.get("assignee");
      const createdBy = url.searchParams.get("created_by");

      let result = tasks.filter((t) => t.project_id === params.id);

      if (status) result = result.filter((t) => t.status === status);
      if (assignee === "me")
        result = result.filter((t) => t.assignee_id === currentUser.id);
      if (assignee && assignee !== "me")
        result = result.filter((t) => t.assignee_id === assignee);
      if (createdBy === "me")
        result = result.filter((t) => t.created_by === currentUser.id);

      return HttpResponse.json({ tasks: result });
    },
  ),

  http.post(
    "http://localhost:4000/projects/:id/tasks",
    async ({ request, params }) => {
      const currentUser = getCurrentUser(request);
      if (!currentUser)
        return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

      const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!projectId)
        return HttpResponse.json({ error: "not found" }, { status: 404 });

      const project = projects.find((p) => p.id === projectId);
      if (!project)
        return HttpResponse.json({ error: "not found" }, { status: 404 });

      if (project.owner_id !== currentUser.id) {
        return HttpResponse.json({ error: "forbidden" }, { status: 403 });
      }

      const body = (await request.json()) as any;
      if (!body.title) {
        return HttpResponse.json(
          { error: "validation failed", fields: { title: "required" } },
          { status: 400 },
        );
      }

      const task: ITask = {
        id: uuidv4(),
        title: body.title,
        description: body.description || "",
        status: "todo" as TaskStatus,
        priority: (body.priority || "medium") as TaskPriority,
        project_id: projectId, 
        assignee_id: body.assignee_id || null,
        created_by: currentUser.id,
        due_date: body.due_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      tasks.push(task);

      return HttpResponse.json(task, { status: 201 });
    },
  ),

  http.patch("http://localhost:4000/tasks/:id", async ({ request, params }) => {
    const currentUser = getCurrentUser(request);
    if (!currentUser)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const idx = tasks.findIndex((t) => t.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ error: "not found" }, { status: 404 });

    const body = (await request.json()) as any;
    tasks[idx] = {
      ...tasks[idx],
      ...body,
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json(tasks[idx]);
  }),

  http.delete("http://localhost:4000/tasks/:id", ({ request, params }) => {
    const currentUser = getCurrentUser(request);
    if (!currentUser)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const idx = tasks.findIndex((t) => t.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ error: "not found" }, { status: 404 });

    tasks.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];

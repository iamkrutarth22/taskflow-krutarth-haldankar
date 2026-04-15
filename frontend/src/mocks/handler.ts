import type { IProject } from "@/models/IProject";
import type { ITask, TaskStatus, TaskPriority } from "@/models/ITask";
import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
console.log("Mock API Base URL:", API_BASE_URL);

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
    name: "Test user",
    email: "test@example.com",
    password: "password123",
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-user-2",
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "password123",
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-user-3",
    name: "Rahul Verma",
    email: "rahul@example.com",
    password: "password123",
    created_at: new Date().toISOString(),
  },
];

let projects: IProject[] = [
  {
    id: "seed-proj-1",
    name: "Website Redesign",
    description: "Complete redesign of company website for Q2 launch",
    owner_id: "seed-user-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-proj-2",
    name: "Mobile App Development",
    description: "React Native mobile application for customer engagement",
    owner_id: "seed-user-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-proj-3",
    name: "Internal Dashboard",
    description: "Admin dashboard for team management",
    owner_id: "seed-user-2",
    created_at: new Date().toISOString(),
  },
];

let tasks: ITask[] = [

  {
    id: "seed-task-1",
    title: "Design homepage hero section",
    description: "Create modern hero with new branding",
    status: "todo",
    priority: "high",
    project_id: "seed-proj-1",
    assignee_id: "seed-user-1",
    created_by: "seed-user-1",
    due_date: "2026-04-10", // ← Passed (today is 2026-04-15)
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-task-2",
    title: "Setup payment gateway integration",
    description: "Integrate Razorpay checkout",
    status: "in_progress",
    priority: "high",
    project_id: "seed-proj-2",
    assignee_id: "seed-user-1",
    created_by: "seed-user-1",
    due_date: "2026-04-05", // ← Passed
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  {
    id: "seed-task-3",
    title: "Write API documentation",
    description: "Document all endpoints using Swagger",
    status: "todo",
    priority: "medium",
    project_id: "seed-proj-1",
    assignee_id: "seed-user-2",
    created_by: "seed-user-1",
    due_date: "2026-04-25",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-task-4",
    title: "Implement dark mode toggle",
    description: "Add theme switcher with persistence",
    status: "in_progress",
    priority: "medium",
    project_id: "seed-proj-3",
    assignee_id: "seed-user-1",
    created_by: "seed-user-1",
    due_date: "2026-04-18",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-task-5",
    title: "User profile page UI",
    description: "Build responsive profile settings page",
    status: "todo",
    priority: "low",
    project_id: "seed-proj-2",
    assignee_id: "seed-user-3",
    created_by: "seed-user-1",
    due_date: "2026-05-05",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // === Completed Tasks ===
  {
    id: "seed-task-6",
    title: "Setup project structure",
    description: "Initialize monorepo and basic folder structure",
    status: "done",
    priority: "high",
    project_id: "seed-proj-1",
    assignee_id: "seed-user-1",
    created_by: "seed-user-1",
    due_date: "2026-04-08",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-task-7",
    title: "Database schema design",
    description: "Design relational schema for users, projects and tasks",
    status: "done",
    priority: "medium",
    project_id: "seed-proj-3",
    assignee_id: "seed-user-2",
    created_by: "seed-user-2",
    due_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  {
    id: "seed-task-8",
    title: "Landing page SEO optimization",
    description: "Improve meta tags and performance",
    status: "todo",
    priority: "medium",
    project_id: "seed-proj-1",
    assignee_id: null, // ← Unassigned
    created_by: "seed-user-1",
    due_date: "2026-04-22",
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
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
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

  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
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
  http.get(`${API_BASE_URL}/users`, ({ request }) => {
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

  http.get(`${API_BASE_URL}/projects`, ({ request }) => {
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

  http.post(`${API_BASE_URL}/projects`, async ({ request }) => {
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

  http.get(`${API_BASE_URL}/projects/:id`, ({ request, params }) => {
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
    `${API_BASE_URL}/projects/:id`,
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

  http.delete(`${API_BASE_URL}/projects/:id`, ({ request, params }) => {
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


  http.get(
    `${API_BASE_URL}/projects/:id/tasks`,
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
    `${API_BASE_URL}/projects/:id/tasks`,
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

  http.patch(`${API_BASE_URL}/tasks/:id`, async ({ request, params }) => {
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

  http.delete(`${API_BASE_URL}/tasks/:id`, ({ request, params }) => {
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

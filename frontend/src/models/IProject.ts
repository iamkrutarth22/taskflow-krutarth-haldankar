import type { ITask } from "./ITask"

export interface IProject {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  tasks?: ITask[]
}
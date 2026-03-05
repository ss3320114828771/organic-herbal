// lib/services/project-service.ts

// Types
export interface ProjectMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  avatar?: string
}

export interface ProjectTask {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assigneeId?: string
  dueDate?: string
  estimatedHours?: number
  actualHours?: number
}

export interface Project {
  id: string
  name: string
  description?: string
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  startDate: string
  endDate?: string
  progress: number
  budget?: number
  spent?: number
  ownerId: string
  members: ProjectMember[]
  tasks: ProjectTask[]
  tags: string[]
  createdAt: string
  updatedAt?: string
}

export interface CreateProjectData {
  name: string
  description?: string
  priority?: Project['priority']
  startDate?: string
  endDate?: string
  budget?: number
  tags?: string[]
}

export interface UpdateProjectData {
  name?: string
  description?: string
  status?: Project['status']
  priority?: Project['priority']
  startDate?: string
  endDate?: string
  budget?: number
  spent?: number
  progress?: number
  tags?: string[]
}

// Mock database
let projects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Redesign company website with modern UI/UX',
    status: 'active',
    priority: 'high',
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    progress: 65,
    budget: 15000,
    spent: 9750,
    ownerId: '1',
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'member' }
    ],
    tasks: [
      {
        id: '1',
        title: 'Create wireframes',
        status: 'done',
        priority: 'high',
        assigneeId: '2',
        dueDate: '2024-02-01',
        estimatedHours: 8,
        actualHours: 6
      },
      {
        id: '2',
        title: 'Design homepage',
        status: 'in-progress',
        priority: 'high',
        assigneeId: '2',
        dueDate: '2024-02-15',
        estimatedHours: 16,
        actualHours: 10
      },
      {
        id: '3',
        title: 'Implement frontend',
        status: 'todo',
        priority: 'medium',
        assigneeId: '3',
        dueDate: '2024-03-01',
        estimatedHours: 40
      }
    ],
    tags: ['design', 'frontend', 'react'],
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Build cross-platform mobile app',
    status: 'planning',
    priority: 'medium',
    startDate: '2024-04-01',
    progress: 15,
    budget: 25000,
    ownerId: '1',
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner' },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'member' }
    ],
    tasks: [
      {
        id: '4',
        title: 'Requirements gathering',
        status: 'in-progress',
        priority: 'high',
        assigneeId: '1',
        dueDate: '2024-04-15',
        estimatedHours: 20
      }
    ],
    tags: ['mobile', 'react-native'],
    createdAt: '2024-03-01'
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q2 marketing campaign planning',
    status: 'completed',
    priority: 'low',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    progress: 100,
    budget: 5000,
    spent: 4800,
    ownerId: '2',
    members: [
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'owner' },
      { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'member' }
    ],
    tasks: [
      {
        id: '5',
        title: 'Create ads',
        status: 'done',
        priority: 'medium',
        assigneeId: '4',
        dueDate: '2024-02-15',
        estimatedHours: 10,
        actualHours: 8
      },
      {
        id: '6',
        title: 'Launch campaign',
        status: 'done',
        priority: 'high',
        assigneeId: '2',
        dueDate: '2024-03-01',
        estimatedHours: 5,
        actualHours: 5
      }
    ],
    tags: ['marketing', 'social'],
    createdAt: '2023-12-15'
  }
]

// Generate project ID
function generateId(): string {
  return String(projects.length + 1)
}

// Calculate project progress
function calculateProgress(tasks: ProjectTask[]): number {
  if (tasks.length === 0) return 0
  const completed = tasks.filter(t => t.status === 'done').length
  return Math.round((completed / tasks.length) * 100)
}

// Create new project
export async function createProject(
  data: CreateProjectData,
  ownerId: string
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    if (!data.name) {
      return { success: false, error: 'Project name is required' }
    }

    const now = new Date().toISOString().split('T')[0]

    const newProject: Project = {
      id: generateId(),
      name: data.name,
      description: data.description,
      status: 'planning',
      priority: data.priority || 'medium',
      startDate: data.startDate || now,
      endDate: data.endDate,
      progress: 0,
      budget: data.budget,
      ownerId,
      members: [],
      tasks: [],
      tags: data.tags || [],
      createdAt: now
    }

    projects.push(newProject)
    
    return { success: true, project: newProject }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create project' }
  }
}

// Get project by ID
export async function getProject(projectId: string): Promise<Project | undefined> {
  return projects.find(p => p.id === projectId)
}

// Get all projects
export async function getAllProjects(): Promise<Project[]> {
  return projects.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// Get user projects
export async function getUserProjects(userId: string): Promise<Project[]> {
  return projects
    .filter(p => p.ownerId === userId || p.members.some(m => m.id === userId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get projects by status
export async function getProjectsByStatus(status: Project['status']): Promise<Project[]> {
  return projects.filter(p => p.status === status)
}

// Update project
export async function updateProject(
  projectId: string,
  data: UpdateProjectData
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const project = projects.find(p => p.id === projectId)
    
    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    Object.assign(project, data, { updatedAt: new Date().toISOString() })
    
    return { success: true, project }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Delete project
export async function deleteProject(projectId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const index = projects.findIndex(p => p.id === projectId)
    
    if (index === -1) {
      return { success: false, error: 'Project not found' }
    }

    projects.splice(index, 1)
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Add member to project
export async function addProjectMember(
  projectId: string,
  member: Omit<ProjectMember, 'id'>
): Promise<{ success: boolean; member?: ProjectMember; error?: string }> {
  try {
    const project = projects.find(p => p.id === projectId)
    
    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const newMember: ProjectMember = {
      id: String(project.members.length + 1),
      ...member
    }

    project.members.push(newMember)
    
    return { success: true, member: newMember }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Remove member from project
export async function removeProjectMember(
  projectId: string,
  memberId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const project = projects.find(p => p.id === projectId)
    
    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    if (project.ownerId === memberId) {
      return { success: false, error: 'Cannot remove project owner' }
    }

    project.members = project.members.filter(m => m.id !== memberId)
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Update member role
export async function updateMemberRole(
  projectId: string,
  memberId: string,
  role: ProjectMember['role']
): Promise<{ success: boolean; error?: string }> {
  try {
    const project = projects.find(p => p.id === projectId)
    
    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const member = project.members.find(m => m.id === memberId)
    if (member) {
      member.role = role
    }
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Add task to project
export async function addProjectTask(
  projectId: string,
  task: Omit<ProjectTask, 'id'>
): Promise<{ success: boolean; task?: ProjectTask; error?: string }> {
  try {
    const project = projects.find(p => p.id === projectId)
    
    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const newTask: ProjectTask = {
      id: String(project.tasks.length + 1),
      ...task
    }

    project.tasks.push(newTask)
    project.progress = calculateProgress(project.tasks)
    
    return { success: true, task: newTask }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Update task
export async function updateProjectTask(
  projectId: string,
  taskId: string,
  updates: Partial<ProjectTask>
): Promise<{ success: boolean; task?: ProjectTask; error?: string }> {
  try {
    const project = projects.find(p => p.id === projectId)
    
    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const task = project.tasks.find(t => t.id === taskId)
    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    Object.assign(task, updates)
    project.progress = calculateProgress(project.tasks)
    
    return { success: true, task }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Delete task
export async function deleteProjectTask(
  projectId: string,
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const project = projects.find(p => p.id === projectId)
    
    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    project.tasks = project.tasks.filter(t => t.id !== taskId)
    project.progress = calculateProgress(project.tasks)
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get project statistics
export async function getProjectStats(): Promise<{
  total: number
  active: number
  planning: number
  completed: number
  onHold: number
  archived: number
  totalTasks: number
  completedTasks: number
  totalBudget: number
  totalSpent: number
}> {
  const total = projects.length
  const active = projects.filter(p => p.status === 'active').length
  const planning = projects.filter(p => p.status === 'planning').length
  const completed = projects.filter(p => p.status === 'completed').length
  const onHold = projects.filter(p => p.status === 'on-hold').length
  const archived = projects.filter(p => p.status === 'archived').length
  
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0)
  const completedTasks = projects.reduce((sum, p) => 
    sum + p.tasks.filter(t => t.status === 'done').length, 0
  )
  
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0)

  return {
    total,
    active,
    planning,
    completed,
    onHold,
    archived,
    totalTasks,
    completedTasks,
    totalBudget,
    totalSpent
  }
}

// Search projects
export async function searchProjects(query: string): Promise<Project[]> {
  const lowercaseQuery = query.toLowerCase()
  
  return projects.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.description?.toLowerCase().includes(lowercaseQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

// Get projects by tag
export async function getProjectsByTag(tag: string): Promise<Project[]> {
  return projects.filter(p => p.tags.includes(tag))
}

// Get projects by date range
export async function getProjectsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Project[]> {
  return projects.filter(p => {
    const projectDate = new Date(p.createdAt)
    return projectDate >= startDate && projectDate <= endDate
  })
}

// Example usage
export async function example() {
  // Create project
  const newProject = await createProject({
    name: 'New Project',
    description: 'Project description',
    priority: 'high',
    budget: 10000
  }, '1')

  if (newProject.success && newProject.project) {
    console.log('Project created:', newProject.project.name)

    // Add task
    await addProjectTask(newProject.project.id, {
      title: 'Task 1',
      status: 'todo',
      priority: 'high',
      estimatedHours: 8
    })

    // Add member
    await addProjectMember(newProject.project.id, {
      name: 'New Member',
      email: 'member@example.com',
      role: 'member'
    })
  }

  // Get user projects
  const userProjects = await getUserProjects('1')
  console.log('User projects:', userProjects.length)

  // Get stats
  const stats = await getProjectStats()
  console.log('Total budget:', stats.totalBudget)
}
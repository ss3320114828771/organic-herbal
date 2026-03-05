// lib/permissions.ts

// User roles
export type UserRole = 'admin' | 'moderator' | 'user' | 'guest'

// Permission actions
export type PermissionAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'approve'
  | 'reject'
  | 'archive'
  | 'restore'
  | 'export'
  | 'import'
  | 'assign'
  | 'comment'

// Resource types
export type ResourceType =
  | 'user'
  | 'project'
  | 'task'
  | 'product'
  | 'order'
  | 'comment'
  | 'attachment'
  | 'setting'
  | 'report'
  | 'team'
  | 'role'

// Permission definition
export interface Permission {
  action: PermissionAction
  resource: ResourceType
  conditions?: Record<string, any>
}

// Role permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { action: 'manage', resource: 'user' },
    { action: 'manage', resource: 'project' },
    { action: 'manage', resource: 'task' },
    { action: 'manage', resource: 'product' },
    { action: 'manage', resource: 'order' },
    { action: 'manage', resource: 'comment' },
    { action: 'manage', resource: 'attachment' },
    { action: 'manage', resource: 'setting' },
    { action: 'manage', resource: 'report' },
    { action: 'manage', resource: 'team' },
    { action: 'manage', resource: 'role' }
  ],

  moderator: [
    { action: 'create', resource: 'project' },
    { action: 'read', resource: 'project' },
    { action: 'update', resource: 'project' },
    { action: 'delete', resource: 'project' },
    { action: 'create', resource: 'task' },
    { action: 'read', resource: 'task' },
    { action: 'update', resource: 'task' },
    { action: 'delete', resource: 'task' },
    { action: 'create', resource: 'comment' },
    { action: 'read', resource: 'comment' },
    { action: 'update', resource: 'comment' },
    { action: 'delete', resource: 'comment' },
    { action: 'approve', resource: 'task' },
    { action: 'reject', resource: 'task' },
    { action: 'export', resource: 'report' }
  ],

  user: [
    { action: 'read', resource: 'project', conditions: { owned: true } },
    { action: 'create', resource: 'task', conditions: { owned: true } },
    { action: 'read', resource: 'task', conditions: { assigned: true } },
    { action: 'update', resource: 'task', conditions: { assigned: true } },
    { action: 'create', resource: 'comment' },
    { action: 'read', resource: 'comment' },
    { action: 'update', resource: 'comment', conditions: { owned: true } },
    { action: 'delete', resource: 'comment', conditions: { owned: true } },
    { action: 'read', resource: 'product' },
    { action: 'read', resource: 'order', conditions: { owned: true } }
  ],

  guest: [
    { action: 'read', resource: 'product' },
    { action: 'read', resource: 'comment' }
  ]
}

// Check if user has permission
export function hasPermission(
  userRole: UserRole,
  action: PermissionAction,
  resource: ResourceType,
  context?: Record<string, any>
): boolean {
  const permissions = rolePermissions[userRole]
  if (!permissions) return false

  return permissions.some(permission => {
    // Check action and resource match
    if (permission.action !== action && permission.action !== 'manage') return false
    if (permission.resource !== resource) return false

    // Check conditions if any
    if (permission.conditions) {
      return Object.entries(permission.conditions).every(([key, value]) => {
        if (value === true) {
          return context?.[key] === true
        }
        return context?.[key] === value
      })
    }

    return true
  })
}

// Check if user has any of the permissions
export function hasAnyPermission(
  userRole: UserRole,
  permissions: Array<{ action: PermissionAction; resource: ResourceType }>,
  context?: Record<string, any>
): boolean {
  return permissions.some(({ action, resource }) =>
    hasPermission(userRole, action, resource, context)
  )
}

// Check if user has all permissions
export function hasAllPermissions(
  userRole: UserRole,
  permissions: Array<{ action: PermissionAction; resource: ResourceType }>,
  context?: Record<string, any>
): boolean {
  return permissions.every(({ action, resource }) =>
    hasPermission(userRole, action, resource, context)
  )
}

// Get all permissions for a role
export function getRolePermissions(userRole: UserRole): Permission[] {
  return rolePermissions[userRole] || []
}

// Filter resources by permission
export function filterByPermission<T extends { id: string; userId?: string }>(
  items: T[],
  userRole: UserRole,
  action: PermissionAction,
  resource: ResourceType,
  userId?: string
): T[] {
  return items.filter(item => {
    const context = {
      owned: userId ? item.userId === userId : false,
      assigned: userId ? item.userId === userId : false
    }
    return hasPermission(userRole, action, resource, context)
  })
}

// Permission middleware for API routes
export function requirePermission(
  action: PermissionAction,
  resource: ResourceType,
  getContext?: (req: any) => Record<string, any>
) {
  return async (req: any, res: any, next: any) => {
    const userRole = req.user?.role || 'guest'
    const context = getContext ? getContext(req) : {}

    if (!hasPermission(userRole, action, resource, context)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    return next()
  }
}

// Resource-based permissions
export const permissions = {
  // User permissions
  canManageUsers: (role: UserRole) => hasPermission(role, 'manage', 'user'),
  canViewUser: (role: UserRole) => hasPermission(role, 'read', 'user'),
  canEditUser: (role: UserRole) => hasPermission(role, 'update', 'user'),
  canDeleteUser: (role: UserRole) => hasPermission(role, 'delete', 'user'),

  // Project permissions
  canCreateProject: (role: UserRole) => hasPermission(role, 'create', 'project'),
  canViewProject: (role: UserRole, isOwner: boolean = false) => 
    hasPermission(role, 'read', 'project', { owned: isOwner }),
  canEditProject: (role: UserRole, isOwner: boolean = false) => 
    hasPermission(role, 'update', 'project', { owned: isOwner }),
  canDeleteProject: (role: UserRole, isOwner: boolean = false) => 
    hasPermission(role, 'delete', 'project', { owned: isOwner }),

  // Task permissions
  canCreateTask: (role: UserRole) => hasPermission(role, 'create', 'task'),
  canViewTask: (role: UserRole, isAssigned: boolean = false) => 
    hasPermission(role, 'read', 'task', { assigned: isAssigned }),
  canEditTask: (role: UserRole, isAssigned: boolean = false) => 
    hasPermission(role, 'update', 'task', { assigned: isAssigned }),
  canDeleteTask: (role: UserRole, isAssigned: boolean = false) => 
    hasPermission(role, 'delete', 'task', { assigned: isAssigned }),
  canApproveTask: (role: UserRole) => hasPermission(role, 'approve', 'task'),
  canAssignTask: (role: UserRole) => hasPermission(role, 'assign', 'task'),

  // Product permissions
  canCreateProduct: (role: UserRole) => hasPermission(role, 'create', 'product'),
  canViewProduct: (role: UserRole) => hasPermission(role, 'read', 'product'),
  canEditProduct: (role: UserRole) => hasPermission(role, 'update', 'product'),
  canDeleteProduct: (role: UserRole) => hasPermission(role, 'delete', 'product'),

  // Order permissions
  canViewOrder: (role: UserRole, isOwner: boolean = false) => 
    hasPermission(role, 'read', 'order', { owned: isOwner }),
  canManageOrders: (role: UserRole) => hasPermission(role, 'manage', 'order'),

  // Comment permissions
  canCreateComment: (role: UserRole) => hasPermission(role, 'create', 'comment'),
  canViewComment: (role: UserRole) => hasPermission(role, 'read', 'comment'),
  canEditComment: (role: UserRole, isOwner: boolean = false) => 
    hasPermission(role, 'update', 'comment', { owned: isOwner }),
  canDeleteComment: (role: UserRole, isOwner: boolean = false) => 
    hasPermission(role, 'delete', 'comment', { owned: isOwner }),

  // Report permissions
  canViewReports: (role: UserRole) => hasPermission(role, 'read', 'report'),
  canExportReports: (role: UserRole) => hasPermission(role, 'export', 'report'),

  // Settings permissions
  canManageSettings: (role: UserRole) => hasPermission(role, 'manage', 'setting'),

  // Team permissions
  canManageTeam: (role: UserRole) => hasPermission(role, 'manage', 'team'),
  canViewTeam: (role: UserRole) => hasPermission(role, 'read', 'team'),

  // Role permissions
  canManageRoles: (role: UserRole) => hasPermission(role, 'manage', 'role')
}

// Check if user can access resource
export function canAccess(
  role: UserRole,
  resource: ResourceType,
  action: PermissionAction,
  ownerId?: string,
  userId?: string
): boolean {
  const context = {
    owned: ownerId ? ownerId === userId : false,
    assigned: ownerId ? ownerId === userId : false
  }
  return hasPermission(role, action, resource, context)
}

// Get accessible resources
export function getAccessibleResources<T extends { userId?: string }>(
  items: T[],
  role: UserRole,
  action: PermissionAction,
  resource: ResourceType,
  userId?: string
): T[] {
  return items.filter(item => {
    const context = {
      owned: userId ? item.userId === userId : false
    }
    return hasPermission(role, action, resource, context)
  })
}

// Define custom permission
export function definePermission(
  action: PermissionAction,
  resource: ResourceType,
  condition?: (context: Record<string, any>) => boolean
): Permission {
  return {
    action,
    resource,
    conditions: condition ? { custom: condition } : undefined
  }
}

// Add custom permission to role
export function addRolePermission(
  role: UserRole,
  permission: Permission
): void {
  if (!rolePermissions[role]) {
    rolePermissions[role] = []
  }
  rolePermissions[role].push(permission)
}

// Remove permission from role
export function removeRolePermission(
  role: UserRole,
  action: PermissionAction,
  resource: ResourceType
): void {
  if (rolePermissions[role]) {
    rolePermissions[role] = rolePermissions[role].filter(
      p => !(p.action === action && p.resource === resource)
    )
  }
}

// Example usage
export function example() {
  const userRole: UserRole = 'user'
  const adminRole: UserRole = 'admin'

  // Check permissions
  console.log('User can create task:', permissions.canCreateTask(userRole))
  console.log('User can view task:', permissions.canViewTask(userRole, true))
  console.log('Admin can manage users:', permissions.canManageUsers(adminRole))

  // Check with context
  const canEdit = hasPermission(userRole, 'update', 'task', { assigned: true })
  console.log('Can edit assigned task:', canEdit)

  // Filter resources
  const tasks = [
    { id: '1', title: 'Task 1', userId: 'user1' },
    { id: '2', title: 'Task 2', userId: 'user2' },
    { id: '3', title: 'Task 3', userId: 'user1' }
  ]

  const accessibleTasks = filterByPermission(tasks, userRole, 'read', 'task', 'user1')
  console.log('Accessible tasks:', accessibleTasks.length)

  // Add custom permission
  addRolePermission('user', {
    action: 'export',
    resource: 'report',
    conditions: { limit: 100 }
  })

  console.log('User can export reports:', permissions.canExportReports(userRole))
}
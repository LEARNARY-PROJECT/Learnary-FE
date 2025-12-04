import { User } from "./user.type"
export type Permission = {
    permission_id: string,
    permission_name: string,
    description?: string,
}
export type AdminRoleWithPermissions = AdminRole & { permissions?: AdminRolePermission[] }
export type Admin = {
    admin_id: string,
    user_id: string,
    admin_role_id: string,
    adminRole?: AdminRole,
    user?: User,
}
export type AdminWithRole = {
    role: AdminRole
}
export type AdminRole = {
    admin_role_id: string,
    role_name: string,
    level?: number,
}
export type AdminRolePermission = {
    permission_id: string,
    admin_role_id: string,
    permission: Permission
}
export type AdminRolePermissionDetail = AdminRolePermission & {
    role: AdminRole;
    permission: Permission;
};
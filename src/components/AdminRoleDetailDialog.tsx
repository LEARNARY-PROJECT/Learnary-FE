"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import api from "@/app/lib/axios";
import { AdminRole, Permission } from "@/type/administrator.type";
import { isAxiosError } from "axios";
import { AdminRolePermission } from "@/type/administrator.type";
type AdminRoleDetailDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    adminRole: AdminRole;
};

type PermissionWithStatus = Permission & {
    isAssigned: boolean;
};

export function AdminRoleDetailDialog({
    open,
    onOpenChange,
    adminRole,
}: AdminRoleDetailDialogProps) {
    const [permissions, setPermissions] = useState<PermissionWithStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    /* set là cấu trúc dữ liệu lưu các giá trị duy nhất không trùng, trong set có các method như add,delete,has */
    const [updatingPermissions, setUpdatingPermissions] = useState<Set<string>>(new Set());
    const fetchPermissionsAndAssignments = useCallback(async() => {
        try {
            setIsLoading(true);
            const permissionsResponse = await api.get("/permissions");
            if(!permissionsResponse) {
                toast.error("Lỗi không truy xuất được danh sách quyền của tài khoản này!")
                return
            } 
            const allPermissions: Permission[] = permissionsResponse.data.success ? permissionsResponse.data.data : permissionsResponse.data;
            const assignmentsResponse = await api.get("/admin-role-permissions");
            const assignments = assignmentsResponse.data.success ? assignmentsResponse.data.data : assignmentsResponse.data;
            /* tìm những bản ghi của admin_role_permissions đã được cấp cho account này (filter) và map là tạo ra mảng mới và chọn ra cột cần thiết (cột id permission) */
            const assignedPermissionIds = new Set(assignments.filter((a: AdminRolePermission) => a.admin_role_id === adminRole.admin_role_id).map((a: AdminRolePermission) => a.permission_id));
            const permissionsWithStatus: PermissionWithStatus[] = allPermissions.map(
                (permission) => ({
                    ...permission,
                    //check nhanh xem quyền này đã được gán cho role chưa
                    isAssigned: assignedPermissionIds.has(permission.permission_id),
                })
            );
            setPermissions(permissionsWithStatus);
        } catch (error) {
            console.error("Error fetching permissions:", error);
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Lỗi khi tải danh sách quyền");
            } else {
                toast.error("Không thể tải danh sách quyền");
            }
        } finally {
            setIsLoading(false);
        }
    },[adminRole.admin_role_id]);
    useEffect(() => {
        if (open) {
            fetchPermissionsAndAssignments();
        }
    }, [open, adminRole.admin_role_id, fetchPermissionsAndAssignments]);
    const handleTogglePermission = async (permission: PermissionWithStatus) => {
        const permissionId = permission.permission_id;
        if (updatingPermissions.has(permissionId)) {
            return;
        }
        setUpdatingPermissions(prev => new Set(prev).add(permissionId));
        try {
            if (permission.isAssigned) {
                await api.delete(`/admin-role-permissions/${permissionId}/${adminRole.admin_role_id}`);
                toast.success(`Đã gỡ quyền "${permission.permission_name}"`);
            } else {
                console.log(permissionId,adminRole.admin_role_id)
                await api.post("/admin-role-permissions", {
                    permission_id: permissionId,
                    admin_role_id: adminRole.admin_role_id,
                });
                toast.success(`Đã cấp quyền "${permission.permission_name}"`);
            }
            setPermissions((prev) =>prev.map((p) => p.permission_id === permissionId ? { ...p, isAssigned: !p.isAssigned } : p));
        } catch (error) {
            console.error("Error toggling permission:", error);
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Không thể cập nhật quyền");
            } else {
                toast.error("Không thể cập nhật quyền");
            }
        } finally {
            setUpdatingPermissions(prev => {
                const newSet = new Set(prev);
                newSet.delete(permissionId);
                return newSet;
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {adminRole.role_name}
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-2">
                        Quản lý quyền hạn cho vai trò này bằng cách bật/tắt các quyền bên dưới
                    </p>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner />
                    </div>
                ) : (
                    <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                            <p className="text-sm font-medium text-gray-700">
                                Tổng số quyền: {permissions.length}
                            </p>
                            <p className="text-sm font-medium text-green-600">
                                Đã cấp: {permissions.filter((p) => p.isAssigned).length}
                            </p>
                        </div>

                        {permissions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Chưa có quyền nào trong hệ thống
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {permissions.map((permission) => (
                                    <div key={permission.permission_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex-1">
                                            <Label htmlFor={`permission-${permission.permission_id}`} className="font-medium cursor-pointer">
                                                {permission.permission_name}
                                            </Label>
                                            {permission.description && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {permission.description}
                                                </p>
                                            )}
                                        </div>
                                        <Switch
                                            id={`permission-${permission.permission_id}`}
                                            checked={permission.isAssigned}
                                            onCheckedChange={() => handleTogglePermission(permission)}
                                            disabled={updatingPermissions.has(permission.permission_id)}
                                            className="ml-4"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

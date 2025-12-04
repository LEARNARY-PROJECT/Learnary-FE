"use client"
import React, { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import api from "@/app/lib/axios";
import { AdminRole } from "@/type/administrator.type";
import { isAxiosError } from "axios";

const adminAccountSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    fullName: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
    admin_role_id: z.string().min(1, "Vui lòng chọn vai trò quản trị"),
})

type CreateAdminAccountFormProps = {
  onSuccess?: () => void;
};

type AdminAccountFormData = z.infer<typeof adminAccountSchema>

export default function CreateAdminAccountForm({onSuccess}: CreateAdminAccountFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [adminRoles, setAdminRoles] = useState<AdminRole[]>([])
    const [loadingRoles, setLoadingRoles] = useState(true)

    const form = useForm<AdminAccountFormData>({
        resolver: zodResolver(adminAccountSchema),
        defaultValues: {
            email: "",
            password: "",
            fullName: "",
            admin_role_id: "",
        }
    })

    useEffect(() => {
        fetchAdminRoles();
    }, []);

    const fetchAdminRoles = async () => {
        try {
            setLoadingRoles(true);
            const response = await api.get("/admin-roles");
            const apiData = response.data;
            if (apiData.success && Array.isArray(apiData.data)) {
                setAdminRoles(apiData.data);
            } else if (Array.isArray(apiData)) {
                setAdminRoles(apiData);
            } else {
                throw new Error("Dữ liệu API không đúng định dạng");
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách vai trò:", error);
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Lỗi khi tải vai trò");
            } else {
                toast.error("Không thể tải danh sách vai trò");
            }
        } finally {
            setLoadingRoles(false);
        }
    };

    async function onSubmit(values: AdminAccountFormData) {
        try {
            setIsLoading(true)
            const response = await api.post("/admins", {
                email: values.email,
                password: values.password,
                fullName: values.fullName,
                admin_role_id_req: values.admin_role_id,
            })
            if (!response) {
                toast.error("Tạo tài khoản admin thất bại, vui lòng kiểm tra lại")
                throw new Error(`HTTP Error, status: ${response}`)
            } else {
                toast.success("Tạo tài khoản admin thành công")
                form.reset()
                if(onSuccess) onSuccess();
            }
        } catch (error) {
            console.error('Error creating admin account', error)
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản admin. Vui lòng thử lại!")
            } else {
                toast.error("Có lỗi xảy ra khi tạo tài khoản admin. Vui lòng thử lại!")
            }
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='flex space-x-7 w-full gap-7 flex-col'>
                    <FormField
                        control={form.control} 
                        name="fullName"
                        render={({ field }) => ( 
                            <FormItem className='flex flex-col gap-3'>
                                <FormLabel className='pl-2'>Tên người dùng</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nguyễn Văn A" className='w-full' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control} 
                        name="email"
                        render={({ field }) => ( 
                            <FormItem className='flex flex-col gap-3'>
                                <FormLabel className='pl-2'>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="admin@example.com" className='w-full' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control} 
                        name="password"
                        render={({ field }) => ( 
                            <FormItem className='flex flex-col gap-3'>
                                <FormLabel className='pl-2'>Mật khẩu</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Mật khẩu" className='w-full' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="admin_role_id"
                        render={({ field }) => (
                            <FormItem className='flex flex-col gap-3'>
                                <FormLabel className='pl-2'>Vai trò quản trị</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={loadingRoles}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingRoles ? "Đang tải..." : "Chọn vai trò quản trị"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {adminRoles.map((role) => (
                                            <SelectItem key={role.admin_role_id} value={role.admin_role_id}>
                                                {role.role_name} {role.level ? `(Cấp ${role.level})` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-left">
                    <Button type="submit" className="w-[200px] cursor-pointer" disabled={isLoading || loadingRoles}>
                        {isLoading ? "Đang tạo..." : "Tạo tài khoản admin"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

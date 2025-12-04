"use client"
import React, {  useState } from 'react'
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
import api from "@/app/lib/axios";
const categorySchema = z.object({
    permission_name: z.string().min(3, "Tên quyền phải có ít nhất 3 ký tự"),
    description: z.string().min(3,"Mô tả ít nhất phải có ít nhất 3 ký tự ")
})
type CreatePermissionFormProps = {
  onSuccess?: () => void;
};
type PermissionFormData = z.infer<typeof categorySchema>
export function CreatePermissionForm({onSuccess}: CreatePermissionFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<PermissionFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            permission_name: "",
            description:"",
        }
    })

    async function onSubmit(values: PermissionFormData) {
        try {
            setIsLoading(true)
            const permissionData = {
                ...values,
            }
            const response = await api.post("/permissions", {
                permission_name:permissionData.permission_name,
                description: permissionData.description,
            })
            if (!response) {
                toast.error("Tạo quyền thất bại, vui lòng kiểm tra lại")
                throw new Error(`HTTP Error, status: ${response}`)
            } else {
                toast.success("Tạo quyền thành công")
                form.reset()
                if(onSuccess) onSuccess();
            }
        } catch (error) {
            console.error('Error creating course', error)
            toast.error("Có lỗi xảy ra khi tạo quyền. Vui lòng thử lại!")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='flex space-x-7 w-full gap-7 flex-col '>
                    <FormField
                        control={form.control} 
                        name="permission_name"
                        render={({ field }) => ( 
                            <FormItem className='flex flex-col gap-3'>
                                <FormLabel className='pl-2'>Quyền truy cập hệ thống</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tên quyền" className='w-full' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control} 
                        name="description"
                        render={({ field }) => ( 
                            <FormItem className='flex flex-col gap-3'>
                                <FormLabel className='pl-2'>Mô tả chi tiết</FormLabel>
                                <FormControl>
                                    <Input placeholder="Mô tả chi tiết quyền" className='w-full' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-left">
                    <Button type="submit" className="w-[150px] cursor-pointer text-blue-600 border border-blue-600 bg-white hover:bg-blue-600 hover:text-white" disabled={isLoading}>
                        {isLoading ? "Đang tạo..." : "Tạo quyền"}
                    </Button>
                </div>
            </form>

        </Form>
    )
}

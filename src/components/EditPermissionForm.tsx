"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import api from "@/app/lib/axios";
import { toast } from "sonner";
import { Permission } from "@/type/administrator.type";
type EditPermissionFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission: Permission
  onSuccess?: () => void;
};

const schema = z.object({
  permission_name: z.string().min(2, "Tên quyền phải có ít nhất 2 ký tự"),
  description: z.string().min(5, "Mô tả phải có ít nhất 5 ký tự"),
});

type FormValues = z.infer<typeof schema>;

export function EditPermissionForm({  onOpenChange, permission: permission, onSuccess }: EditPermissionFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { permission_name: permission.permission_name,description:permission.description },
  });

  React.useEffect(() => {
    form.reset({ permission_name: permission.permission_name, description:permission.description});
  }, [permission, form]);;

  const onSubmit = async (values: FormValues) => {
    try {
      await api.put(`/permissions/${permission.permission_id}`, {
        permission_name: values.permission_name,
        description: values.description,
      });
      toast.success("Cập nhật quyền thành công");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log(err);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="permission_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên quyền</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả chi tiết</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" className="cursor-pointer">Lưu</Button>
        </div>
      </form>
    </Form>
  );
}

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
import { AdminRole } from "@/type/administrator.type";

type EditAdminRoleFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminRole: AdminRole;
  onSuccess?: () => void;
};

const schema = z.object({
  role_name: z.string().min(2, "Tên vai trò phải có ít nhất 2 ký tự"),
});

type FormValues = z.infer<typeof schema>;

export function EditAdminRoleForm({ onOpenChange, adminRole, onSuccess }: EditAdminRoleFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role_name: adminRole.role_name },
  });

  React.useEffect(() => {
    form.reset({ role_name: adminRole.role_name });
  }, [adminRole, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await api.put(`/admin-roles/${adminRole.admin_role_id}`, {
        role_name: values.role_name,
      });
      toast.success("Cập nhật vai trò thành công");
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
          name="role_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên vai trò</FormLabel>
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

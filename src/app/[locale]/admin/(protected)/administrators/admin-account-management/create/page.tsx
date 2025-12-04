import React from 'react'
import CreateAdminForm from '@/components/CreateAdminForm'

function CreateAdminAccount() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tạo tài khoản Admin mới</h1>
      <CreateAdminForm />
    </div>
  )
}

export default CreateAdminAccount

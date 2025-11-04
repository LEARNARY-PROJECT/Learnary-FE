"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/app/lib/axios";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIsMobile } from "@/hooks/useIsMobile";
import { EnvelopeIcon, MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner";
type UserProps = {
  user_id: string,
  fullName: string,
  email: string,
  phone?: string,
  avatar?: string,
  dateOfBirth?: Date,
  address?: string,
  city?: string,
  nation?: string,
  bio?: string,
  isActive: boolean,
  role?: string,
  last_login?: Date
}
type UpdateUserData = Omit<UserProps,"user_id" | "role" | "isActive" | "last_login" | "email">
export default function ProfilePage() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserProps | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserData>({
    fullName: "",
    phone: "",
    avatar: "",
    dateOfBirth: undefined,
    address: "",
    city: "",
    nation: "",
    bio: ""
  });

  const handleEditInfo = async (id:string, data: UpdateUserData) => {
      try {
        if(!user) {
          console.log("Bạn phải đăng nhập mới được phép sửa hồ sơ")
          return
        }
        const res = await api.patch(`/users/update-info/${id}`, data);
        if(!res) {
          throw new Error(`HTTP Error! res: ${res}`)
        }

        setUserInfo({...userInfo, ...data} as UserProps);
        setIsEditing(false);
        toast.success("Cập nhật hồ sơ thành công")
        return res.data
      } catch (error: unknown) {
        const err = error as { response?: { data?: unknown; status?: number }; message?: string };
        toast.error("Cập nhật hồ sơ thất bại");
        return err
      }
  }

  const handleSubmitEdit = async () => {
    if (!user) return;
    await handleEditInfo(user.id, formData);
  }

  const handleInputChange = (field: keyof UpdateUserData, value: string | number | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  useEffect(() => {
    const takeUserInfo = async () => {
      try {
        if (!user) {
          console.log("Không tìm thấy người dùng hiện tại ở hệ thống")
          return;
        }
        const currentUserId = user.id
        const res = await api.get(`/users/getMyProfile/${currentUserId}`)
        const userData = res.data.user || res.data;
        setUserInfo(userData);
        
        // cập nhât form data lên trước
        if (userData) {
          setFormData({
            fullName: userData.fullName || "",
            phone: userData.phone || "",
            avatar: userData.avatar || "",
            dateOfBirth: userData.dateOfBirth,
            address: userData.address || "",
            city: userData.city || "",
            nation: userData.nation || "",
            bio: userData.bio || ""
          });
        }
      } catch (error) {
        console.log("Lỗi khi lấy thông tin người dùng", error)
      }
    }

    if (user) {
      takeUserInfo();
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <div className={`w-full min-h-screen overflow-y-auto pb-10 ${isMobile ? 'pl-1 pr-1 ' : 'pl-10 pr-10 mt-4'}`}>
        {user ? (
          <div className="">
            <div className={`breadcrumb ${isMobile ? 'ml-3 pt-3 mb-5' : ' pt-5 mb-5'}`}>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Hồ sơ người dùng</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {userInfo && (
              <div className={`${isMobile ? 'mx-2' : 'mx-auto max-w-8xl mt-2'}`}>
                <div className="relative">
                  <div className={`relative ${isMobile ? 'h-32' : 'h-48'} rounded-t-2xl overflow-hidden bg-linear-to-r from-slate-700 via-slate-800 to-slate-900`}>
                    <Image
                      src={'/images/background/bg.jpg'}
                      alt="Background Banner"
                      fill
                      className="object-cover opacity-50"
                    />
                  </div>

                  <div className={`relative bg-white rounded-2xl shadow-xl ${isMobile ? '-mt-8 mx-4 p-4' : '-mt-16 mx-8 p-8'}`}>
                    <div className={`flex ${isMobile ? 'flex-col items-center text-center' : 'flex-row items-end'} gap-6`}>

                      <div className={`${isMobile ? '-mt-16' : '-mt-20'} relative`}>
                        <Avatar className={`${isMobile ? 'h-24 w-24' : 'h-32 w-32'} border-4 border-white shadow-lg`}>
                          <AvatarImage src={userInfo?.avatar} alt="User avatar" style={{ objectFit: "cover" }} />
                          <AvatarFallback className="text-2xl font-roboto-bold">
                            {userInfo.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                          <div className="flex items-center justify-center gap-5">
                            <h1 className={`font-rosario-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                              {userInfo.fullName}
                            </h1>
                            <Badge 
                              className={`font-roboto-bold ${
                                userInfo.role === 'ADMIN' ? 'bg-red-500 hover:bg-red-600' :
                                userInfo.role === 'INSTRUCTOR' ? 'bg-blue-500 hover:bg-blue-600' :
                                'bg-green-500 hover:bg-green-600'
                              } text-white ${isMobile ? 'text-xs' : 'text-sm'}`}
                            >
                              {userInfo.role?.toUpperCase() || 'LEARNER'}
                            </Badge>
                          </div>
                        </div>

                        <div className={`flex ${isMobile ? 'flex-col justify-center items-center' : 'flex-row'} gap-4 mt-4 text-gray-600`}>
                          <div className={`${isMobile ? 'flex gap-2' : 'flex items-center gap-2'}`}>
                            <EnvelopeIcon className="w-5 h-5" />
                            <span className="font-roboto text-sm">{userInfo.email}</span>
                          </div>

                          {(userInfo.city || userInfo.nation) && (
                            <div className="flex items-center gap-2">
                              <MapPinIcon className="w-5 h-5" />
                              <span className="font-roboto text-sm">
                                {[userInfo.city, userInfo.nation].filter(Boolean).join(', ') || 'Chưa cập nhật'}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" />
                            <span className="font-roboto text-sm">
                              Tham gia {userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab mt-5 ml-5">
                  <Tabs defaultValue="learner-profile" className="w-full">
                    <div className={`${isMobile ? 'flex justify-center w-full mb-4' : 'flex justify-center w-full'}`}>
                      <TabsList className="flex gap-3 justify-between">
                        <TabsTrigger value="learner-profile" className='p-3 cursor-pointer hover:bg-gray-200 text-center'>Hồ sơ học viên</TabsTrigger>
                        <TabsTrigger value="instructor-profile" className='p-3 cursor-pointer hover:bg-gray-200'>Hồ sơ giảng viên</TabsTrigger>
                        <TabsTrigger value="account-setting" className='p-3 cursor-pointer hover:bg-gray-200'>Tài khoản của tôi</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="learner-profile" className=''>
                      <div className={`${isMobile ? '' : ' mt-6'}`}>
                        <div className={`${isMobile ? 'bg-white rounded-2xl border-2 border-gray-200 shadow-sm pt-6 pl-6 pr-6 pb-6' : 'bg-white rounded-2xl border-2 border-gray-200 shadow-sm pt-6 pl-6 pr-6 pb-6'}`}>
                          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            <div>
                              <Label className="text-gray-400 font-roboto text-sm mb-1">Họ và tên</Label>
                              <p className="font-roboto-bold text-gray-800">{userInfo.fullName}</p>
                            </div>
                            
                            <div>
                              <Label className="text-gray-400 font-roboto text-sm mb-1">Vai trò</Label>
                              <p className="font-roboto-bold text-gray-800">{userInfo.role || 'Chưa có'}</p>
                            </div>
                            
                            <div>
                              <Label className="text-gray-400 font-roboto text-sm mb-1">Trạng thái</Label>
                              <p className="font-roboto-bold text-green-600">
                                {userInfo.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                              </p>
                            </div>
                          
                            {userInfo.bio && (
                              <div className={isMobile ? '' : 'col-span-2'}>
                                <Label className="text-gray-400 font-roboto text-sm mb-1">Tiểu sử</Label>
                                <p className="font-roboto text-gray-800">{userInfo.bio}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="account-setting" className=''>
                      <div className={`${isMobile ? 'flex flex-col gap-5' : ' mt-6 flex flex-col gap-5'}`}>
                        {/* thong tin ca nhan */}
                        <div className={`${isMobile ? 'bg-white rounded-2xl border-2 border-gray-200 shadow-sm pt-6 pl-6 pr-6 pb-6' : 'bg-white rounded-2xl border-2 border-gray-200 shadow-sm pt-6 pl-6 pr-6 pb-6'}`}>
                          <div className={`flex ${isMobile ? 'flex-row gap-0' : 'flex-row'} justify-between items-center mb-6`}>
                            <h3 className="font-rosario-bold text-xl text-gray-900">Thông tin cá nhân</h3>
                            
                            <div className="flex gap-3">
                              {!isEditing ? (
                                <Button 
                                  onClick={() => setIsEditing(true)}
                                  className="bg-[#371D8C] cursor-pointer hover:bg-[#2a1567] text-white font-roboto-bold"
                                >
                                  Chỉnh sửa
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsEditing(false);
                                      if (userInfo) {
                                        setFormData({
                                          fullName: userInfo.fullName || "",
                                          phone: userInfo.phone,
                                          avatar: userInfo.avatar || "",
                                          dateOfBirth: userInfo.dateOfBirth,
                                          address: userInfo.address || "",
                                          city: userInfo.city || "",
                                          nation: userInfo.nation || "",
                                          bio: userInfo.bio || ""
                                        });
                                      }
                                    }}
                                    className="font-roboto-bold text-red-700 cursor-pointer border border-red-700 hover:text-white hover:bg-red-700 "
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    onClick={handleSubmitEdit}
                                    className="bg-[#289b31] cursor-pointer hover:bg-[#71c278] text-white font-roboto-bold"
                                  >
                                    Lưu thay đổi
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            <div>
                              <Label className="text-gray-400 font-roboto text-sm mb-1">Họ và tên</Label>
                              {isEditing ? (
                                <Input
                                  value={formData.fullName}
                                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                                  className="font-roboto-bold text-gray-800"
                                />
                              ) : (
                                <p className="font-roboto-bold text-gray-800">{userInfo.fullName}</p>
                              )}
                            </div>
                            
                            <div>
                              <Label className="text-gray-400 font-roboto text-sm mb-1">Email</Label>
                                <p className="font-roboto-bold text-gray-800">{userInfo.email}</p>
                            </div>
                            
                            <div>
                              <Label className="text-gray-400 font-roboto text-sm mb-1">Số điện thoại</Label>
                              {isEditing ? (
                                <Input
                                  type="text"
                                  value={formData.phone || ""}
                                  onChange={(e) => handleInputChange('phone', e.target.value)}
                                  className="font-roboto-bold text-gray-800"
                                  placeholder="Nhập số điện thoại"
                                />
                              ) : (
                                <p className="font-roboto-bold text-gray-800">{userInfo.phone || 'Chưa có'}</p>
                              )}
                            </div>
                            
                            <div>
                              <Label className="text-gray-400 font-roboto text-sm mb-1">Ngày sinh</Label>
                              {isEditing ? (
                                <Input
                                  type="date"
                                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ""}
                                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value ? new Date(e.target.value) : undefined)}
                                  className="font-roboto-bold text-gray-800"
                                />
                              ) : (
                                <p className="font-roboto-bold text-gray-800">
                                  {userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa có'}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <Label className="text-gray-400 font-roboto text-sm mb-1">Địa chỉ</Label>
                              {isEditing ? (
                                <Input
                                  value={formData.address || ""}
                                  onChange={(e) => handleInputChange('address', e.target.value)}
                                  className="font-roboto-bold text-gray-800"
                                />
                              ) : (
                                <p className="font-roboto-bold text-gray-800">{userInfo.address || 'Chưa có'}</p>
                              )}
                            </div>
                            
                            <div>
                              <Label className="text-gray-400 font-roboto text-sm mb-1">Thành phố</Label>
                              {isEditing ? (
                                <Input
                                  value={formData.city || ""}
                                  onChange={(e) => handleInputChange('city', e.target.value)}
                                  className="font-roboto-bold text-gray-800"
                                />
                              ) : (
                                <p className="font-roboto-bold text-gray-800">{userInfo.city || 'Chưa có'}</p>
                              )}
                            </div>
                            
                            <div>
                              <Label className="text-gray-400 font-roboto text-sm mb-1">Quốc gia</Label>
                              {isEditing ? (
                                <Input
                                  value={formData.nation || ""}
                                  onChange={(e) => handleInputChange('nation', e.target.value)}
                                  className="font-roboto-bold text-gray-800"
                                />
                              ) : (
                                <p className="font-roboto-bold text-gray-800">{userInfo.nation || 'Chưa có'}</p>
                              )}
                            </div>
                          
                            {(userInfo.bio || isEditing) && (
                              <div className={isMobile ? '' : 'col-span-2'}>
                                <Label className="text-gray-400 font-roboto text-sm mb-1">Tiểu sử</Label>
                                {isEditing ? (
                                  <Textarea
                                    value={formData.bio || ""}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="font-roboto text-gray-800 min-h-[100px]"
                                    placeholder="Giới thiệu về bản thân..."
                                  />
                                ) : (
                                  <p className="font-roboto text-gray-800">{userInfo.bio}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* tai khoan  */}
                        <div className={`${isMobile ? 'bg-white rounded-2xl border-2 border-gray-200 shadow-sm pt-6 pl-6 pr-6 pb-6' : 'bg-white rounded-2xl border-2 border-gray-200 shadow-sm pt-6 pl-6 pr-6 pb-6'}`}>
                          <h3 className="font-rosario-bold text-xl text-gray-900 mb-6">Tài khoản</h3>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                              <div>
                                <p className="font-roboto-bold text-gray-800">Mật khẩu</p>
                                <p className="text-gray-400 font-roboto text-sm">Cập nhật lần cuối: N/A</p>
                              </div>
                              <Button
                                variant="outline"
                                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-roboto-bold cursor-pointer"
                              >
                                Thay đổi
                              </Button>
                            </div>
                            
                            <div className="flex justify-between items-center pb-4 border-b">
                              <div>
                                <p className="font-roboto-bold text-gray-800">Đăng nhập lần cuối</p>
                                <p className="text-gray-400 font-roboto text-sm">
                                  {userInfo.last_login ? (() => {
                                        const date = new Date(userInfo.last_login);
                                        const dateStr = date.toLocaleDateString('vi-VN', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        });
                                        const timeStr = date.toLocaleTimeString('vi-VN', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        });
                                        return `${dateStr}, ${timeStr}`;
                                      })()
                                    : 'Chưa có thông tin'
                                  }
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-roboto-bold text-gray-800">User ID</p>
                                <p className="text-gray-400 font-roboto text-xs break-all">{userInfo.user_id}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="instructor-profile">
                      <div className={`${isMobile ? '' : ' mt-6'}`}>
                        <div className={`${isMobile ? 'bg-white rounded-2xl border-2 border-gray-200 shadow-sm pt-6 pl-6 pr-6 pb-6' : 'bg-white rounded-2xl border-2 border-gray-200 shadow-sm pt-6 pl-6 pr-6 pb-6'}`}>
                          <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-col'} justify-start gap-3 items-start mb-6`}>
                            <Button onClick={() => '/'} className="bg-[#371D8C] cursor-pointer hover:bg-[#2a1567] text-white font-roboto-bold">
                              Cập nhật hồ sơ giảng viên
                            </Button>
                          </div>
                          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            <div>
                              <p className="text-gray-400 font-roboto text-sm mb-1">Họ và tên</p>
                              <p className="font-roboto-bold text-gray-800">{userInfo.fullName}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-roboto text-sm mb-1">Email</p>
                              <p className="font-roboto-bold text-gray-800">{userInfo.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-roboto text-sm mb-1">Số điện thoại</p>
                              <p className="font-roboto-bold text-gray-800">{userInfo.phone || 'Chưa có'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-roboto text-sm mb-1">Ngày sinh</p>
                              <p className="font-roboto-bold text-gray-800">
                                {userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa có'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-roboto text-sm mb-1">Địa chỉ</p>
                              <p className="font-roboto-bold text-gray-800">{userInfo.address || 'Chưa có'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-roboto text-sm mb-1">Thành phố</p>
                              <p className="font-roboto-bold text-gray-800">{userInfo.city || 'Chưa có'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-roboto text-sm mb-1">Quốc gia</p>
                              <p className="font-roboto-bold text-gray-800">{userInfo.nation || 'Chưa có'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-roboto text-sm mb-1">Vai trò</p>
                              <p className="font-roboto-bold text-gray-800">{userInfo.role || 'Chưa có'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-roboto text-sm mb-1">Trạng thái</p>
                              <p className="font-roboto-bold text-gray-800">
                                {userInfo.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-roboto text-sm mb-1">User ID</p>
                              <p className="font-roboto-bold text-gray-800 text-xs">{userInfo.user_id}</p>
                            </div>
                            {userInfo.bio && (
                              <div className={isMobile ? '' : 'col-span-2'}>
                                <p className="text-gray-400 font-roboto text-sm mb-1">Tiểu sử</p>
                                <p className="font-roboto text-gray-800">{userInfo.bio}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6">
            {toast("Lỗi khi lấy thông tin người dùng!")}
            <p> Lỗi khi lấy thông tin người dùng, vui lòng thử lại</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
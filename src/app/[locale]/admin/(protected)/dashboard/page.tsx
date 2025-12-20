"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, BookOpen, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from '@/app/lib/axios';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

// --- Types ---
type CourseStatus = "Draft" | "Published" | "Pending" | "Archived";
interface Course {
  course_id: string;
  title: string;
  slug: string;
  thumbnail: string;
  price: number;
  sale_off: boolean;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  instructor?: {
    user: {
      fullName: string;
      avatar: string | null;
    }
  };
  category?: {
    category_name: string;
  };
  _count?: {
    learnerCourses: number;
  }
}
interface User {
  user_id: string;
  email: string;
  fullName: string;
  gender: string;
  role: string;
  phone: string | number | null;
  avatar: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  nation?: string | null;
  bio?: string | null;
  last_login?: string | null;
  isActive: boolean;
  createdAt?: string;
}
type TransactionStatus = "Pending" | "Success" | "Cancel" | "Refund";
type TransactionType = "Withdraw" | "Deposit" | "Pay" | "Refund";
interface Transaction {
  transaction_id: string;
  amount: number;
  status: TransactionStatus;
  transaction_type: TransactionType;
  payment_code: string;
  createdAt: string;
  user: User;
  course?: Course;
}
interface Stats {
  totalRevenue: number;
  totalUsers: number;
  totalCourses: number;
  avgCourseRating: number;
  newUsers: number;
  revenueGrowth: number;
}
interface RevenueMonth {
  name: string;
  total: number;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalUsers: 0,
    totalCourses: 0,
    avgCourseRating: 0,
    newUsers: 0,
    revenueGrowth: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueMonth[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // 1. Lấy tổng số user, user mới
        const userRes = await api.get('/users/getUserExceptAdmin');
        const users: User[] = userRes.data || [];
        const totalUsers = users.length;
        // Người dùng mới trong tuần (7 ngày gần nhất)
        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        const newUsers: User[] = users.filter((u) => u.createdAt && new Date(u.createdAt) >= weekAgo);

        // 2. Lấy tổng số khóa học, rating TB
        const courseRes = await api.get('/courses');
        const courses: Course[] = courseRes.data?.data || courseRes.data || [];
        const totalCourses = courses.length;
        // Tính điểm TB
        let avgCourseRating = 0;
        if (totalCourses > 0) {
          const sum = courses.reduce((acc: number, c: Course) => acc + (c.rating || 0), 0);
          avgCourseRating = sum / totalCourses;
        }

        // 3. Lấy tổng doanh thu, tăng trưởng, dữ liệu biểu đồ
        const transRes = await api.get('/transactions');
        const transactions: Transaction[] = transRes.data.data || transRes.data || [];
        // Chỉ lấy giao dịch thành công
        const paid: Transaction[] = transactions.filter((t) => t.status === 'Success');
        const totalRevenue = paid.reduce((acc: number, t: Transaction) => acc + (t.amount || 0), 0);

        // Dữ liệu doanh thu 12 tháng gần nhất
        // 1. Tạo mảng 12 tháng chuẩn (Dùng Array để ĐẢM BẢO thứ tự thời gian)
        const chartData: RevenueMonth[] = [];
        const keyToIndex = new Map<string, number>();

        for (let i = 11; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
          
          // Push vào mảng: Index 0 là tháng xa nhất, Index 11 là tháng hiện tại
          chartData.push({ name: key, total: 0 });
          keyToIndex.set(key, chartData.length - 1); // Lưu lại index
        }

        // 2. Cộng tiền vào đúng vị trí trong mảng
        paid.forEach((t: Transaction) => {
          const d = new Date(t.createdAt);
          const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
          
          const index = keyToIndex.get(key);
          // Nếu tìm thấy key này trong 12 tháng đã tạo
          if (index !== undefined) {
            chartData[index].total += t.amount;
          }
        });

        // 3. Tính toán tăng trưởng (Lấy trực tiếp từ mảng đã sort chuẩn)
        const thisMonthTotal = chartData[chartData.length - 1].total; // Tháng hiện tại (Cuối mảng)
        const lastMonthTotal = chartData.length > 1 ? chartData[chartData.length - 2].total : 0; // Tháng trước (Kế cuối)

        let revenueGrowth = 0;
        if (lastMonthTotal > 0) {
            revenueGrowth = +(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1);
        }

        // Set state
        setStats({
          totalRevenue,
          totalUsers,
          totalCourses,
          avgCourseRating: avgCourseRating ? +avgCourseRating.toFixed(2) : 0,
          newUsers: newUsers.length,
          revenueGrowth,
        });
        setRevenueData(chartData); // Dùng mảng chartData chuẩn này
        // Lấy 5 user mới nhất
        const sortedNewUsers: User[] = [...users]
          .filter((u) => u.createdAt)
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .slice(0, 5);
        setRecentUsers(sortedNewUsers);
      } catch (err) {
        console.error('Lỗi tải dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Thống kê tổng quan</h1>
          <p className="text-muted-foreground mt-1">Chào mừng bạn đến trang quản trị hệ thống.</p>
        </div>
      </div>

      {/* --- STATS CARDS (KPIs) --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Tổng doanh thu" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={DollarSign}
          note={stats.revenueGrowth >= 0 
            ? `+${stats.revenueGrowth}% so với tháng trước` 
            : `${stats.revenueGrowth}% so với tháng trước`}
        />
        <StatsCard 
          title="Người dùng" 
          value={`${stats.totalUsers}`} 
          icon={Users}
          note={`+${stats.newUsers} người dùng mới tuần này`}
        />
        <StatsCard 
          title="Khóa học" 
          value={stats.totalCourses.toString()} 
          icon={BookOpen}
        />
      </div>

      {/* --- CHARTS & LISTS --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* BIỂU ĐỒ DOANH THU (Chiếm 4 cột) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Biểu đồ doanh thu</CardTitle>
            <CardDescription>Doanh thu hệ thống 12 tháng gần nhất</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      interval={0}
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => {
                        if (value === 0) return '0đ';
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}tr`;
                        if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                        return `${value}đ`;
                      }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f4f4f5' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
                    />
                    <Bar 
                      dataKey="total" 
                      fill="#e11d48" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Chưa có dữ liệu doanh thu
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* DANH SÁCH NGƯỜI DÙNG MỚI (Chiếm 3 cột) */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Người dùng mới</CardTitle>
            <CardDescription>
              Có {recentUsers.length} người dùng mới trong tuần qua.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentUsers.map((user) => (
                <div key={user.user_id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar || undefined} alt="Avatar" />
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {user.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-green-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : ''}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-sm text-muted-foreground hover:text-primary">
              Xem tất cả người dùng <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, note }: { title: string, value: string, icon: React.ComponentType<{ className?: string }>, note?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {note && (
          <p className="text-xs text-muted-foreground mt-1">
            {note}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

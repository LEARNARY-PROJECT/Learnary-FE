"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/axios";
import { Course, Category } from "@/type/course.type";
import { toast } from "sonner";
import SingleCourseCard from "@/components/SingleCourseCard";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface CategoryCoursesResponse {
  data: Course[];
  pagination: PaginationData;
  category: Category
}

export default function CategoryCoursesPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const isMobile = useIsMobile();

  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCourses = useCallback(async (page: number, append: boolean = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      const res = await api.get(`/categories/slug/${slug}`, {
        params: {
          page,
          limit: 12
        }
      });
      const responseData: CategoryCoursesResponse = res.data.data;
      if (append) {
        setCourses(prev => [...prev, ...responseData.data]);
      } else {  
        setCourses(responseData.data);
        if (res.data.data.category) {
          setCategoryName(res.data.data.category?.category_name);
        }
      }
      setPagination(responseData.pagination);
      setCurrentPage(page);
    } catch (error: unknown) {
      console.error("Error fetching courses:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error === "Can not found slug") {
          toast.error("Không tìm thấy danh mục này");
        } else if (axiosError.response?.data?.error === "Can not found category") {
          toast.error("Danh mục không tồn tại");
        } else {
          toast.error("Không thể tải danh sách khóa học");
        }
      } else {
        toast.error("Có lỗi xảy ra khi tải khóa học");
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  },[slug]);

  useEffect(() => {
    if (slug) {
      fetchCourses(1);
    }
  }, [fetchCourses, slug]);

  const handleLoadMore = () => {
    if (pagination?.hasMore) {
      fetchCourses(currentPage + 1, true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500 text-lg">Chưa có khóa học nào trong danh mục này</p>
        <Button 
          onClick={() => window.history.back()} 
          className="bg-pink-600 hover:bg-pink-500"
        >
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen mt-6">
      <div className={`${isMobile ? 'breadcrumb ml-5 pt-5' : 'breadcrumb ml-15 pt-5'}`}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/category-list">Danh mục</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{categoryName || "LỖI DANH MỤC"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mb-8 mt-6">
        <h1 className="text-2xl font-roboto-condensed-bold text-start mb-2">
          Danh sách Khóa học thuộc danh mục <span className="text-3xl text-pink-600">{categoryName || "LỖI DANH MỤC"}</span> 
        </h1>
        {pagination && (
          <p className="text-start text-gray-600">
            Tìm thấy {pagination.total} khóa học
          </p>
        )}
      </div>

      <div className={`${ isMobile ? "grid grid-cols-1 gap-4 justify-items-center"  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" }`}>
        {courses.map((course) => (
          <SingleCourseCard key={course.course_id} course={course} />
        ))}
      </div>

      {pagination?.hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleLoadMore} disabled={isLoadingMore} className="bg-pink-600 hover:bg-pink-500 px-8 py-2">
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              "Xem thêm"
            )}
          </Button>
        </div>
      )}

      {pagination && !pagination.hasMore && courses.length > 0 && (
        <p className="text-center text-gray-500 mt-8">
          Đã hiển thị tất cả {pagination.total} khóa học
        </p>
      )}
    </div>
  );
}

"use client";
import React, { useEffect, useState, useMemo } from "react";
import api from "@/app/lib/axios";
import { Category } from "@/type/course.type";
import { toast } from "sonner";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function CategoryListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const apiData = res.data;
        
        if (apiData.success && Array.isArray(apiData.data)) {
          setCategories(apiData.data);
        } else if (Array.isArray(apiData)) {
          setCategories(apiData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh sách danh mục");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(category => 
      category.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex items-start justify-start min-h-screen">
        <p className="text-gray-500 text-lg">Khám phá danh mục của chúng tôi</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className={`${isMobile ? 'breadcrumb ml-5 pt-5' : 'breadcrumb ml-15 pt-5'}`}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh mục khóa học</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="text-4xl font-roboto-condensed-bold text-center mb-8 mt-6">
        Tất cả các danh mục khóa học
      </h1>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border-2 focus:border-pink-400"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-500 mt-2">
            Tìm thấy {filteredCategories.length} danh mục
          </p>
        )}
      </div>

      {filteredCategories.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy danh mục nào</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}>
          {filteredCategories.map((category) => (
          <Link key={category.category_id} href={`/category-courses-list/${category.slug}`}>
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer border-2 hover:border-pink-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-roboto-condensed-bold">
                    {category.category_name}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-pink-100 text-pink-600">
                    {category._count?.courses || 0} khóa học
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {category.description || "Khám phá các khóa học trong danh mục này"}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
        </div>
      )}
    </div>
  );
}

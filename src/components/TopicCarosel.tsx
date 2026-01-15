"use client";

import React, { useState, useEffect } from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import api from "@/app/lib/axios";
import { Category } from "@/type/course.type";
import Link from "next/link";

export default function TopicCarosel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories")
        const data = response.data.data;
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full py-5 flex items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  const data = categories.map((category) => ({
    category: category.category_name || "Không có tên",
    title: category.category_name || "Không có tên",
    src: `/images/background/partern_background.jpg`,
    slug: category.slug || "",
    href: `/category-courses-list/${category.slug || ""}`,
    content:""
  }));

  const cards = data.map((card, index) => (
    <Link key={card.category + index} href={card.href} className="block">
      <Card card={card} index={index} disableClick={true} />
    </Link>
  ));

  return (
    <div className="w-full h-full py-5 ">
      <Carousel items={cards}/>
    </div>
  );
}

import Hero from "@/components/Hero";
import ListTopic from "@/components/ListTopic";
import ListCourseCard from "@/components/ListCourseCard";

export default function HomePage() {
  return (
    <div className="w-full flex-col gap-0">
      <Hero />
      <ListTopic />
      <ListCourseCard/>
    </div>
  );
}

import Hero from "@/components/Hero";
import ListTopic from "@/components/ListTopic";
import ListCourseCard from "@/components/ListCourseCard";

export default function HomePage() {
  return (

    <div className="w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth scrollbar-hide">
      <section className="h-screen snap-start">
        <Hero />
      </section>
      
      <section className="min-h-screen snap-start shadow-2xl">
        <ListTopic />
        <ListCourseCard/>
      </section>
    </div>
  );
}

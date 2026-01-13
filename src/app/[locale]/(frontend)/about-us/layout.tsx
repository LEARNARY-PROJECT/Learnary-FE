import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const aboutLinks = [
  {
    title: "Learnary là gì",
    href: "/about-us",
  },
  {
    title: "Điều khoản và chính sách",
    href: "/about-us/terms-and-policies",
  },
  {
    title: "Hướng dẫn",
    href: "/about-us/guide",
  },
]

function AboutSidebar() {
  return (
    <Sidebar className="">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Về chúng tôi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aboutLinks.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton asChild>
                    <Link href={link.href}>
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AboutSidebar />
      <main className="flex-1 w-full ml-10 mt-10">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
import { Book, Home, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { UserButton } from "@daveyplate/better-auth-ui";
import Credits from "./Credits";
import { Button } from "./ui/button";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Create",
    url: "/create",
    icon: Book,
  },
  {
    title: "Stories",
    url: "/stories",
    icon: Book,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="">
      <SidebarContent className="bg-gradient-to-b from-black/10 to-sky-200">
        <SidebarGroup>
          <SidebarGroupLabel className="">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-gradient-to-t from-black/10 to-sky-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span>credits: </span>
            <Credits />
          </div>
          <Button variant={"outline"} size={"sm"} className="cursor-pointer">
            Buy Credits
          </Button>
        </div>
        <UserButton variant={"outline"} />
      </SidebarFooter>
    </Sidebar>
  );
}

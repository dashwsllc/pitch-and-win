import { 
  BarChart3, 
  Users, 
  Trophy, 
  Settings,
  Home,
  MessageSquare,
  ShoppingCart
} from "lucide-react"
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Abordagens", url: "/abordagens", icon: MessageSquare },
  { title: "Vendas", url: "/vendas", icon: ShoppingCart },
  { title: "Ranking", url: "/ranking", icon: Trophy },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()

  return (
    <Sidebar 
      className={`transition-all duration-300 ${
        state === "collapsed" ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            {state !== "collapsed" && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">
                  Sales Pro
                </h1>
                <p className="text-sm text-sidebar-foreground/70">
                  Dashboard
                </p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          {state !== "collapsed" && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
              Menu Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary border border-sidebar-primary/20"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {state !== "collapsed" && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
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
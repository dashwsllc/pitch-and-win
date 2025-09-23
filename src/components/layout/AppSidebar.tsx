import { 
  BarChart3, 
  Home,
  ClipboardList,
  Trophy,
  Users,
  User,
  Settings,
  FileText,
  Target,
  MessageSquare,
  ShoppingCart,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { 
    title: "Formulários", 
    icon: ClipboardList, 
    isDropdown: true,
    submenu: [
      { title: "Vendas", url: "/vendas", icon: ShoppingCart },
      { title: "Abordagens", url: "/abordagens", icon: MessageSquare },
      { title: "Metas", url: "/workboard", icon: Target },
    ]
  },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Documentos", url: "/documentos", icon: FileText },
  { title: "Ranking", url: "/ranking", icon: Trophy },
  { title: "Perfil", url: "/perfil", icon: User },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()

  const isFormularioActive = (submenu: any[]) => {
    return submenu.some(subItem => location.pathname === subItem.url) || location.pathname === '/formularios'
  }

  return (
    <aside className="w-16 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50">
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-2">
        {menuItems.map((item) => {
          if (item.isDropdown && item.submenu) {
            return (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all ${
                      isFormularioActive(item.submenu)
                        ? "bg-sidebar-accent text-sidebar-primary border border-sidebar-primary/20"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    }`}
                    title={item.title}
                  >
                    <item.icon className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="ml-2">
                  {item.submenu.map((subItem) => (
                    <DropdownMenuItem key={subItem.title} asChild>
                      <NavLink
                        to={subItem.url}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <subItem.icon className="w-4 h-4" />
                        {subItem.title}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }

          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) =>
                `flex items-center justify-center w-12 h-12 rounded-lg transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary border border-sidebar-primary/20"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`
              }
              title={item.title}
            >
              <item.icon className="w-5 h-5" />
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
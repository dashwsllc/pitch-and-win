import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { ProductsChart } from "@/components/dashboard/ProductsChart"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { FilterTabs } from "@/components/dashboard/FilterTabs"
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Target,
  Award 
} from "lucide-react"

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState("30dias")

  // Dados simulados - na implementação real, viriam de uma API
  const metrics = {
    totalVendas: "R$ 45.234",
    quantidadeVendas: 23,
    ticketMedio: "R$ 1.966",
    abordagens: 67,
    conversao: "34.3%",
    ranking: 3
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Bem-vindo de volta! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Aqui está um resumo da sua performance de vendas
              </p>
            </div>
          </div>
          
          <FilterTabs 
            value={selectedFilter} 
            onValueChange={setSelectedFilter} 
          />
        </div>

        {/* Métricas principais */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            title="Total de Vendas"
            value={metrics.totalVendas}
            icon={<DollarSign className="w-6 h-6" />}
            trend={{ value: 12.5, isPositive: true }}
            gradient
            className="xl:col-span-2"
          />
          
          <MetricCard
            title="Quantidade de Vendas"
            value={metrics.quantidadeVendas}
            icon={<ShoppingCart className="w-6 h-6" />}
            trend={{ value: 8.2, isPositive: true }}
          />
          
          <MetricCard
            title="Ticket Médio"
            value={metrics.ticketMedio}
            icon={<TrendingUp className="w-6 h-6" />}
            trend={{ value: 5.1, isPositive: true }}
          />
          
          <MetricCard
            title="Abordagens"
            value={metrics.abordagens}
            icon={<Users className="w-6 h-6" />}
            trend={{ value: -2.4, isPositive: false }}
          />
          
          <MetricCard
            title="Taxa Conversão"
            value={metrics.conversao}
            icon={<Target className="w-6 h-6" />}
            trend={{ value: 15.8, isPositive: true }}
          />
          
          <MetricCard
            title="Posição Ranking"
            value={`#${metrics.ranking}`}
            subtitle="de 12 vendedores"
            icon={<Award className="w-6 h-6" />}
            className="animate-pulse-glow"
          />
        </div>

        {/* Gráficos e ações */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <SalesChart />
            <ProductsChart />
          </div>
          
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { ProductsRanking } from "@/components/dashboard/ProductsRanking"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { FilterTabs } from "@/components/dashboard/FilterTabs"
import { Button } from "@/components/ui/button"
import { useDashboardData } from "@/hooks/useDashboardData"
import { useRankingDataWithMock } from "@/hooks/useRankingDataWithMock"
import { useWithdrawData } from "@/hooks/useWithdrawData"
import { useAuth } from "@/hooks/useAuth"
import { CommissionCard } from "@/components/dashboard/CommissionCard"
import { WithdrawDialog } from "@/components/dashboard/WithdrawDialog"
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Target,
  RefreshCw,
  Banknote
} from "lucide-react"

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState("hoje")
  const { user } = useAuth()
  const { metrics, loading, refetch } = useDashboardData(selectedFilter)
  const { ranking } = useRankingDataWithMock()
  const { data: withdrawData, loading: withdrawLoading, refetch: refetchWithdraw } = useWithdrawData()

  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || "Usuário"
  const userPosition = ranking.findIndex(r => r.isCurrentUser) + 1

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Bem-vindo de volta, {userName}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Aqui está um resumo da sua performance de vendas
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <WithdrawDialog 
                availableAmount={withdrawData.availableAmount}
                onWithdrawRequest={refetchWithdraw}
              />
              
              <Button 
                onClick={() => {
                  refetch()
                  refetchWithdraw()
                }} 
                variant="ghost"
                size="icon"
                className="w-fit h-fit p-2 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <FilterTabs 
            value={selectedFilter} 
            onValueChange={setSelectedFilter} 
          />
        </div>

        {/* Métricas principais */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Total de Vendas"
            value={new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(metrics.totalVendas)}
            icon={<DollarSign className="w-8 h-8" />}
            trend={{ value: 12.5, isPositive: true }}
            gradient
            loading={loading}
          />
          
          <CommissionCard
            title="Comissão"
            value={new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(metrics.comissao)}
            availableAmount={withdrawData.availableAmount}
            icon={<Banknote className="w-6 h-6" />}
            trend={{ value: 12.5, isPositive: true }}
            loading={loading || withdrawLoading}
          />
          
          <MetricCard
            title="Quantidade de Vendas"
            value={metrics.quantidadeVendas}
            icon={<ShoppingCart className="w-8 h-8" />}
            trend={{ value: 8.2, isPositive: true }}
            loading={loading}
          />
          
          <MetricCard
            title="Ticket Médio"
            value={new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(metrics.ticketMedio)}
            icon={<TrendingUp className="w-8 h-8" />}
            trend={{ value: 5.1, isPositive: true }}
            loading={loading}
            className="[&_.text-4xl]:text-2xl"
          />
          
          <MetricCard
            title="Abordagens"
            value={metrics.abordagens}
            icon={<Users className="w-8 h-8" />}
            trend={{ value: -2.4, isPositive: false }}
            loading={loading}
          />
          
          <MetricCard
            title="Taxa Conversão"
            value={`${metrics.conversao.toFixed(1)}%`}
            icon={<Target className="w-8 h-8" />}
            trend={{ value: 15.8, isPositive: true }}
            loading={loading}
          />
        </div>

        {/* Gráficos e ações */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <SalesChart data={metrics.vendasMes} loading={loading} />
            <ProductsRanking data={metrics.produtosMaisVendidos} loading={loading} />
          </div>
          
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

interface CommissionData {
  totalCommissions: number
  availableForWithdrawal: number
  withdrawnAmount: number
}

export function useCommissionData() {
  const [data, setData] = useState<CommissionData>({
    totalCommissions: 0,
    availableForWithdrawal: 0,
    withdrawnAmount: 0,
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchCommissionData = async () => {
    if (!user) return

    try {
      // Buscar todas as vendas do usuário para calcular comissão total
      const { data: vendas, error: vendasError } = await supabase
        .from('vendas')
        .select('valor_venda')
        .eq('user_id', user.id)

      if (vendasError) throw vendasError

      // Calcular comissão total (12% das vendas)
      const totalVendas = vendas?.reduce((sum, venda) => sum + parseFloat(venda.valor_venda.toString()), 0) || 0
      const totalCommissions = totalVendas * 0.12

      // Buscar valor já sacado
      const { data: saques, error: saquesError } = await supabase
        .from('saques')
        .select('valor_solicitado')
        .eq('user_id', user.id)
        .eq('status', 'aprovado')

      if (saquesError) throw saquesError

      const withdrawnAmount = saques?.reduce((sum, saque) => sum + parseFloat(saque.valor_solicitado.toString()), 0) || 0
      const availableForWithdrawal = totalCommissions - withdrawnAmount

      setData({
        totalCommissions,
        availableForWithdrawal: Math.max(0, availableForWithdrawal),
        withdrawnAmount,
      })

      // Atualizar ou criar registro de saldo
      const { error: upsertError } = await supabase
        .from('saldos_disponiveis')
        .upsert({
          user_id: user.id,
          valor_total_comissoes: totalCommissions,
          valor_liberado_para_saque: totalCommissions,
          valor_sacado: withdrawnAmount,
        }, {
          onConflict: 'user_id'
        })

      if (upsertError) {
        console.error('Error upserting balance:', upsertError)
      }

    } catch (error) {
      console.error('Error fetching commission data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCommissionData()
    }
  }, [user])

  return {
    data,
    loading,
    refetch: fetchCommissionData,
  }
}
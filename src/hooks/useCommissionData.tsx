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

      // Buscar saldo atual para respeitar bloqueios por saques pendentes
      const { data: saldo, error: saldoError } = await supabase
        .from('saldos_disponiveis')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (saldoError) throw saldoError

      const currentWithdrawn = parseFloat((saldo?.valor_sacado ?? 0).toString())
      const currentAvailable = saldo ? parseFloat(saldo.valor_liberado_para_saque.toString()) : totalCommissions

      setData({
        totalCommissions,
        availableForWithdrawal: Math.max(0, currentAvailable),
        withdrawnAmount: currentWithdrawn,
      })

      // Atualizar ou criar registro de saldo sem sobrescrever o disponível
      if (saldo) {
        const { error: updateError } = await supabase
          .from('saldos_disponiveis')
          .update({ valor_total_comissoes: totalCommissions })
          .eq('user_id', user.id)
        if (updateError) console.error('Error updating balance:', updateError)
      } else {
        const { error: insertError } = await supabase
          .from('saldos_disponiveis')
          .insert({
            user_id: user.id,
            valor_total_comissoes: totalCommissions,
            valor_liberado_para_saque: totalCommissions,
            valor_sacado: 0,
          })
        if (insertError) console.error('Error inserting balance:', insertError)
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
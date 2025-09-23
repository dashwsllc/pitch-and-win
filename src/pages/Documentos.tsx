import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Eye, 
  Plus,
  Calendar,
  User
} from 'lucide-react'

// Mock data para documentos
const mockDocuments = {
  vendas: [
    {
      id: 1,
      title: "Contrato de Mentoria Padrão",
      description: "Modelo de contrato para mentorias individuais",
      date: "2024-01-15",
      author: "Administrativo",
      type: "PDF"
    },
    {
      id: 2,
      title: "Política de Cancelamento",
      description: "Diretrizes para cancelamentos e reembolsos",
      date: "2024-01-10",
      author: "Jurídico",
      type: "PDF"
    }
  ],
  regimento: [
    {
      id: 3,
      title: "Código de Conduta dos Vendedores",
      description: "Normas e diretrizes para a equipe de vendas",
      date: "2024-01-20",
      author: "RH",
      type: "PDF"
    },
    {
      id: 4,
      title: "Política de Comissões",
      description: "Regulamentação do sistema de comissionamento",
      date: "2024-01-18",
      author: "Financeiro",
      type: "PDF"
    }
  ],
  operacional: [
    {
      id: 5,
      title: "Manual de Processos de Vendas",
      description: "Guia completo do processo de vendas",
      date: "2024-01-25",
      author: "Operacional",
      type: "PDF"
    },
    {
      id: 6,
      title: "Treinamento - Abordagem de Clientes",
      description: "Material de treinamento para vendedores",
      date: "2024-01-22",
      author: "Treinamento",
      type: "PDF"
    }
  ]
}

export default function Documentos() {
  const [selectedCategory, setSelectedCategory] = useState('vendas')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getDocumentsByCategory = (category: string) => {
    return mockDocuments[category as keyof typeof mockDocuments] || []
  }

  const DocumentCard = ({ document }: { document: any }) => (
    <Card className="border-border/50 hover:border-border transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-foreground">{document.title}</h3>
              <p className="text-sm text-muted-foreground">{document.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(document.date)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {document.author}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {document.type}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Documentos</h1>
              <p className="text-muted-foreground">
                Acesse documentos organizados por categoria
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Documento
          </Button>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vendas">Vendas</TabsTrigger>
            <TabsTrigger value="regimento">Regimento Interno</TabsTrigger>
            <TabsTrigger value="operacional">Operacional</TabsTrigger>
          </TabsList>

          <TabsContent value="vendas" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documentos de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getDocumentsByCategory('vendas').map((document) => (
                    <DocumentCard key={document.id} document={document} />
                  ))}
                  {getDocumentsByCategory('vendas').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum documento encontrado nesta categoria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regimento" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Regimento Interno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getDocumentsByCategory('regimento').map((document) => (
                    <DocumentCard key={document.id} document={document} />
                  ))}
                  {getDocumentsByCategory('regimento').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum documento encontrado nesta categoria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operacional" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documentos Operacionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getDocumentsByCategory('operacional').map((document) => (
                    <DocumentCard key={document.id} document={document} />
                  ))}
                  {getDocumentsByCategory('operacional').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum documento encontrado nesta categoria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
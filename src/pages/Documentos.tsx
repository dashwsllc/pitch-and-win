import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  ExternalLink, 
  Eye, 
  Plus,
  Calendar,
  User
} from 'lucide-react'
import { useDocuments, Document } from '@/hooks/useDocuments'
import { AddDocumentDialog } from '@/components/documents/AddDocumentDialog'
import { useRoles } from '@/hooks/useRoles'

// Mock data para documentos com datas de setembro 2025
const mockDocuments = {
  vendas: [
    {
      id: 1,
      title: "Contrato de Mentoria Padrão",
      description: "Modelo de contrato para mentorias individuais",
      date: "2025-09-15",
      author: "Administrativo",
      type: "PDF",
      link_url: "https://example.com/contrato-mentoria"
    },
    {
      id: 2,
      title: "Política de Cancelamento",
      description: "Diretrizes para cancelamentos e reembolsos",
      date: "2025-09-10",
      author: "Jurídico",
      type: "PDF", 
      link_url: "https://example.com/politica-cancelamento"
    }
  ],
  regimento: [
    {
      id: 3,
      title: "Código de Conduta dos Vendedores",
      description: "Normas e diretrizes para a equipe de vendas",
      date: "2025-09-20",
      author: "RH",
      type: "PDF",
      link_url: "https://example.com/codigo-conduta"
    },
    {
      id: 4,
      title: "Política de Comissões",
      description: "Regulamentação do sistema de comissionamento",
      date: "2025-09-18",
      author: "Financeiro",
      type: "PDF",
      link_url: "https://example.com/politica-comissoes"
    }
  ],
  operacional: [
    {
      id: 5,
      title: "Manual de Processos de Vendas",
      description: "Guia completo do processo de vendas",
      date: "2025-09-25",
      author: "Operacional",
      type: "PDF",
      link_url: "https://example.com/manual-processos"
    },
    {
      id: 6,
      title: "Treinamento - Abordagem de Clientes",
      description: "Material de treinamento para vendedores",
      date: "2025-09-22",
      author: "Treinamento",
      type: "PDF",
      link_url: "https://example.com/treinamento-abordagem"
    }
  ]
}

export default function Documentos() {
  const [selectedCategory, setSelectedCategory] = useState('vendas')
  const { categories, documents, loading, getDocumentsByCategory, refetch } = useDocuments()
  const { isExecutive } = useRoles()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getMockDocumentsByCategory = (category: string) => {
    return mockDocuments[category as keyof typeof mockDocuments] || []
  }

  const getAllDocumentsForCategory = (category: string) => {
    const realDocs = getDocumentsByCategory(category)
    const mockDocs = getMockDocumentsByCategory(category)
    return [...realDocs, ...mockDocs]
  }

  const DocumentCard = ({ document, isRealDocument = false }: { document: Document | any, isRealDocument?: boolean }) => (
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
                  {formatDate(isRealDocument ? document.created_at : document.date)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {isRealDocument ? 'Sistema' : document.author}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {isRealDocument ? 'LINK' : document.type}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={() => window.open(isRealDocument ? document.link_url : document.link_url, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const handleDocumentAdded = () => {
    refetch()
  }

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
          {isExecutive && (
            <AddDocumentDialog categories={categories} onDocumentAdded={handleDocumentAdded} />
          )}
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
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Carregando documentos...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getAllDocumentsForCategory('vendas').map((document, index) => {
                      const isRealDocument = 'category_id' in document
                      return (
                        <DocumentCard 
                          key={isRealDocument ? document.id : `mock-${document.id}`} 
                          document={document} 
                          isRealDocument={isRealDocument}
                        />
                      )
                    })}
                    {getAllDocumentsForCategory('vendas').length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum documento encontrado nesta categoria.
                      </div>
                    )}
                  </div>
                )}
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
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Carregando documentos...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getAllDocumentsForCategory('regimento').map((document, index) => {
                      const isRealDocument = 'category_id' in document
                      return (
                        <DocumentCard 
                          key={isRealDocument ? document.id : `mock-${document.id}`} 
                          document={document} 
                          isRealDocument={isRealDocument}
                        />
                      )
                    })}
                    {getAllDocumentsForCategory('regimento').length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum documento encontrado nesta categoria.
                      </div>
                    )}
                  </div>
                )}
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
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Carregando documentos...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getAllDocumentsForCategory('operacional').map((document, index) => {
                      const isRealDocument = 'category_id' in document
                      return (
                        <DocumentCard 
                          key={isRealDocument ? document.id : `mock-${document.id}`} 
                          document={document} 
                          isRealDocument={isRealDocument}
                        />
                      )
                    })}
                    {getAllDocumentsForCategory('operacional').length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum documento encontrado nesta categoria.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
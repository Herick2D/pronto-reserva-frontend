"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { toast } from "react-hot-toast"

import { format, isBefore, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

import { useAuth } from "@/contexts/AuthContext"
import { Check, X, Pencil, Plus, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { NewReservaForm } from "@/components/new-reserva-form"
import { EditReservaForm } from "@/components/edit-reserva-form"
import { api } from "@/services/api"
import { confirmarReserva, cancelarReserva, Reserva } from "@/services/reservas"
import { withAuth } from "@/components/withAuth"
import { handleApiError } from "@/utils/handleApiError"

const statusConfig = {
  pendente:   { label: "Pendente",   color: "text-chart-3" },
  confirmada: { label: "Confirmada", color: "text-chart-2" },
  cancelada:  { label: "Cancelada",  color: "text-chart-5" },
}

function HomePage() {
  const { user, logout } = useAuth();

  const [reservas, setReservas] = useState<Reserva[]>([])
  const [isNewReservaDialogOpen, setIsNewReservaDialogOpen] = useState(false)
  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null)

  async function fetchReservas() {
    try {
      const response = await api.get("/api/reservas");
      setReservas(response.data.items);
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  }

  useEffect(() => {
    fetchReservas()
  }, [])

  async function handleConfirmReserva(id: string) {
    try {
      await confirmarReserva(id)
      toast.success("Reserva confirmada!")
      fetchReservas()
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage)
    }
  }

  async function handleCancelReserva(id: string) {
    try {
      await cancelarReserva(id)
      toast.success("Reserva cancelada.")
      fetchReservas()
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  }

  function isReservaEditable(dataReserva: string): boolean {
    const dataDaReserva = new Date(dataReserva)
    const seteDiasAntes = addDays(dataDaReserva, -7)
    return isBefore(new Date(), seteDiasAntes)
  }

  function handleEditSuccess() {
    setEditingReserva(null)
    fetchReservas()
  }

  return (
    <main className="p-6 md:p-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold">Minhas Reservas</h1>
          {user && <span className="text-sm text-muted-foreground">Bem-vindo, {user.email}</span>}
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isNewReservaDialogOpen} onOpenChange={setIsNewReservaDialogOpen}>
            <DialogTrigger asChild>
              <Button data-cy="open-new-reserva-modal">
                <Plus className="mr-2 h-4 w-4" />
                Nova Reserva
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Reserva</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da nova reserva.
                </DialogDescription>
              </DialogHeader>
              <NewReservaForm
                onSuccess={() => {
                  fetchReservas()
                  setIsNewReservaDialogOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="icon" onClick={logout} title="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <Dialog open={!!editingReserva} onOpenChange={() => setEditingReserva(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Reserva</DialogTitle>
            <DialogDescription>
              Altere os dados da sua reserva. Clique em &lsquo;Salvar Alterações&rsquo; quando terminar.
            </DialogDescription>
          </DialogHeader>
          {editingReserva && (
            <EditReservaForm 
              reserva={editingReserva}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {reservas.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <Image src="/assets/nothing_here.svg" alt="Sem reservas" width={300} height={300} className="mb-4" />
          <p className="text-lg text-muted-foreground">As coisas estão meio vazias por aqui...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservas.map((r) => {
            const editable = isReservaEditable(r.dataReserva)
            const statusInfo = statusConfig[r.status.toLowerCase() as keyof typeof statusConfig] || { label: r.status, color: "text-gray-500" };
            
            return (
              <Card key={r.id} className="card">
                <CardHeader>
                  <CardTitle>{r.nomeCliente}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(r.dataReserva), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-sm">Pessoas: {r.numeroPessoas}</p>
                  {r.observacoes && <p className="text-sm italic">&ldquo;{r.observacoes}&rdquo;</p>}
                  <p className={`text-sm font-semibold ${statusInfo.color}`}>
                    Status: {statusInfo.label}
                  </p>
                </CardContent>
                
                <CardFooter className="flex justify-end gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleConfirmReserva(r.id)} disabled={r.status.toLowerCase() === 'confirmada'} title="Confirmar Reserva" data-cy={`confirm-button-${r.id}`}>
                    <Check className={`h-4 w-4 text-chart-2`} />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => handleCancelReserva(r.id)} disabled={r.status.toLowerCase() === 'cancelada'} title="Cancelar Reserva" data-cy={`cancel-button-${r.id}`}>
                    <X className={`h-4 w-4 text-chart-5`} />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => setEditingReserva(r)} disabled={!editable} title={editable ? "Editar Reserva" : "Edição não permitida (menos de 7 dias de antecedência)"} data-cy={`edit-button-${r.id}`}>
                    <Pencil className={`h-4 w-4 ${!editable && 'text-muted-foreground'}`} />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default withAuth(HomePage);
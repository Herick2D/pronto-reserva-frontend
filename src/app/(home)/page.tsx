"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewReservaForm } from "@/components/new-reserva-form"
import { api } from "@/services/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"

type Reserva = {
  id: string
  nomeCliente: string
  dataReserva: string
  numeroPessoas: number
  status: "Pendente" | "Confirmado" | "Cancelado"
  observacoes?: string
}

export default function HomePage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  async function fetchReservas() {
  try {
    const response = await api.get("/api/reservas") 
    setReservas(response.data.items)
  } catch (err) {
    console.error("Erro ao buscar reservas:", err)
  }
}

  useEffect(() => {
    fetchReservas()
  }, [])

  function getStatusColor(status: string) {
    switch (status) {
      case "Pendente":
        return "text-yellow-500"
      case "Confirmado":
        return "text-green-500"
      case "Cancelado":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <main className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Minhas Reservas</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-xl px-4 py-2">+</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Reserva</DialogTitle>
            </DialogHeader>
            <NewReservaForm
              onSuccess={() => {
                fetchReservas()
                setIsDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {reservas.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <Image
            src="/assets/nothing_here.svg"
            alt="Sem reservas"
            width={300}
            height={300}
            className="mb-4"
          />
          <p className="text-lg text-muted-foreground">
            As coisas estão meio vazias por aqui...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservas.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <CardTitle>{r.nomeCliente}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {format(new Date(r.dataReserva), "dd 'de' MMMM 'de' yyyy, HH:mm", {
                    locale: ptBR,
                  })}
                </p>
                <p className="text-sm">Pessoas: {r.numeroPessoas}</p>
                {r.observacoes && <p className="text-sm italic">"{r.observacoes}"</p>}
                <p className={`text-sm font-semibold ${getStatusColor(r.status)}`}>
                  Status: {r.status}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

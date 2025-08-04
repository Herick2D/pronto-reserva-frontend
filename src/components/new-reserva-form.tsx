"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
import { createReserva } from "@/services/reservas"
import { SubmitHandler } from "react-hook-form"
import { convertLocalToUTCString } from "@/utils/date"

const schema = z.object({
  nomeCliente: z.string().min(3, "Nome muito curto"),
  dataReserva: z.string().refine((val) => {
    const data = new Date(val)
    const agora = new Date()
    const doisDias = 1000 * 60 * 60 * 24 * 2
    return data.getTime() - agora.getTime() >= doisDias
}, {
  message: "A reserva deve ter pelo menos 2 dias de antecedência",
}),
  numeroPessoas: z.coerce.number().min(1, "Informe pelo menos uma pessoa"),
  observacoes: z.string().optional(),
})

type FormData = z.infer<typeof schema>;

export function NewReservaForm({ onSuccess }: { onSuccess: () => void }) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm<FormData>({
    resolver: zodResolver(schema as any),
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const payloadFinal = {
        ...data,
        dataReserva: convertLocalToUTCString(data.dataReserva),
      };

      await createReserva(payloadFinal)
      toast.success("Reserva criada com sucesso!")
      reset()
      onSuccess()
    } catch (err: any) {
      toast.error("Erro ao criar reserva: " + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="nomeCliente">Nome</Label>
        <Input 
          id="nomeCliente" 
          {...register("nomeCliente")} 
          placeholder="Nome completo do cliente"
        />
        {errors.nomeCliente && (
          <p className="text-red-500 text-sm mt-1">{errors.nomeCliente.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="dataReserva">Data e Hora</Label>
        <Input 
          id="dataReserva" 
          type="datetime-local" 
          {...register("dataReserva")} 
        />
        {errors.dataReserva && (
          <p className="text-red-500 text-sm mt-1">{errors.dataReserva.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="numeroPessoas">Número de Pessoas</Label>
        <Input 
          id="numeroPessoas" 
          type="number" 
          min={1} 
          {...register("numeroPessoas", { valueAsNumber: true })} 
        />
        {errors.numeroPessoas && (
          <p className="text-red-500 text-sm mt-1">{errors.numeroPessoas.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea 
          id="observacoes" 
          {...register("observacoes")} 
          placeholder="Informações adicionais"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        Criar Reserva
      </Button>
    </form>
  )
}
"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Reserva, UpdateReserva } from "@/services/reservas"
import { updateReserva } from "@/services/reservas"
import { convertLocalToUTCString } from "@/utils/date"
import { handleApiError } from "@/utils/handleApiError"

const editReservaSchema = z.object({
  nomeCliente: z.string().min(1, "O nome do cliente é obrigatório."),
  dataReserva: z.string().min(1, "A data da reserva é obrigatória."),
  numeroPessoas: z.coerce.number().min(1, "O número de pessoas deve ser no mínimo 1."),
  observacoes: z.string().optional(),
})

interface EditReservaFormProps {
  reserva: Reserva
  onSuccess: () => void
}

export function EditReservaForm({ reserva, onSuccess }: EditReservaFormProps) {
  const form = useForm<z.infer<typeof editReservaSchema>>({
    //tipagem conflituosa com o zodResolver, solução para ignorar o erro e buildar.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editReservaSchema as any),

    defaultValues: {
      nomeCliente: reserva.nomeCliente,
      dataReserva: format(new Date(reserva.dataReserva), "yyyy-MM-dd'T'HH:mm"),
      numeroPessoas: reserva.numeroPessoas,
      observacoes: reserva.observacoes || "",
    },
  })

  async function onSubmit(data: z.infer<typeof editReservaSchema>) {
    try {
      const payload: UpdateReserva = {
        id: reserva.id,
        ...data,
        dataReserva: convertLocalToUTCString(data.dataReserva),
      }

      await updateReserva(reserva.id, payload)
      toast.success('Reserva atualizada com sucesso!')
      onSuccess()
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nomeCliente"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="nomeCliente">Nome do Cliente</Label>
              <FormControl>
                <Input id="nomeCliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dataReserva"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="dataReserva">Data e Hora</Label>
              <FormControl>
                <Input id="dataReserva" type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numeroPessoas"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="numeroPessoas">Número de Pessoas</Label>
              <FormControl>
                <Input id="numeroPessoas" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <FormControl>
                <Input id="observacoes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>
    </Form>
  )
}
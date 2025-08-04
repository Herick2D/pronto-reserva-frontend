"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { register as registerUser } from '@/services/auth'
import axios from 'axios';
import { handleApiError } from '@/utils/handleApiError'
import { useAuth } from '@/contexts/AuthContext';

const registerSchema = z.object({
  email: z.string().email("Formato de e-mail inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Precisa de uma letra maiúscula")
    .regex(/[a-z]/, "Precisa de uma letra minúscula")
    .regex(/[0-9]/, "Precisa de um número")
    .regex(/[^A-Za-z0-9]/, "Precisa de um caractere especial"),
})

type RegisterData = z.infer<typeof registerSchema>

export function RegisterForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { login } = useAuth();
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: RegisterData) {
    try {
      const res = await registerUser(data);
      login(res.token);
      toast.success('Conta criada com sucesso! Você já está logado.');
    } catch (error) {   
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        return toast.error("Este e-mail já está cadastrado.");
      }

      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Crie sua conta</CardTitle>
          <CardDescription>Informe e-mail e senha para cadastrar-se</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">E-mail</Label>
                    <FormControl>
                      <Input id="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Senha</Label>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Cadastrar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
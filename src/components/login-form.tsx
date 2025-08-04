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

import { useAuth } from '@/contexts/AuthContext';
import { login as loginService } from '@/services/auth';

const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})
type LoginData = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {

  const { login } = useAuth();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginData) {
    try {
      const res = await loginService(data);

      login(res.token);
      
      toast.success('Login efetuado com sucesso!');

    } catch (err: any) {
      toast.error(`Falha no login: ${err.message}`);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Entrar na sua conta</CardTitle>
          <CardDescription>
            Informe seu e-mail e senha para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">E-mail</Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <a
                        href="#"
                        className="text-sm underline-offset-4 hover:underline"
                      >
                        Esqueceu a senha?
                      </a>
                    </div>
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
                Entrar
              </Button>

              <div className="mt-4 text-center text-sm">
                Não tem uma conta?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Cadastre-se
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
import RegisterForm from "@/components/register-form"

export const metadata = {
  title: "Cadastro — Pronta Reserva",
  description: "Página de cadastro de novos usuários",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 dark:bg-background dark:text-foreground">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}

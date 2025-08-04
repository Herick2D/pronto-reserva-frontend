import { RegisterForm } from "@/components/register-form";
import Link from "next/link";

export const metadata = {
  title: "Cadastro — Pronta Reserva",
  description: "Página de cadastro de novos usuários",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 dark:bg-background dark:text-foreground">
      <div className="w-full max-w-sm">
        <RegisterForm />
        
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Faça o login
          </Link>
        </p>

      </div>
    </div>
  );
}
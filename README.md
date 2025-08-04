# Pronta-Reserva Frontend

Este é o frontend da aplicação Pronta-Reserva, desenvolvido para gerenciar e agendar reservas de forma eficiente. A aplicação foi construída com Next.js e o App Router.

## Funcionalidades

- **Autenticação de Usuários:** Sistema completo de Login e Registro.
- **Gerenciamento de Sessão:** Uso de JWT em Cookies para manter o usuário logado.
- **Proteção de Rotas:** Middleware para proteger rotas privadas, garantindo que apenas usuários autenticados possam acessá-las.
- **Listagem de Reservas:** Visualização de todas as reservas do usuário em formato de cards.
- **Criação e Edição de Reservas:** Modais para criar novas reservas e editar as existentes.
- **Ações de Status:** Funcionalidades para confirmar ou cancelar uma reserva.
- **Tratamento de Erros:** Sistema centralizado para fornecer feedback claro e amigável ao usuário.

## Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/) (App Router)** - Framework React para produção.
- **[React](https://react.dev/)** - Biblioteca para construção de interfaces.
- **[TypeScript](https://www.typescriptlang.org/)** - Superset do JavaScript com tipagem estática.
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de estilização utility-first.
- **[shadcn/ui](https://ui.shadcn.com/)** - Coleção de componentes de UI reutilizáveis.
- **[Axios](https://axios-http.com/)** - Cliente HTTP para fazer requisições à API.
- **[Zod](https://zod.dev/)** - Biblioteca para validação de schemas.
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários.
- **[date-fns](https://date-fns.org/)** - Biblioteca para manipulação de datas.
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones.

## Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/pt) (versão 20.x ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### Instalação

1. Clone o repositório;
    ```
        git clone https://github.com/Herick2D/pronto-reserva-frontend.git
    ```

2. Instale as dependências;
    ```
        npm install
    ```

3. Configure as variáveis de ambiente;
    ```
        NEXT_PUBLIC_API_BASE_URL=http://localhost:5129

        NEXT_PUBLIC_API_LOGIN_URL=http://localhost:5129/api/auth/login
        NEXT_PUBLIC_API_REGISTER_URL=http://localhost:5129/api/auth/register
        NEXT_PUBLIC_API_RESERVAS_URL=http://localhost:5129/api/reservas
    ```
4. Rodar o servidor de desenvolvimento;
    ```
        npm run dev
    ```


## Observações:
Este projeto foi desenvolvido dentro de prazos de entrega pré-estabelecidos e com objetivos avaliativos definidos. As escolhas de tecnologias e as metodologias de trabalho seguiram tanto as diretrizes do enunciado quanto critérios pessoais de eficiência e familiaridade.
Devido ao tempo limitado, algumas funcionalidades podem apresentar bugs ou comportamentos inesperados. Relatórios de issues, sugestões de melhorias e contribuições são muito bem-vindos!
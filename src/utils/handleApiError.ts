import axios from 'axios';


export function handleApiError(error: unknown): string {

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const serverMessage = error.response.data?.message;
      if (serverMessage) {
        return serverMessage;
      }
      switch (error.response.status) {
        case 400:
          return 'Dados inválidos. Por favor, verifique as informações fornecidas.';
        case 401:
          return 'Credenciais inválidas. Verifique seu e-mail e senha.';
        case 403:
          return 'Você não tem permissão para executar esta ação.';
        case 404:
          return 'O recurso solicitado não foi encontrado.';
        case 500:
          return 'Ocorreu um erro inesperado no servidor. Por favor, tente novamente mais tarde.';
        default:
          return `Ocorreu um erro de rede: ${error.response.status}`;
      }
    } else if (error.request) {
      return 'Não foi possível se conectar ao servidor. Verifique sua conexão com a internet.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro desconhecido.';
}
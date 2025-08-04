export function convertLocalToUTCString(dateString: string): string {
  if (!dateString) {
    return '';
  }

  const localDate = new Date(dateString);

  return localDate.toISOString();
}
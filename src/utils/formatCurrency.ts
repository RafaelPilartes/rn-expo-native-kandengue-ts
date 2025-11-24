// src/utils/formatCurrency.ts
export const formatCurrency = (amount: number): string => {
  return `Kz ${amount.toLocaleString('pt-AO')}`;
};

// src/utils/formatDate.ts
export const formatDate = (
  date: Date,
  format: string = 'dd/MM/yyyy',
): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year.toString())
    .replace('HH', hours)
    .replace('mm', minutes);
};

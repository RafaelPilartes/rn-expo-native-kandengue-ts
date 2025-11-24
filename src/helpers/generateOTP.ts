// Helper para gerar OTP code 4 dígitos
export const generateOTP = (digits: number = 4) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

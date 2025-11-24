export const formatMoney = (val: number, decimals: number = 2) => {
  if (isNaN(val)) return '0';

  // força sinal positivo/negativo
  const sign = val < 0 ? '-' : '';
  val = Math.abs(val);

  // fixa casas decimais
  const fixed = val.toFixed(decimals);

  // separa parte inteira e decimal
  let [intPart, decimalPart] = fixed.split('.');

  // adiciona separadores de milhar
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // retorna dependendo se precisa de decimais
  return decimals > 0
    ? `${sign}${intPart}.${decimalPart}`
    : `${sign}${intPart}`;
};

// Simulasi KPR anuitas dengan bunga tetap sepanjang tenor.
// Angsuran = P × r / (1 − (1 + r)^−n)
//   P = harga − DP, r = bunga tahunan / 12 / 100, n = tenor tahun × 12
// Jika r = 0, angsuran = P / n.

export type KprInput = {
  price: number;
  downPayment: number;
  years: number;
  annualRatePercent: number;
};

export type KprResult = {
  principal: number;
  months: number;
  monthlyRate: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
};

export function calculateKpr({ price, downPayment, years, annualRatePercent }: KprInput): KprResult | null {
  const principal = price - downPayment;
  const months = Math.round(years * 12);
  if (!(principal > 0) || !(months > 0) || annualRatePercent < 0) return null;
  const monthlyRate = annualRatePercent / 100 / 12;
  const monthlyPayment =
    monthlyRate === 0 ? principal / months : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const totalPayment = monthlyPayment * months;
  return {
    principal,
    months,
    monthlyRate,
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - principal,
  };
}

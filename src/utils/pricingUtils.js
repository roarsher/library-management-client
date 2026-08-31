// Mirrors backend/utils/pricingUtils.js — must stay in sync with that formula.
export const calculateBookingPrice = (monthlyPrice, durationMonths, library) => {
  const discountPercent = library?.settings?.durationDiscounts?.[durationMonths] || 0;
  const rawTotal = monthlyPrice * durationMonths;
  const total = rawTotal * (1 - discountPercent / 100);
  return Math.round(total);
};
import api from './api';

export const getMyReferralCode = () => api.get('/referrals/my-code');
export const redeemReferralCode = (referralCode) => api.post('/referrals/redeem', { referralCode });
export const getMyReferrals = () => api.get('/referrals/me');

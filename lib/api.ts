export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
export const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) throw new Error('API Error');
  return res.json();
};

export const fetchDemos = async () => {
  const response = await fetch('/demos');
  
  if (!response.ok) {
    throw new Error('Failed to fetch demos');
  }
  
  return response.json();
};
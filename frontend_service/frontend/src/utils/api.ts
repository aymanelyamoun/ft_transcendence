interface FetchAPIProps {
    url: string;
    method: string;
    body?: Record<string, any>;
  }
  
export const fetchAPI = async ({ url, method, body }: FetchAPIProps) => {
    try {
      const response = await fetch(url, {
        method,
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      return response.json();
    } catch (error : any) {
      if (error.message)
        throw new Error(error.message);
      throw new Error('error');
    }
  };
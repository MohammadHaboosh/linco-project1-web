const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/authentication/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: userData.firstName,
      lastName: userData.lastName,
      imagePath: "123456789",
      birthDate: userData.birthDate,
      email: userData.email,
      password: userData.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Backend Error Response:", data);
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

export const signinUser = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error during signin:", error);
    throw error;
  }
};

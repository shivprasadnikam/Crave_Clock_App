export const loginUser = async (userName, password) => {
  try {
    console.log("api");
    console.log('Sending:', { userName, password });

    const res = await fetch('http://192.168.1.5:8082/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, password }),
    });

    console.log('Response status:', res.status);

    if (res.ok) {
      const data = await res.json();
      console.log('Response JSON:', data);
      return { success: data.status, token: data.token, message: data.errorMessage };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, message: "Network error or server unavailable" };
  }
};

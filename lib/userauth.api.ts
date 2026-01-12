import API from "./api"

interface RegistrationData {
    firstName: string
    lastName: string
    email: string
    username: string
    password: string
};


export const loginApi = async (data: { email: string; password: string }) => {
  console.log(" it is reached till this also")
  const response = await API.post("/user/auth/login", data);
  console.log("Login API response data:", response.data)
  return response
};
  
export const registerApi = (data: RegistrationData) => {
  return API.post("/user/auth/register", data);
}
  
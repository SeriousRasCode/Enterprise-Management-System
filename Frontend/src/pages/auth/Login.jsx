import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../api/api.auth";
import { setToken } from "../../utils/token";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // 🔹 backend connectivity test (temporary)
  useEffect(() => {
    api
      .get("/")
      .then((res) => console.log("Backend OK:", res.data))
      .catch((err) => console.error("Backend ERROR:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending login request...");
      const res = await loginRequest({ email, password });
      console.log("Login response:", res.data);

      // normalize user
      const user = {
        ...res.data.user,
        role: res.data.user.roles[0],
      };

      setToken(res.data.token);
      setUser(user);

     if (user.role === "Admin") navigate("/dashboard/admin");
  else if (user.role === "Manager") navigate("/dashboard/manager");
  else navigate("/dashboard/member");
    } catch (err) {
      console.error(
        "Login failed:",
        err.response?.data || err.message
      );
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;

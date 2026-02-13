import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  console.log(user);
  return <h1>Dashboard</h1>;
}

export default Dashboard;

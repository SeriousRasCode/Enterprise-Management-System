import { motion } from "framer-motion";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Projects", icon: FolderKanban, path: "/dashboard/projects" },
    { name: "Users", icon: Users, path: "/dashboard/users", role: "Admin" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 bg-[#0f5841] text-white flex flex-col p-6 shadow-2xl"
      >
        <h1 className="text-2xl font-bold mb-8">ProjectMS</h1>

        <nav className="flex-1 space-y-3">
          {menuItems
            .filter((item) => !item.role || item.role === user?.role)
            .map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                    active
                      ? "bg-[#194f87]"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
        </nav>

        <Button
          onClick={logout}
          className="mt-auto bg-[#194f87] hover:opacity-90 rounded-2xl"
        >
          <LogOut className="mr-2" size={16} /> Logout
        </Button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#194f87]">
            Welcome, {user?.fullName}
          </h2>
        </header>

        <main className="p-8 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#0f5841]">
                Active Projects
              </h3>
              <p className="text-3xl font-bold mt-2">12</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#0f5841]">
                Tasks In Progress
              </h3>
              <p className="text-3xl font-bold mt-2">34</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#0f5841]">
                Team Members
              </h3>
              <p className="text-3xl font-bold mt-2">8</p>
            </CardContent>
          </Card>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

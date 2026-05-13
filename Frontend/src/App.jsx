import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/appRoutes";


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <h1 className="text-4xl text-red-500 font-bold">
  Tailwind Working
</h1>

    </BrowserRouter>
  );
}

export default App;

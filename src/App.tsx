import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";
import { DataroomProvider } from "./state/dataroom-provider";
import { Toaster } from "./components/ui/sonner";

const App: React.FC = () => {
  return (
    <DataroomProvider>
      <BrowserRouter>
        <AppRouter />
        <Toaster />
      </BrowserRouter>
    </DataroomProvider>
  );
};

export default App;
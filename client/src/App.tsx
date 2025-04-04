import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import AuthPage from "@/pages/auth-page";
import { WheelProvider } from "./context/wheel-context";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => <Home />}
      </Route>
      <ProtectedRoute path="/admin" component={Admin} />
      <Route path="/auth">
        {() => <AuthPage />}
      </Route>
      <Route>
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WheelProvider>
          <Router />
          <Toaster />
        </WheelProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

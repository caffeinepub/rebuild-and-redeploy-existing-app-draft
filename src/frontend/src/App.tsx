import { useInternetIdentity } from './hooks/useInternetIdentity';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MarketplacePage from './pages/MarketplacePage';
import Layout from './components/Layout';

const rootRoute = createRootRoute({
  component: Layout,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketplace',
  component: MarketplacePage,
});

const routeTree = rootRoute.addChildren([loginRoute, dashboardRoute, profileRoute, marketplaceRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;

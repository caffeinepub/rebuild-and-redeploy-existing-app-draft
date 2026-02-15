import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Home, User, ShoppingBag, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function Layout() {
  const { identity, clear } = useInternetIdentity();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!identity && location.pathname !== '/') {
      navigate({ to: '/' });
    }
  }, [identity, location.pathname, navigate]);

  const isAuthenticated = !!identity;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {isAuthenticated && (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Member Rewards
              </h1>
              <nav className="hidden md:flex items-center gap-1">
                <Button
                  variant={location.pathname === '/dashboard' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => navigate({ to: '/dashboard' })}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant={location.pathname === '/profile' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => navigate({ to: '/profile' })}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant={location.pathname === '/marketplace' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => navigate({ to: '/marketplace' })}
                  className="gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Marketplace
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={clear} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-center text-sm text-muted-foreground">
          <p>
            © 2025. Built with{' '}
            <span className="text-destructive">❤</span> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

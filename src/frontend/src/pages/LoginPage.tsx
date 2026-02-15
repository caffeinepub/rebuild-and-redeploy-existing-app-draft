import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Sparkles, Shield, Gift, ShoppingBag } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      <div className="container relative z-10 flex flex-col items-center gap-8 px-4 py-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Sparkles className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Member Rewards
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Join our exclusive community, earn points for your participation, and redeem them for amazing rewards in our marketplace.
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-3">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Secure Login</CardTitle>
              <CardDescription>
                Authenticate securely with Internet Identity - no passwords needed
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Gift className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Earn Points</CardTitle>
              <CardDescription>
                Get 100 welcome points when you join and earn more through participation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <ShoppingBag className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">Shop Rewards</CardTitle>
              <CardDescription>
                Trade your points for exclusive products in our marketplace
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>
              Login to access your member dashboard and start earning rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isLoggingIn ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Login with Internet Identity
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useMemberData, useRegisterMember } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { Coins, TrendingUp, Award, Sparkles, User, ShoppingBag } from 'lucide-react';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: member, isLoading } = useMemberData();
  const registerMutation = useRegisterMember();
  const [name, setName] = useState('');

  const handleRegister = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await registerMutation.mutateAsync(name);
      toast.success('Welcome! You received 100 points for joining!');
      setName('');
    } catch (error) {
      toast.error('Registration failed. You may already be a member.');
    }
  };

  if (isLoading) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Become a Member</CardTitle>
            <CardDescription>
              Join our community and receive 100 welcome points to get started!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              />
            </div>
            <Button
              onClick={handleRegister}
              disabled={registerMutation.isPending}
              className="w-full gap-2"
              size="lg"
            >
              {registerMutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Registering...
                </>
              ) : (
                <>
                  <Award className="h-4 w-4" />
                  Join Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src="/assets/generated/welcome-banner.dim_800x400.png"
            alt="Welcome Banner"
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 flex items-center">
            <div className="container">
              <h1 className="text-3xl font-bold sm:text-4xl">Welcome back, {member.name}!</h1>
              <p className="mt-2 text-muted-foreground">
                Track your points and explore rewards in the marketplace
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Coins className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{Number(member.points)}</div>
              <img
                src="/assets/generated/points-icon-transparent.dim_64x64.png"
                alt="Points"
                className="h-6 w-6"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Available to spend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Status</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Award className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Active</div>
            <p className="mt-1 text-xs text-muted-foreground">Member since today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
              <TrendingUp className="h-5 w-5 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Ready</div>
            <p className="mt-1 text-xs text-muted-foreground">Start earning more points</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>How to Earn Points</CardTitle>
            <CardDescription>Future opportunities to grow your balance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                1
              </div>
              <div>
                <p className="font-medium">Read Articles</p>
                <p className="text-sm text-muted-foreground">
                  Earn points by reading educational content
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                2
              </div>
              <div>
                <p className="font-medium">Attend Events</p>
                <p className="text-sm text-muted-foreground">
                  Participate in community events and activities
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                3
              </div>
              <div>
                <p className="font-medium">Complete Challenges</p>
                <p className="text-sm text-muted-foreground">
                  Take on special challenges for bonus points
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your membership</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href="/profile">
                <User className="h-4 w-4" />
                Update Profile & Avatar
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href="/marketplace">
                <ShoppingBag className="h-4 w-4" />
                Browse Marketplace
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

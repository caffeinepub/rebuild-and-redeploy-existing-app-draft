import { useMemberData, useAllProducts, usePurchaseProduct } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ShoppingBag, Coins, Sparkles } from 'lucide-react';
import type { Product } from '../backend';

export default function MarketplacePage() {
  const { data: member, isLoading: memberLoading } = useMemberData();
  const { data: products, isLoading: productsLoading } = useAllProducts();
  const purchaseMutation = usePurchaseProduct();

  const handlePurchase = async (product: Product) => {
    if (!member) {
      toast.error('Please register as a member first');
      return;
    }

    if (Number(member.points) < Number(product.cost)) {
      toast.error('Insufficient points for this purchase');
      return;
    }

    try {
      await purchaseMutation.mutateAsync(product.id);
      toast.success(`Successfully purchased ${product.name}!`);
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    }
  };

  if (memberLoading || productsLoading) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Member Access Required</CardTitle>
            <CardDescription>Please register as a member to access the marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src="/assets/generated/marketplace-hero.dim_1024x400.png"
            alt="Marketplace"
            className="h-64 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 flex items-center">
            <div className="container">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold sm:text-4xl">Marketplace</h1>
              </div>
              <p className="text-muted-foreground">
                Trade your points for exclusive rewards and products
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 w-fit">
                <Coins className="h-5 w-5 text-primary" />
                <span className="font-semibold">{Number(member.points)}</span>
                <span className="text-sm text-muted-foreground">points available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!products || products.length === 0 ? (
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>No Products Available</CardTitle>
            <CardDescription>
              Check back soon! New products will be added to the marketplace.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const canAfford = Number(member.points) >= Number(product.cost);
            
            return (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <Badge variant={canAfford ? 'default' : 'secondary'} className="shrink-0">
                      <img
                        src="/assets/generated/points-icon-transparent.dim_64x64.png"
                        alt="Points"
                        className="mr-1 h-3 w-3"
                      />
                      {Number(product.cost)}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cost</span>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold">{Number(product.cost)}</span>
                        <img
                          src="/assets/generated/points-icon-transparent.dim_64x64.png"
                          alt="Points"
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handlePurchase(product)}
                    disabled={!canAfford || purchaseMutation.isPending}
                    className="w-full gap-2"
                    variant={canAfford ? 'default' : 'secondary'}
                  >
                    {purchaseMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Processing...
                      </>
                    ) : canAfford ? (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        Purchase
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4" />
                        Insufficient Points
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

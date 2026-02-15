import { useMemberData, useUpdateAvatar } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, User, Coins } from 'lucide-react';
import { ExternalBlob } from '../backend';

export default function ProfilePage() {
  const { data: member, isLoading } = useMemberData();
  const updateAvatarMutation = useUpdateAvatar();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      
      setPreviewUrl(URL.createObjectURL(file));
      
      try {
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
        
        await updateAvatarMutation.mutateAsync(blob);
        toast.success('Avatar updated successfully!');
        setUploadProgress(0);
      } catch (error) {
        toast.error('Failed to update avatar');
        setPreviewUrl(null);
        setUploadProgress(0);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  if (isLoading) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>Please register as a member first</CardDescription>
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

  const avatarUrl = previewUrl || (member.avatar ? member.avatar.getDirectURL() : null);

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Member Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your profile information and avatar
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>Upload a profile picture</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32 border-4 border-border">
                <AvatarImage src={avatarUrl || undefined} alt={member.name} />
                <AvatarFallback className="text-3xl">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={member.name} className="h-full w-full object-cover" />
                  ) : (
                    member.name.charAt(0).toUpperCase()
                  )}
                </AvatarFallback>
              </Avatar>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={updateAvatarMutation.isPending}
                className="w-full gap-2"
                variant="outline"
              >
                <Upload className="h-4 w-4" />
                {updateAvatarMutation.isPending ? 'Uploading...' : 'Upload Avatar'}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                JPG, PNG or GIF. Max 5MB.
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your member details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm">
                  {member.name}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Member ID</Label>
                <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 font-mono text-xs">
                  {member.id.toString()}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Points Balance</Label>
                <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Coins className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{Number(member.points)}</span>
                      <img
                        src="/assets/generated/points-icon-transparent.dim_64x64.png"
                        alt="Points"
                        className="h-5 w-5"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Available points</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Member Status: Active</p>
                    <p className="text-xs text-muted-foreground">
                      You're all set! Continue earning points through participation and redeem them in the marketplace.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

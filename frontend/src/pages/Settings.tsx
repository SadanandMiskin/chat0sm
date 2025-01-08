import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { useToast } from '@/components/ui/use-toast';

export default function Settings() {
  const { user } = useAuth();
  // const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Add profile update logic here

    // toast({
    //   title: "Profile updated successfully",
    //   duration: 2000
    // });

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      <Card className="max-w-2xl bg-black/30 backdrop-blur-xl border-white/10">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Profile Settings</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                Username
              </label>
              <Input
                type="text"
                defaultValue={user?.username}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                Email
              </label>
              <Input
                type="email"
                defaultValue={user?.email}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
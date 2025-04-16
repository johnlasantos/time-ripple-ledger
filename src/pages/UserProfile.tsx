
import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Key, Shield } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { toast } = useToast();
  
  // This would be replaced with actual user data from Supabase
  const [userData] = useState({
    id: '1',
    displayName: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    photoURL: '',
  });
  
  const [formData, setFormData] = useState({
    displayName: userData.displayName,
    email: userData.email,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be replaced with actual update logic once Supabase is integrated
    console.log("Profile update submitted:", formData);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be replaced with actual password change logic once Supabase is integrated
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Password change submitted");
    
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
    });
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  return (
    <PageLayout 
      title="My Profile" 
      description="View and update your profile information"
      isAdmin={userData.role === 'admin'}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      {userData.photoURL ? (
                        <img 
                          src={userData.photoURL} 
                          alt={userData.displayName} 
                          className="h-full w-full rounded-full object-cover" 
                        />
                      ) : (
                        <User className="h-10 w-10 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{userData.displayName}</h3>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                      <div className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        userData.role === 'admin' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-secondary/10 text-secondary'
                      }`}>
                        {userData.role === 'admin' ? 'Admin' : 'User'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Display Name
                      </Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit">Update Profile</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="security">
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="flex items-center gap-2">
                        <Key className="h-4 w-4" /> Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit">Change Password</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default UserProfile;

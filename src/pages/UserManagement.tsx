
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, UserPlus, Search, Edit2, Trash2 } from "lucide-react";

// Dummy data for users - will be replaced with actual data from Supabase
const dummyUsers = [
  { id: '1', displayName: 'John Doe', email: 'john@example.com', role: 'admin', createdAt: new Date('2023-01-15') },
  { id: '2', displayName: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: new Date('2023-02-20') },
  { id: '3', displayName: 'Bob Johnson', email: 'bob@example.com', role: 'user', createdAt: new Date('2023-03-10') },
  { id: '4', displayName: 'Alice Brown', email: 'alice@example.com', role: 'user', createdAt: new Date('2023-04-05') },
  { id: '5', displayName: 'Charlie Wilson', email: 'charlie@example.com', role: 'admin', createdAt: new Date('2023-05-18') },
];

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState(dummyUsers);

  // This would be replaced with actual auth check once Supabase is integrated
  const isAdmin = true;

  // Redirect if not admin
  if (!isAdmin) {
    navigate('/dashboard');
    return null;
  }

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    console.log("Add user clicked - will implement with Supabase later");
  };

  const handleEditUser = (userId: string) => {
    console.log(`Edit user ${userId} clicked - will implement with Supabase later`);
  };

  const handleDeleteUser = (userId: string) => {
    console.log(`Delete user ${userId} clicked - will implement with Supabase later`);
  };

  return (
    <PageLayout 
      title="User Management" 
      description="Manage users and their roles"
      isAdmin={true}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:max-w-xs">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleAddUser} className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>View and manage all users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          {user.displayName}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.role === 'admin' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-secondary/10 text-secondary'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </div>
                      </TableCell>
                      <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user.id)}
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Edit</span>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                          >
                            <span className="sr-only">Delete</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default UserManagement;

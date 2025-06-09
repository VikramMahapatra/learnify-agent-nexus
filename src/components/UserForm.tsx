
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  dept?: string;
  subDept?: string;
  username?: string;
}

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onUserSaved: (user: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ open, onOpenChange, user, onUserSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    dept: '',
    subDept: '',
    email: '',
    role: 'Learner',
    username: '',
    password: '',
    status: 'Active'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        dept: user.dept || '',
        subDept: user.subDept || '',
        email: user.email,
        role: user.role,
        username: user.username || '',
        password: '',
        status: user.status
      });
    } else {
      setFormData({
        name: '',
        dept: '',
        subDept: '',
        email: '',
        role: 'Learner',
        username: '',
        password: '',
        status: 'Active'
      });
    }
  }, [user, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.username) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!user && !formData.password) {
      toast({
        title: "Error",
        description: "Password is required for new users.",
        variant: "destructive"
      });
      return;
    }

    const userData: User = {
      id: user?.id || Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      lastLogin: user?.lastLogin || new Date().toISOString().split('T')[0],
      dept: formData.dept,
      subDept: formData.subDept,
      username: formData.username
    };

    onUserSaved(userData);
    onOpenChange(false);
    
    toast({
      title: user ? "User Updated" : "User Created",
      description: `User ${formData.name} has been ${user ? 'updated' : 'created'} successfully.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {user ? 'Update the user details below.' : 'Fill in the details to create a new user.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dept">Department</Label>
              <Input
                id="dept"
                value={formData.dept}
                onChange={(e) => handleInputChange('dept', e.target.value)}
                placeholder="Enter department"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subDept">Sub Department</Label>
              <Input
                id="subDept"
                value={formData.subDept}
                onChange={(e) => handleInputChange('subDept', e.target.value)}
                placeholder="Enter sub department"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Learner">Learner</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password {!user && '*'}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={user ? "Leave blank to keep current" : "Enter password"}
                required={!user}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {user ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;

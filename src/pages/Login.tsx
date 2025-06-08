
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [adminRole, setAdminRole] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store user info in localStorage for demo purposes
    const userData = {
      email,
      userType,
      adminRole: userType === 'admin' ? adminRole : null,
      name: email.split('@')[0]
    };
    
    localStorage.setItem('skillforge_user', JSON.stringify(userData));
    
    if (userType === 'admin') {
      navigate('/admin');
    } else {
      navigate('/learner');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-indigo-600 mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SkillForge
            </h1>
          </div>
          <p className="text-gray-600">Forge your skills with AI-powered learning</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your learning dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">I am a</Label>
                <Select value={userType} onValueChange={setUserType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="learner">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Learner
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userType === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="adminRole">Admin Role</Label>
                  <Select value={adminRole} onValueChange={setAdminRole} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select admin type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="content-creator">Content Creator</SelectItem>
                      <SelectItem value="course-manager">Course Manager</SelectItem>
                      <SelectItem value="progress-tracker">Progress Tracker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                disabled={!userType || (userType === 'admin' && !adminRole)}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;


import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  originalName: string;
  description: string;
  active: boolean;
  isAdded: boolean;
  interactions?: number;
  efficiency?: number;
}

interface ConfigureAgentsDialogProps {
  trigger?: React.ReactNode;
  onAgentsUpdate?: (agents: Agent[]) => void;
}

const ConfigureAgentsDialog = ({ trigger, onAgentsUpdate }: ConfigureAgentsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Hardcoded available agents in the database
  const databaseAgents: Omit<Agent, 'isAdded'>[] = [
    {
      id: 'tutor-agent',
      name: 'Tutor Agent',
      originalName: 'Tutor Agent',
      description: 'Provides personalized answers and training guidance',
      active: true,
      interactions: 234,
      efficiency: 94
    },
    {
      id: 'content-curator',
      name: 'Content Curator',
      originalName: 'Content Curator',
      description: 'Converts internal docs to structured learning modules',
      active: true,
      interactions: 156,
      efficiency: 89
    },
    {
      id: 'assessment-agent',
      name: 'Assessment Agent',
      originalName: 'Assessment Agent',
      description: 'Creates quizzes and role-specific evaluations',
      active: true,
      interactions: 89,
      efficiency: 96
    },
    {
      id: 'roleplay-agent',
      name: 'Roleplay Agent',
      originalName: 'Roleplay Agent',
      description: 'Simulates real-world interactions through text and voice',
      active: false,
      interactions: 45,
      efficiency: 87
    },
    {
      id: 'skill-tracker',
      name: 'Skill Tracker',
      originalName: 'Skill Tracker',
      description: 'Maps completed training to skill gaps and learning paths',
      active: true,
      interactions: 178,
      efficiency: 91
    },
    {
      id: 'memory-agent',
      name: 'Memory Agent',
      originalName: 'Memory Agent',
      description: 'Stores user learning preferences and progress history',
      active: true,
      interactions: 312,
      efficiency: 93
    },
    {
      id: 'analytics-agent',
      name: 'Analytics Agent',
      originalName: 'Analytics Agent',
      description: 'Analyzes learning patterns and provides insights',
      active: false,
      interactions: 67,
      efficiency: 85
    },
    {
      id: 'notification-agent',
      name: 'Notification Agent',
      originalName: 'Notification Agent',
      description: 'Manages learning reminders and progress notifications',
      active: false,
      interactions: 123,
      efficiency: 92
    }
  ];

  const [systemAgents, setSystemAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Load agents from localStorage or initialize with default ones
    const savedAgents = localStorage.getItem('skillforge_system_agents');
    if (savedAgents) {
      setSystemAgents(JSON.parse(savedAgents));
    } else {
      // Initialize with first 6 agents as default
      const defaultAgents = databaseAgents.slice(0, 6).map(agent => ({
        ...agent,
        isAdded: true
      }));
      setSystemAgents(defaultAgents);
      localStorage.setItem('skillforge_system_agents', JSON.stringify(defaultAgents));
    }
  }, []);

  const saveAgents = (agents: Agent[]) => {
    setSystemAgents(agents);
    localStorage.setItem('skillforge_system_agents', JSON.stringify(agents));
    onAgentsUpdate?.(agents);
    toast({
      title: "Agents Updated",
      description: "Agent configuration has been saved successfully.",
    });
  };

  const addAgent = (dbAgent: Omit<Agent, 'isAdded'>) => {
    const newAgent: Agent = { ...dbAgent, isAdded: true };
    const updatedAgents = [...systemAgents, newAgent];
    saveAgents(updatedAgents);
  };

  const removeAgent = (agentId: string) => {
    const updatedAgents = systemAgents.filter(agent => agent.id !== agentId);
    saveAgents(updatedAgents);
  };

  const toggleAgentActive = (agentId: string) => {
    const updatedAgents = systemAgents.map(agent =>
      agent.id === agentId ? { ...agent, active: !agent.active } : agent
    );
    saveAgents(updatedAgents);
  };

  const startEditing = (agent: Agent) => {
    setEditingAgent(agent.id);
    setEditName(agent.name);
  };

  const saveAgentName = (agentId: string) => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Agent name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const updatedAgents = systemAgents.map(agent =>
      agent.id === agentId ? { ...agent, name: editName.trim() } : agent
    );
    saveAgents(updatedAgents);
    setEditingAgent(null);
    setEditName('');
  };

  const cancelEditing = () => {
    setEditingAgent(null);
    setEditName('');
  };

  const availableAgents = databaseAgents.filter(
    dbAgent => !systemAgents.some(sysAgent => sysAgent.id === dbAgent.id)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure Agents
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure AI Agents</DialogTitle>
          <DialogDescription>
            Manage your system agents. Add or remove agents, activate/deactivate them, and customize their names.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Agents ({systemAgents.length})</TabsTrigger>
            <TabsTrigger value="available">Available Agents ({availableAgents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {systemAgents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No agents added to the system yet. Add some from the Available Agents tab.
                </div>
              ) : (
                systemAgents.map((agent) => (
                  <Card key={agent.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${agent.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                          {editingAgent === agent.id ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-8 w-48"
                                placeholder="Agent name"
                              />
                              <Button size="sm" onClick={() => saveAgentName(agent.id)}>
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEditing}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <CardTitle className="text-lg">{agent.name}</CardTitle>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditing(agent)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          {agent.name !== agent.originalName && (
                            <Badge variant="outline" className="text-xs">
                              Renamed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`active-${agent.id}`} className="text-sm">
                              Active
                            </Label>
                            <Switch
                              id={`active-${agent.id}`}
                              checked={agent.active}
                              onCheckedChange={() => toggleAgentActive(agent.id)}
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeAgent(agent.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                      {agent.interactions !== undefined && agent.efficiency !== undefined && (
                        <div className="flex space-x-4 text-sm">
                          <span>Interactions: <strong>{agent.interactions}</strong></span>
                          <span>Efficiency: <strong>{agent.efficiency}%</strong></span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            <div className="grid gap-4">
              {availableAgents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  All available agents have been added to the system.
                </div>
              ) : (
                availableAgents.map((agent) => (
                  <Card key={agent.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <Badge variant="secondary">Available</Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addAgent(agent)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to System
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                      {agent.interactions !== undefined && agent.efficiency !== undefined && (
                        <div className="flex space-x-4 text-sm">
                          <span>Interactions: <strong>{agent.interactions}</strong></span>
                          <span>Efficiency: <strong>{agent.efficiency}%</strong></span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureAgentsDialog;

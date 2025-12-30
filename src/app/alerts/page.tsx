'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { mockMetals } from '@/data/mockMetals';
import { PriceAlert } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bell, Plus, Trash2 } from 'lucide-react';

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<string | null>(null);

  // New alert form state
  const [selectedMetal, setSelectedMetal] = useState<string>('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState<string>('');

  const handleCreateAlert = () => {
    if (!selectedMetal || !targetPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    const metal = mockMetals.find((m) => m.id === selectedMetal);
    if (!metal) return;

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      metalId: metal.id,
      metalName: metal.name,
      type: alertType,
      targetPrice: parseFloat(targetPrice),
      currentPrice: metal.price,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setAlerts([...alerts, newAlert]);
    setIsDialogOpen(false);
    setSelectedMetal('');
    setTargetPrice('');
    toast.success(`Alert created for ${metal.name} at $${targetPrice}`);
  };

  const handleDeleteClick = (alertId: string) => {
    setAlertToDelete(alertId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (alertToDelete) {
      const alert = alerts.find((a) => a.id === alertToDelete);
      setAlerts(alerts.filter((a) => a.id !== alertToDelete));
      toast.info(`Alert deleted for ${alert?.metalName}`);
      setDeleteDialogOpen(false);
      setAlertToDelete(null);
    }
  };

  const handleToggleAlert = (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId);
    const newStatus = !alert?.isActive;

    setAlerts(
      alerts.map((a) =>
        a.id === alertId ? { ...a, isActive: newStatus } : a
      )
    );

    if (newStatus) {
      toast.success(`Alert resumed for ${alert?.metalName}`);
    } else {
      toast.info(`Alert paused for ${alert?.metalName}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Markets
            </Button>
            <h1 className="text-xl font-bold">Price Alerts</h1>
            <div className="w-[100px]"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold tracking-tight">Price Alerts</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Alert
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Price Alert</DialogTitle>
                  <DialogDescription>
                    Get notified when a metal reaches your target price
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Metal</label>
                    <Select value={selectedMetal} onValueChange={setSelectedMetal}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a metal" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockMetals.map((metal) => (
                          <SelectItem key={metal.id} value={metal.id}>
                            {metal.name} ({metal.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Alert Type</label>
                    <Select value={alertType} onValueChange={(v) => setAlertType(v as 'above' | 'below')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Price goes above</SelectItem>
                        <SelectItem value="below">Price goes below</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Price</label>
                    <Input
                      type="number"
                      placeholder="Enter target price"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      step="0.01"
                    />
                  </div>

                  <Button onClick={handleCreateAlert} className="w-full">
                    Create Alert
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground">
            Set price alerts to track metals and get notified when they reach your target
          </p>
        </div>

        {/* Alerts List */}
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const metal = mockMetals.find((m) => m.id === alert.metalId);
              const isTriggered = alert.type === 'above'
                ? alert.currentPrice >= alert.targetPrice
                : alert.currentPrice <= alert.targetPrice;

              return (
                <Card key={alert.id} className={!alert.isActive ? 'opacity-50' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded-lg ${alert.isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                          <Bell className={`h-5 w-5 ${alert.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{alert.metalName}</h3>
                            {isTriggered && alert.isActive && (
                              <Badge variant="default" className="bg-green-500">Triggered</Badge>
                            )}
                            {!alert.isActive && (
                              <Badge variant="secondary">Paused</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-1">
                            Alert when price goes {alert.type}{' '}
                            <span className="font-semibold text-foreground">
                              ${alert.targetPrice.toFixed(2)}
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Current price: ${metal?.price.toFixed(2) || alert.currentPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleAlert(alert.id)}
                        >
                          {alert.isActive ? 'Pause' : 'Resume'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(alert.id)}
                          className="text-destructive hover:text-destructive"
                          aria-label={`Delete alert for ${alert.metalName}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No alerts yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Create your first price alert to get notified when metals reach your target price
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Alert
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Alert?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this price alert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

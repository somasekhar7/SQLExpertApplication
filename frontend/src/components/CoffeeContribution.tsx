import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Heart, Star, Gift } from 'lucide-react';
import { toast } from 'sonner';

const contributionTiers = [
  {
    id: 'coffee',
    name: 'Buy me a coffee',
    amount: 5,
    icon: <Coffee className="h-5 w-5" />,
    description: 'Support with a small coffee',
    color: 'bg-amber-500'
  },
  {
    id: 'meal',
    name: 'Buy me lunch',
    amount: 15,
    icon: <Heart className="h-5 w-5" />,
    description: 'Help fuel my development',
    color: 'bg-rose-500'
  },
  {
    id: 'premium',
    name: 'Premium Support',
    amount: 50,
    icon: <Star className="h-5 w-5" />,
    description: 'Become a premium supporter',
    color: 'bg-violet-500'
  },
  {
    id: 'generous',
    name: 'Generous Contributor',
    amount: 100,
    icon: <Gift className="h-5 w-5" />,
    description: 'Your generosity means the world',
    color: 'bg-emerald-500'
  }
];

export const CoffeeContribution = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleContribute = (amount: number, method: 'stripe' | 'paypal') => {
    // In a real app, this would integrate with actual payment processors
    toast.success(`Thank you! Processing $${amount} payment via ${method.charAt(0).toUpperCase() + method.slice(1)}...`);
    
    // Simulate payment processing
    setTimeout(() => {
      toast.success('Payment successful! Thank you for your support! ☕');
    }, 2000);
  };

  const getAmountToProcess = () => {
    if (selectedTier) {
      const tier = contributionTiers.find(t => t.id === selectedTier);
      return tier?.amount || 0;
    }
    return 0;
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="h-8 w-8 text-amber-500" />
            <h2 className="text-3xl font-bold">Support My Work</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            If you find this SQL learning platform helpful, consider buying me a coffee! 
            Your support helps me maintain and improve the platform for everyone.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {contributionTiers.map((tier) => (
              <Card 
                key={tier.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedTier === tier.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <CardHeader className="text-center pb-3">
                  <div className={`w-12 h-12 ${tier.color} rounded-full flex items-center justify-center text-white mx-auto mb-2`}>
                    {tier.icon}
                  </div>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    ${tier.amount}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTier && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  ${getAmountToProcess()}
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => handleContribute(getAmountToProcess(), 'stripe')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={getAmountToProcess() <= 0}
                >
                  Pay with Stripe
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleContribute(getAmountToProcess(), 'paypal')}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  disabled={getAmountToProcess() <= 0}
                >
                  Pay with PayPal
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Secure payment processing • No account required
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Helmet>
        <title>Privacy Policy | The Homies Hub</title>
        <meta name="description" content="Privacy Policy for The Homies Hub platform." />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-primary">Privacy Policy</h1>
      
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle>Your Privacy Matters</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Last Updated: December 12, 2025</p>

          <section>
            <h3 className="text-foreground font-semibold text-lg">1. Data Collection</h3>
            <p>We collect information you provide directly (email, username, profile data) and usage data automatically (device info, log data). If you use wallet features, we collect public blockchain addresses.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">2. How We Use Data</h3>
            <p>We use your data to provide services, personalize content, process transactions, and improve platform security. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">3. Cookies & Analytics</h3>
            <p>We use cookies to maintain your session and analyze platform usage. You can control cookie settings through your browser.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">4. Location Data</h3>
            <p>Location data is collected only when you explicitly use location-based features (e.g., minting a Moment at a specific place). You can revoke location permissions at any time.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">5. Wallet & Transactions</h3>
            <p>Blockchain transactions are public. We do not control and are not responsible for data stored on public blockchains.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">6. User Rights</h3>
            <p>You have the right to access, correct, or delete your personal data. You can manage most data directly in Account Settings or contact support for assistance.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">7. Data Security</h3>
            <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
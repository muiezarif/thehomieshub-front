import React from 'react';
import { Helmet } from 'react-helmet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Helmet>
        <title>Terms of Service | The Homies Hub</title>
        <meta name="description" content="Terms of Service for The Homies Hub platform." />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-primary">Terms of Service</h1>
      
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle>Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>Last Updated: December 12, 2025</p>
          
          <section>
            <h3 className="text-foreground font-semibold text-lg">1. Eligibility</h3>
            <p>You must be at least 18 years of age to use The Homies Hub. By creating an account, you warrant that you are 18 years or older and have the legal capacity to enter into this agreement.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">2. Account Responsibilities</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You are responsible for all activities that occur under your account.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">3. Content Ownership & Licensing</h3>
            <p>You retain ownership of the content you upload. By posting content, you grant The Homies Hub a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on the platform.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">4. Prohibited Content & Behavior</h3>
            <p>Users may not upload content that is illegal, promotes hate speech, or violates intellectual property rights. Harassment, bullying, and impersonation are strictly prohibited.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">5. NSFW Content Rules</h3>
            <p>NSFW content is permitted only in designated areas and must be correctly tagged. The following are strictly prohibited:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Child sexual abuse material (CSAM)</li>
              <li>Non-consensual sexual content (revenge porn)</li>
              <li>Content depicting sexual violence or exploitation</li>
            </ul>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">6. Enforcement & Termination</h3>
            <p>We reserve the right to remove content and suspend or terminate accounts that violate these terms without prior notice. Serious violations will be reported to law enforcement.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">7. Limitation of Liability</h3>
            <p>The Homies Hub is provided "as is". We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
          </section>

          <section>
            <h3 className="text-foreground font-semibold text-lg">8. Contact</h3>
            <p>For legal inquiries, please contact legal@homieshub.com.</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;
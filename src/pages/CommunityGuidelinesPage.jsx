import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, AlertTriangle, Ban } from 'lucide-react';

const CommunityGuidelinesPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Helmet>
        <title>Community Guidelines | The Homies Hub</title>
        <meta name="description" content="Community Guidelines for The Homies Hub platform." />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-primary">Community Guidelines</h1>
      
      <div className="grid gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Heart className="text-green-500" /> The Homies Code
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>We are a brotherhood. Treat every member with respect. Disagreements are natural, but disrespect is not tolerated.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Be Constructive:</strong> Critique ideas, not people.</li>
                <li><strong>Support Each Other:</strong> Help fellow homies grow.</li>
                <li><strong>Respect Privacy:</strong> Do not doxx or share private info.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" /> NSFW Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>Adult content is allowed but must be strictly regulated to ensure safety and consent.</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Tag It:</strong> All NSFW content MUST be tagged during upload.</li>
                <li><strong>Consensual Only:</strong> All parties must be consenting adults.</li>
                <li><strong>No Violence:</strong> Sexual violence is strictly prohibited.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Ban className="text-red-500" /> Zero Tolerance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>The following will result in immediate ban and potential legal action:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Child Sexual Abuse Material (CSAM)</li>
                <li>Revenge Porn / Non-consensual intimate imagery</li>
                <li>Terrorism or violent extremism</li>
                <li>Human trafficking or exploitation</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Shield className="text-blue-500" /> Reporting & Enforcement
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>If you see something, say something. Use the "Report" button on posts or profiles.</p>
            <p>Our moderation team reviews reports 24/7. We may remove content, issue warnings, or suspend accounts depending on the severity of the violation.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityGuidelinesPage;
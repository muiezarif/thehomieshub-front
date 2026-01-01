import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Search, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const mockVideos = [
    { id: 'vid001', title: 'Exploring the Swiss Alps', uploader: 'dronedave', views: '1.2M', status: 'Published', featured: true },
    { id: 'vid002', title: 'Tokyo Nightlife Guide', uploader: 'marcopolo', views: '870K', status: 'Published', featured: false },
    { id: 'vid003', title: 'Unboxing New Travel Gear', uploader: 'techytraveler', views: '50K', status: 'Under Review', featured: false },
    { id: 'vid004', title: 'Street Food in Bangkok', uploader: 'foodiefind', views: '2.5M', status: 'Published', featured: false },
];

const AdminVideos = () => {
    const { toast } = useToast();

    const handleAction = (action, videoTitle) => {
        toast({
            title: `Action: ${action}`,
            description: `Performed "${action}" on video "${videoTitle}". (This is a demo and not implemented yet).`,
        });
    };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Videos</h1>
        <p className="text-muted-foreground mt-1">Upload, edit, and moderate video content.</p>
      </header>

      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search videos or uploaders..." className="pl-10" />
                </div>
                <Button onClick={() => handleAction('Upload Video', '')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Upload Video
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Uploader</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockVideos.map((video) => (
                    <TableRow key={video.id}>
                        <TableCell className="font-medium text-foreground">
                            <div className="flex items-center gap-2">
                                {video.title}
                                {video.featured && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                            </div>
                        </TableCell>
                        <TableCell>@{video.uploader}</TableCell>
                        <TableCell>{video.views}</TableCell>
                        <TableCell>
                            <Badge variant={video.status === 'Published' ? 'default' : 'secondary'}>{video.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleAction('Edit', video.title)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAction(video.featured ? 'Unfeature' : 'Feature', video.title)}>
                                  {video.featured ? 'Unfeature' : 'Feature'}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleAction('Delete', video.title)}>
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVideos;
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { WheelSegment, Ticket } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface CreateTicketProps {
  segments: WheelSegment[];
  tickets: Ticket[];
}

const CreateTicket: React.FC<CreateTicketProps> = ({ segments, tickets }) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('');
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [expirationDate, setExpirationDate] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Recent tickets - show last 10
  const recentTickets = tickets.slice(0, 10);
  
  const generateTicketsMutation = useMutation({
    mutationFn: async () => {
      const segmentId = parseInt(selectedSegmentId);
      
      const response = await apiRequest('POST', '/api/tickets/batch', {
        segmentId,
        count: ticketCount,
        expiresAt: expirationDate || undefined
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      toast({
        title: "Success!",
        description: `Generated ${data.length} ticket${data.length > 1 ? 's' : ''}`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate tickets. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleGenerateTickets = () => {
    if (!selectedSegmentId) {
      toast({
        title: "Error",
        description: "Please select a prize for the ticket.",
        variant: "destructive",
      });
      return;
    }
    
    generateTicketsMutation.mutate();
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create Tickets</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Prize</label>
          <Select 
            value={selectedSegmentId} 
            onValueChange={setSelectedSegmentId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Select Prize --" />
            </SelectTrigger>
            <SelectContent>
              {segments.map((segment) => (
                <SelectItem key={segment.id} value={segment.id.toString()}>
                  {segment.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Tickets</label>
          <Input
            type="number"
            value={ticketCount}
            onChange={(e) => setTicketCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            min="1"
            max="100"
            className="w-full"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
          <Input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full"
          />
        </div>
        
        <Button 
          onClick={handleGenerateTickets} 
          disabled={generateTicketsMutation.isPending || !selectedSegmentId}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Generate Tickets
        </Button>
        
        {/* Recently Generated Tickets */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Recently Generated Tickets</h3>
          <div className="border rounded overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket Code</TableHead>
                  <TableHead>Prize</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTickets.map((ticket) => {
                  const segment = segments.find(s => s.id === ticket.segmentId);
                  return (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.code}</TableCell>
                      <TableCell>{segment?.text || 'Unknown'}</TableCell>
                      <TableCell>{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {ticket.used ? (
                          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                            Used
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Active
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {recentTickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      No tickets generated yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;

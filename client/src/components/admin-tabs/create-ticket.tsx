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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface CreateTicketProps {
  segments: WheelSegment[];
  tickets: Ticket[];
}

const CreateTicket: React.FC<CreateTicketProps> = ({ segments, tickets }) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('');
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Recent tickets - show last 10
  const recentTickets = tickets.slice(0, 10);
  
  // Update expirationDate when calendar date changes
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setExpirationDate(newDate.toISOString().split('T')[0]);
    } else {
      setExpirationDate('');
    }
  };
  
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
        title: "Başarılı!",
        description: `${data.length} adet bilet oluşturuldu`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Biletler oluşturulamadı. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
  });
  
  const handleGenerateTickets = () => {
    if (!selectedSegmentId) {
      toast({
        title: "Hata",
        description: "Lütfen bilet için bir ödül seçin.",
        variant: "destructive",
      });
      return;
    }
    
    generateTicketsMutation.mutate();
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bilet Oluştur</h2>
      <div className="bg-white rounded-lg shadow p-6 text-gray-800">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ödül Seçin</label>
          <Select 
            value={selectedSegmentId} 
            onValueChange={setSelectedSegmentId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Ödül Seçin --" />
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Bilet Sayısı</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma Tarihi (İsteğe Bağlı)</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span className="text-muted-foreground">Tarih Seçin</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button 
          onClick={handleGenerateTickets} 
          disabled={generateTicketsMutation.isPending || !selectedSegmentId}
          className="bg-[#800000] hover:bg-[#600000]"
        >
          Bilet Oluştur
        </Button>
        
        {/* Recently Generated Tickets */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Son Oluşturulan Biletler</h3>
          <div className="border rounded overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="text-gray-800">Bilet Kodu</TableHead>
                  <TableHead className="text-gray-800">Ödül</TableHead>
                  <TableHead className="text-gray-800">Oluşturulma</TableHead>
                  <TableHead className="text-gray-800">Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTickets.map((ticket) => {
                  const segment = segments.find(s => s.id === ticket.segmentId);
                  return (
                    <TableRow key={ticket.id} className="border-b">
                      <TableCell className="font-medium text-gray-900">{ticket.code}</TableCell>
                      <TableCell className="text-gray-800">{segment?.text || 'Bilinmeyen'}</TableCell>
                      <TableCell className="text-gray-800">{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {ticket.used ? (
                          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                            Kullanıldı
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Aktif
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {recentTickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      Henüz bilet oluşturulmadı
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

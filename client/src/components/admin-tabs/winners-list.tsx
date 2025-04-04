import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WheelSegment } from '@shared/schema';

interface WinnersListProps {
  segments: WheelSegment[];
}

interface Winner {
  id: number;
  code: string;
  segmentId: number;
  used: boolean;
  usedAt: string;
  ipAddress: string;
  prize: string;
}

const WinnersList: React.FC<WinnersListProps> = ({ segments }) => {
  const [search, setSearch] = useState('');
  const [prizeFilter, setPrizeFilter] = useState('all');
  
  // Fetch winners list
  const { data: winners = [], isLoading } = useQuery<Winner[]>({
    queryKey: ['/api/tickets/winners'],
  });
  
  // Apply filters
  const filteredWinners = winners.filter((winner) => {
    const matchesSearch = search === '' || 
      winner.code.toLowerCase().includes(search.toLowerCase()) ||
      winner.prize.toLowerCase().includes(search.toLowerCase());
    
    const matchesPrize = prizeFilter === 'all' || 
      winner.segmentId.toString() === prizeFilter;
    
    return matchesSearch && matchesPrize;
  });
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Kazananlar Listesi</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden text-gray-800">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Kazananları ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            <Button className="bg-[#800000] hover:bg-[#600000] px-3 shrink-0">
              <i className="fas fa-search"></i>
            </Button>
          </div>
          <div className="w-full sm:w-auto">
            <Select value={prizeFilter} onValueChange={setPrizeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Ödüle göre filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Ödüller</SelectItem>
                {segments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id.toString()}>
                    {segment.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-800">Tarih</TableHead>
                <TableHead className="text-gray-800">Bilet Kodu</TableHead>
                <TableHead className="text-gray-800">Ödül</TableHead>
                <TableHead className="text-gray-800">IP Adresi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="bg-white">
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#800000]"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredWinners.length > 0 ? (
                filteredWinners.map((winner) => (
                  <TableRow key={winner.id} className="bg-white">
                    <TableCell className="text-gray-800">
                      {winner.usedAt ? format(new Date(winner.usedAt), 'MMM d, yyyy HH:mm') : 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{winner.code}</TableCell>
                    <TableCell className="text-gray-800">{winner.prize}</TableCell>
                    <TableCell className="text-gray-500">{winner.ipAddress || 'Bilinmiyor'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="bg-white">
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {search || prizeFilter !== 'all' 
                      ? 'Filtrelere uygun kazanan bulunamadı' 
                      : 'Henüz kazanan yok'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredWinners.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{filteredWinners.length}</span> sonuç gösteriliyor
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnersList;

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { WheelSegment } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { getSegmentColor } from '@/lib/wheel';
import Wheel from '@/components/ui/wheel';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WheelDesignProps {
  segments: WheelSegment[];
}

const WheelDesign: React.FC<WheelDesignProps> = ({ segments }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<WheelSegment | null>(null);
  const [editText, setEditText] = useState('');
  const [editColor, setEditColor] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const colors = ['#F59E0B', '#10B981', '#4F46E5', '#F43F5E', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
  
  // Add new segment
  const addSegmentMutation = useMutation({
    mutationFn: async () => {
      const nextPosition = segments.length;
      const newColor = getSegmentColor(nextPosition);
      
      const response = await apiRequest('POST', '/api/wheel/segments', {
        text: `Prize ${nextPosition + 1}`,
        color: newColor,
        position: nextPosition
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wheel/segments'] });
      toast({
        title: 'Success',
        description: 'New segment added to wheel',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add segment',
        variant: 'destructive',
      });
    }
  });
  
  // Update segment
  const updateSegmentMutation = useMutation({
    mutationFn: async (segment: {id: number, text: string, color: string}) => {
      const response = await apiRequest('PUT', `/api/wheel/segments/${segment.id}`, {
        text: segment.text,
        color: segment.color
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wheel/segments'] });
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Segment updated successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update segment',
        variant: 'destructive',
      });
    }
  });
  
  // Delete segment
  const deleteSegmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/wheel/segments/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wheel/segments'] });
      toast({
        title: 'Success',
        description: 'Segment removed from wheel',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete segment',
        variant: 'destructive',
      });
    }
  });
  
  const handleEditSegment = (segment: WheelSegment) => {
    setCurrentSegment(segment);
    setEditText(segment.text);
    setEditColor(segment.color);
    setIsEditing(true);
  };
  
  const handleSaveSegment = () => {
    if (!currentSegment) return;
    
    updateSegmentMutation.mutate({
      id: currentSegment.id,
      text: editText,
      color: editColor
    });
  };
  
  const handleDeleteSegment = (id: number) => {
    if (segments.length <= 2) {
      toast({
        title: 'Cannot Delete',
        description: 'The wheel must have at least 2 segments',
        variant: 'destructive',
      });
      return;
    }
    
    deleteSegmentMutation.mutate(id);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Wheel Design</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Preview Section */}
          <div className="flex-1 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Wheel Preview</h3>
            <Wheel segments={segments} size="lg" />
          </div>
          
          {/* Editor Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Segment Editor</h3>
            <div className="mb-4">
              <Button 
                onClick={() => addSegmentMutation.mutate()}
                disabled={addSegmentMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <i className="fas fa-plus mr-2"></i> Add Segment
              </Button>
            </div>
            
            {/* Segments List */}
            <div className="space-y-3 mt-6 max-h-96 overflow-y-auto">
              {segments.map((segment) => (
                <div 
                  key={segment.id}
                  className="bg-gray-50 p-3 rounded border flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: segment.color }}
                    ></div>
                    <span>{segment.text}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="text-gray-600 hover:text-indigo-600"
                      onClick={() => handleEditSegment(segment)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="text-gray-600 hover:text-red-500"
                      onClick={() => handleDeleteSegment(segment.id)}
                      disabled={deleteSegmentMutation.isPending}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Segment Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Segment</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Prize Text</label>
              <Input 
                type="text" 
                value={editText} 
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Enter prize name"
                className="w-full"
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Segment Color</label>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setEditColor(color)}
                    className={`w-8 h-8 rounded-full ${editColor === color ? 'ring-2 ring-offset-2' : ''}`}
                    style={{ backgroundColor: color, ringColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSegment}
              disabled={updateSegmentMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WheelDesign;

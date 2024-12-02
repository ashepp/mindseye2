import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const TodoistVisualizer = () => {
  const [apiKey, setApiKey] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState({});
  const [error, setError] = useState(null);
  const [imageGenerating, setImageGenerating] = useState(false);

  const fetchTodoistData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Validate API key
      if (!apiKey.trim()) {
        throw new Error('Please enter your Todoist API key');
      }

      // Fetch favorites
      const favResponse = await fetch('https://api.todoist.com/rest/v2/favorites', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (!favResponse.ok) {
        if (favResponse.status === 401) {
          throw new Error('Invalid API key. Please check and try again.');
        }
        throw new Error('Failed to fetch favorites. Please try again.');
      }
      
      const favData = await favResponse.json();
      
      // Fetch filters
      const filterResponse = await fetch('https://api.todoist.com/rest/v2/filters', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!filterResponse.ok) {
        throw new Error('Failed to fetch filters. Please try again.');
      }
      
      const filterData = await filterResponse.json();
      
      setFavorites(favData);
      setFilters(filterData);
    } catch (error) {
      setError(error.message);
      setFavorites([]);
      setFilters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  const generateImages = async () => {
    setImageGenerating(true);
    setError(null);
    try {
      if (selectedItems.length === 0) {
        throw new Error('Please select at least one item to visualize');
      }
      
      // Placeholder for image generation
      const newImages = {};
      for (const id of selectedItems) {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        newImages[id] = '/api/placeholder/300/200';
      }
      setImages(newImages);
    } catch (error) {
      setError(error.message);
    } finally {
      setImageGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Todoist Task Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Input
                type="password"
                placeholder="Enter your Todoist API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button 
                onClick={fetchTodoistData}
                disabled={loading}
                className="relative"
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading ? 'Loading...' : 'Fetch Data'}
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Favorites</h3>
              {favorites.length === 0 && !loading && (
                <p className="text-gray-500">No favorites found. Connect your Todoist account to see your favorites.</p>
              )}
              <div className="space-y-2">
                {favorites.map(favorite => (
                  <div key={favorite.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`fav-${favorite.id}`}
                      checked={selectedItems.includes(favorite.id)}
                      onCheckedChange={() => handleItemToggle(favorite.id)}
                    />
                    <label htmlFor={`fav-${favorite.id}`}>{favorite.name}</label>
                    {images[favorite.id] && (
                      <img 
                        src={images[favorite.id]} 
                        alt={favorite.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold mt-6">Filters</h3>
              {filters.length === 0 && !loading && (
                <p className="text-gray-500">No filters found. Create filters in Todoist to see them here.</p>
              )}
              <div className="space-y-2">
                {filters.map(filter => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${filter.id}`}
                      checked={selectedItems.includes(filter.id)}
                      onCheckedChange={() => handleItemToggle(filter.id)}
                    />
                    <label htmlFor={`filter-${filter.id}`}>{filter.name}</label>
                    {images[filter.id] && (
                      <img 
                        src={images[filter.id]} 
                        alt={filter.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={generateImages}
              disabled={selectedItems.length === 0 || imageGenerating}
              className="mt-4"
            >
              {imageGenerating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {imageGenerating ? 'Generating Images...' : 'Generate Images'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoistVisualizer;
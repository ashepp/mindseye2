import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ErrorAlert from './components/ErrorAlert';

const TodoistVisualizer = () => {
  const [apiKey, setApiKey] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState({});
  const [error, setError] = useState(null);

  const handleError = (message) => {
    setError(message);
    setLoading(false);
  };

  const fetchTodoistData = async () => {
    setLoading(true);
    setError(null);
    
    if (!apiKey) {
      handleError('Please enter your Todoist API key');
      return;
    }

    try {
      const favResponse = await fetch('https://api.todoist.com/rest/v2/favorites', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (!favResponse.ok) {
        throw new Error(favResponse.status === 401 
          ? 'Invalid API key. Please check your credentials.'
          : 'Failed to fetch favorites. Please try again.');
      }
      
      const favData = await favResponse.json();
      
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
      setLoading(false);
    } catch (error) {
      handleError(error.message || 'An unexpected error occurred. Please try again.');
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
    if (selectedItems.length === 0) {
      handleError('Please select at least one item to generate images.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Simulating image generation with placeholder
      const newImages = {};
      selectedItems.forEach(id => {
        newImages[id] = '/api/placeholder/300/200';
      });
      setImages(newImages);
    } catch (error) {
      handleError('Failed to generate images. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Todoist Task Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
          
          <div className="space-y-6">
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
                disabled={!apiKey || loading}
                className="min-w-[100px]"
              >
                {loading ? 'Loading...' : 'Fetch Data'}
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Favorites</h3>
              <div className="space-y-2">
                {favorites.map(favorite => (
                  <div key={favorite.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`fav-${favorite.id}`}
                      checked={selectedItems.includes(favorite.id)}
                      onCheckedChange={() => handleItemToggle(favorite.id)}
                      disabled={loading}
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
              <div className="space-y-2">
                {filters.map(filter => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${filter.id}`}
                      checked={selectedItems.includes(filter.id)}
                      onCheckedChange={() => handleItemToggle(filter.id)}
                      disabled={loading}
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
              disabled={selectedItems.length === 0 || loading}
              className="mt-4"
            >
              {loading ? 'Generating...' : 'Generate Images'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoistVisualizer;
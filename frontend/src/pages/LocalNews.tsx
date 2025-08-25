import React, { useState, useEffect } from 'react';
import { MapPin, Globe, AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { NewsArticle, LocationData } from '../types';
import { motion } from 'framer-motion';

export const LocalNews: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Mock news data with credibility scores
  const mockNews: NewsArticle[] = [
    {
      id: '1',
      title: 'Local City Council Approves New Infrastructure Budget',
      description: 'The city council unanimously voted to approve a $2.5 million infrastructure improvement plan focusing on road repairs and public transportation.',
      url: 'https://example.com/news/1',
      source: 'Local Tribune',
      publishedAt: new Date('2025-01-15T10:30:00Z'),
      credibilityScore: 92,
      credibilityReason: 'Verified by multiple sources, official government statement, transparent reporting',
      imageUrl: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Breaking: Miracle Cure Discovered by Local Doctor - Doctors Hate This One Trick!',
      description: 'A revolutionary health breakthrough that pharmaceutical companies don\'t want you to know about has been discovered right in your neighborhood.',
      url: 'https://example.com/news/2',
      source: 'HealthBuzz Daily',
      publishedAt: new Date('2025-01-15T08:15:00Z'),
      credibilityScore: 15,
      credibilityReason: 'Clickbait headline, unverified claims, no scientific backing, typical spam indicators',
      imageUrl: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'New Community Center Opens Downtown',
      description: 'The long-awaited community center featuring a library, fitness facilities, and meeting spaces officially opened its doors to residents.',
      url: 'https://example.com/news/3',
      source: 'City News Network',
      publishedAt: new Date('2025-01-14T16:45:00Z'),
      credibilityScore: 88,
      credibilityReason: 'Factual reporting, verifiable information, established news source',
      imageUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      title: 'URGENT: Government Plans to Take Away Your Rights - Share Before It\'s Too Late!',
      description: 'Shocking revelations about secret government plans that mainstream media won\'t report. Click to learn the truth they don\'t want you to know!',
      url: 'https://example.com/news/4',
      source: 'Truth Seekers Blog',
      publishedAt: new Date('2025-01-14T12:20:00Z'),
      credibilityScore: 8,
      credibilityReason: 'Fear-mongering language, unsubstantiated claims, conspiracy theory indicators, unreliable source',
      imageUrl: 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '5',
      title: 'Local School District Receives Technology Grant',
      description: 'Three schools in the district will receive new computers and educational software thanks to a $500,000 state technology grant.',
      url: 'https://example.com/news/5',
      source: 'Education Weekly',
      publishedAt: new Date('2025-01-13T14:10:00Z'),
      credibilityScore: 85,
      credibilityReason: 'Official source verification, transparent funding information, educational focus',
      imageUrl: 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const requestLocation = async () => {
    setIsLoadingLocation(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Mock reverse geocoding
        const locationData: LocationData = {
          latitude,
          longitude,
          city: 'Your City',
          country: 'Your Country'
        };
        
        setLocation(locationData);
        setLocationPermission('granted');
        setIsLoadingLocation(false);
        
        // Fetch news for this location
        await fetchLocalNews(locationData);
      },
      (error) => {
        setLocationPermission('denied');
        setError('Location access denied. Showing general news instead.');
        setIsLoadingLocation(false);
        
        // Show mock news without location
        setNews(mockNews);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const fetchLocalNews = async (locationData: LocationData) => {
    setIsLoadingNews(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would call:
      // const response = await fetch(`/api/local-news?lat=${locationData.latitude}&lng=${locationData.longitude}`);
      // const newsData = await response.json();
      
      setNews(mockNews);
    } catch (error) {
      setError('Failed to fetch local news');
    } finally {
      setIsLoadingNews(false);
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCredibilityBadge = (score: number) => {
    if (score >= 80) return { variant: 'success', label: 'Reliable' };
    if (score >= 60) return { variant: 'warning', label: 'Questionable' };
    if (score >= 40) return { variant: 'warning', label: 'Suspicious' };
    return { variant: 'danger', label: 'Unreliable' };
  };

  const getCredibilityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 40) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  useEffect(() => {
    // Auto-request location on component mount
    if (locationPermission === 'prompt') {
      requestLocation();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
            <Globe className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Local News Credibility Check
          </h1>
          <p className="text-lg text-gray-600">
            Stay informed with location-based news verified for accuracy and credibility
          </p>
        </motion.div>

        {/* Location Status */}
        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {location ? `News for ${location.city}, ${location.country}` : 'Location Required'}
                </h3>
                <p className="text-sm text-gray-600">
                  {location 
                    ? 'Showing personalized local news with credibility analysis'
                    : 'Enable location access to get relevant local news'
                  }
                </p>
              </div>
            </div>
            <Button
              onClick={requestLocation}
              loading={isLoadingLocation}
              disabled={isLoadingLocation}
              variant={location ? 'secondary' : 'primary'}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {location ? 'Refresh' : 'Enable Location'}
            </Button>
          </div>
        </Card>

        {error && (
          <Card className="mb-8 bg-yellow-50 border-yellow-200">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-900">Notice</h3>
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Credibility Guide */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Understanding Credibility Scores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-900">80-100%</div>
                <div className="text-sm text-green-700">Reliable</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="font-medium text-yellow-900">60-79%</div>
                <div className="text-sm text-yellow-700">Questionable</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="font-medium text-orange-900">40-59%</div>
                <div className="text-sm text-orange-700">Suspicious</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="font-medium text-red-900">0-39%</div>
                <div className="text-sm text-red-700">Unreliable</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoadingNews && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing local news for credibility...</p>
          </div>
        )}

        {/* News Articles */}
        {!isLoadingNews && news.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Latest Local News ({news.length} articles)
            </h2>
            
            {news.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {article.imageUrl && (
                      <div className="lg:w-1/3">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-48 lg:h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`${article.imageUrl ? 'lg:w-2/3' : 'w-full'} p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="info" size="sm">{article.source}</Badge>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(article.publishedAt)}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {article.description}
                          </p>
                        </div>
                      </div>

                      {/* Credibility Score */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getCredibilityIcon(article.credibilityScore)}
                            <span className="font-medium text-gray-900">Credibility Analysis</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={getCredibilityBadge(article.credibilityScore).variant as any}
                              size="sm"
                            >
                              {getCredibilityBadge(article.credibilityScore).label}
                            </Badge>
                            <span className={`font-bold text-lg ${getCredibilityColor(article.credibilityScore)}`}>
                              {article.credibilityScore}%
                            </span>
                          </div>
                        </div>
                        
                        {/* Credibility Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              article.credibilityScore >= 80 ? 'bg-green-500' :
                              article.credibilityScore >= 60 ? 'bg-yellow-500' :
                              article.credibilityScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${article.credibilityScore}%` }}
                          ></div>
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          <strong>Analysis:</strong> {article.credibilityReason}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Read Full Article
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                        
                        {article.credibilityScore < 60 && (
                          <Badge variant="warning" size="sm">
                            ⚠️ Verify Before Sharing
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Educational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💡 Tips for Evaluating News Credibility
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Red Flags to Watch For:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Sensational or clickbait headlines</li>
                  <li>• Emotional language designed to provoke</li>
                  <li>• Lack of author or source information</li>
                  <li>• No supporting evidence or citations</li>
                  <li>• Requests to "share before it's too late"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Signs of Reliable News:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Clear author and publication information</li>
                  <li>• Multiple credible sources cited</li>
                  <li>• Balanced reporting with context</li>
                  <li>• Recent publication date</li>
                  <li>• Professional writing and formatting</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
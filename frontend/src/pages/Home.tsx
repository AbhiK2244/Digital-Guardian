import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Scan, UserCheck, Brain, TrendingUp, Globe, Users, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const features = [
    {
      icon: <Scan className="h-8 w-8" />,
      title: 'Real-Time Detection',
      description: 'Instantly detect phishing URLs, spam emails, and malicious content',
      link: '/detect'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Local News Verification',
      description: 'Get location-based news with AI-powered credibility scoring',
      link: '/local-news'
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: 'Breach Checker',
      description: 'Check if your credentials have been compromised in data breaches',
      link: '/breach-check'
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with gamified learning experiences',
      link: '/quiz'
    }
  ];

  const stats = [
    { label: 'Users Protected', value: '50K+', icon: <Users className="h-6 w-6" /> },
    { label: 'Scams Detected', value: '1M+', icon: <Shield className="h-6 w-6" /> },
    { label: 'Countries Served', value: '25+', icon: <Globe className="h-6 w-6" /> },
    { label: 'Certificates Earned', value: '15K+', icon: <Award className="h-6 w-6" /> }
  ];

  const categories = [
    { name: 'Email Scams', count: 25, color: 'bg-blue-500' },
    { name: 'Fake News', count: 22, color: 'bg-indigo-500' },
    { name: 'Social Media', count: 18, color: 'bg-green-500' },
    { name: 'Identity Theft', count: 15, color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Protect Your Digital Life
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Learn, detect, and defend against online threats with our comprehensive digital safety platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quiz">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Learning Now
                </Button>
              </Link>
              <Link to="/detect">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  Try Detection Tool
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Digital Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines education, detection, and gamification to create the ultimate digital safety experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.link}>
                  <Card hover className="h-full">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learn About Digital Threats
            </h2>
            <p className="text-xl text-gray-600">
              Explore our comprehensive library of educational content
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <Badge variant="info" className="mb-4">
                    {category.count} lessons
                  </Badge>
                  <p className="text-gray-600 text-sm">
                    Learn to identify and protect against {category.name.toLowerCase()}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Did You Know Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              💡 Did You Know?
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              Over 3.4 billion phishing emails are sent every day, making email-based attacks 
              the most common entry point for cybercriminals.
            </p>
            <p className="text-sm text-gray-500">
              Stay informed with our daily digital safety facts!
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Enhance Your Digital Safety?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who are already protecting themselves online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quiz">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20"
              >
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
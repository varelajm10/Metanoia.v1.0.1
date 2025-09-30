'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Search, 
  MessageCircle, 
  Phone, 
  Mail,
  ChevronRight,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getAllHelpArticles } from '@/lib/help-articles';
import { HelpArticleMeta } from '@/lib/help-articles';

interface HelpNavigationProps {
  className?: string;
}

export function HelpNavigation({ className = '' }: HelpNavigationProps) {
  const [articles, setArticles] = useState<HelpArticleMeta[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<HelpArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery]);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/help-articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles.slice(0, 5)); // Mostrar solo 5 artículos populares
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = articles
      .filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      )
      .slice(0, 8); // Máximo 8 resultados

    setFilteredArticles(filtered);
  };

  const isHelpPage = pathname.startsWith('/dashboard/help');

  if (!isHelpPage) {
    return null;
  }

  return (
    <Card className={`border-l-4 border-l-blue-500 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Centro de Ayuda</h3>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar ayuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          {/* Search Results or Popular Articles */}
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredArticles.length === 0 && searchQuery ? (
                <p className="text-sm text-gray-500 text-center py-2">
                  No se encontraron resultados
                </p>
              ) : (
                filteredArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/dashboard/help/${article.slug}`}
                    className="block group"
                  >
                    <div className="flex items-start gap-2 p-2 rounded hover:bg-gray-50 transition-colors">
                      <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 group-hover:text-blue-500 transition-colors" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{article.category}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{article.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2 pt-2 border-t">
            <Link href="/dashboard/help" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Home className="h-4 w-4 mr-2" />
                Ver todos los artículos
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <MessageCircle className="h-3 w-3 mr-1" />
                Chat
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Phone className="h-3 w-3 mr-1" />
                Llamar
              </Button>
            </div>
            
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Mail className="h-3 w-3 mr-1" />
              Enviar email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

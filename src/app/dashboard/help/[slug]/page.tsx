'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  BookOpen, 
  Share2, 
  ThumbsUp,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HelpArticle, HelpArticleMeta } from '@/lib/help-articles';

export default function HelpArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<HelpArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<HelpArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/help-articles/${slug}`);
      if (!response.ok) {
        throw new Error('Artículo no encontrado');
      }
      
      const data = await response.json();
      setArticle(data.article);
      setRelatedArticles(data.relatedArticles || []);
    } catch (error) {
      console.error('Error loading article:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar el artículo');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Avanzado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Aquí podrías mostrar una notificación de éxito
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Artículo no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'El artículo que buscas no existe o ha sido eliminado.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button asChild>
              <Link href="/dashboard/help">
                Ver todos los artículos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Button 
          onClick={() => router.back()} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Ayuda
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <article className="prose prose-lg max-w-none">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-sm">
                    {article.category}
                  </Badge>
                  <Badge className={`text-sm ${getDifficultyColor(article.difficulty)}`}>
                    {article.difficulty}
                  </Badge>
                </div>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6">
                {article.description}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {article.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.date)}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {Math.ceil(article.content.split(' ').length / 200)} min de lectura
                </div>
              </div>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            <Separator className="mb-8" />

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          </article>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  ¿Te ayudó este artículo?
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comentar
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </footer>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Artículos relacionados</CardTitle>
                  <CardDescription>
                    Otros artículos que podrían interesarte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <Link 
                      key={relatedArticle.slug} 
                      href={`/dashboard/help/${relatedArticle.slug}`}
                      className="block group"
                    >
                      <div className="p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors mb-1">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {relatedArticle.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {relatedArticle.category}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(relatedArticle.difficulty)}`}>
                            {relatedArticle.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Support Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    ¿Necesitas más ayuda?
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Nuestro equipo de soporte está disponible para ayudarte
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                      Contactar Soporte
                    </Button>
                    <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver más artículos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

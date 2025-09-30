import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export interface HelpArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  content: string;
  contentHtml: string;
}

export interface HelpArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
}

const helpArticlesDirectory = path.join(process.cwd(), 'docs', 'help-articles');

/**
 * Obtiene todos los slugs de los artículos de ayuda
 */
export function getAllHelpArticleSlugs(): string[] {
  try {
    if (!fs.existsSync(helpArticlesDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(helpArticlesDirectory);
    return fileNames
      .filter((name) => name.endsWith('.md'))
      .map((name) => name.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading help articles directory:', error);
    return [];
  }
}

/**
 * Obtiene todos los artículos de ayuda con sus metadatos
 */
export async function getAllHelpArticles(): Promise<HelpArticleMeta[]> {
  const slugs = getAllHelpArticleSlugs();
  const articles: HelpArticleMeta[] = [];

  for (const slug of slugs) {
    try {
      const article = await getHelpArticleBySlug(slug);
      if (article) {
        articles.push({
          slug: article.slug,
          title: article.title,
          description: article.description,
          category: article.category,
          tags: article.tags,
          author: article.author,
          date: article.date,
          difficulty: article.difficulty,
        });
      }
    } catch (error) {
      console.error(`Error processing article ${slug}:`, error);
    }
  }

  // Ordenar por fecha (más recientes primero)
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Obtiene un artículo de ayuda por su slug
 */
export async function getHelpArticleBySlug(slug: string): Promise<HelpArticle | null> {
  try {
    const fullPath = path.join(helpArticlesDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Procesar el contenido Markdown a HTML
    const processedContent = await remark()
      .use(remarkHtml, { sanitize: false })
      .process(content);

    const contentHtml = processedContent.toString();

    return {
      slug,
      title: data.title || 'Sin título',
      description: data.description || '',
      category: data.category || 'General',
      tags: data.tags || [],
      author: data.author || 'Equipo Metanoia',
      date: data.date || new Date().toISOString().split('T')[0],
      difficulty: data.difficulty || 'Básico',
      content: content,
      contentHtml: contentHtml,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

/**
 * Obtiene artículos por categoría
 */
export async function getHelpArticlesByCategory(category: string): Promise<HelpArticleMeta[]> {
  const allArticles = await getAllHelpArticles();
  return allArticles.filter(article => 
    article.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Busca artículos por término
 */
export async function searchHelpArticles(query: string): Promise<HelpArticleMeta[]> {
  const allArticles = await getAllHelpArticles();
  const searchTerm = query.toLowerCase();

  return allArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.description.toLowerCase().includes(searchTerm) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    article.category.toLowerCase().includes(searchTerm)
  );
}

/**
 * Obtiene todas las categorías únicas
 */
export async function getAllCategories(): Promise<string[]> {
  const allArticles = await getAllHelpArticles();
  const categories = new Set(allArticles.map(article => article.category));
  return Array.from(categories).sort();
}

/**
 * Obtiene todos los tags únicos
 */
export async function getAllTags(): Promise<string[]> {
  const allArticles = await getAllHelpArticles();
  const tags = new Set(allArticles.flatMap(article => article.tags));
  return Array.from(tags).sort();
}

/**
 * Obtiene artículos relacionados basados en tags
 */
export async function getRelatedArticles(currentSlug: string, limit: number = 3): Promise<HelpArticleMeta[]> {
  const currentArticle = await getHelpArticleBySlug(currentSlug);
  if (!currentArticle) {
    return [];
  }

  const allArticles = await getAllHelpArticles();
  const relatedArticles = allArticles
    .filter(article => article.slug !== currentSlug)
    .map(article => ({
      ...article,
      relevanceScore: calculateRelevanceScore(currentArticle, article)
    }))
    .filter(article => article.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
    .map(({ relevanceScore, ...article }) => article);

  return relatedArticles;
}

/**
 * Calcula el puntaje de relevancia entre dos artículos
 */
function calculateRelevanceScore(article1: HelpArticle, article2: HelpArticleMeta): number {
  let score = 0;

  // Misma categoría
  if (article1.category === article2.category) {
    score += 3;
  }

  // Tags en común
  const commonTags = article1.tags.filter(tag => article2.tags.includes(tag));
  score += commonTags.length * 2;

  // Misma dificultad
  if (article1.difficulty === article2.difficulty) {
    score += 1;
  }

  return score;
}

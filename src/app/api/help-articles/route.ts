import { NextRequest, NextResponse } from 'next/server';
import { getAllHelpArticles, getAllCategories } from '@/lib/help-articles';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const [articles, categories] = await Promise.all([
      getAllHelpArticles(),
      getAllCategories()
    ]);

    let filteredArticles = articles;

    // Filtrar por categoría si se especifica
    if (category && category !== 'all') {
      filteredArticles = filteredArticles.filter(article =>
        article.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtrar por búsqueda si se especifica
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        article.category.toLowerCase().includes(searchTerm)
      );
    }

    return NextResponse.json({
      success: true,
      articles: filteredArticles,
      categories,
      total: filteredArticles.length
    });

  } catch (error) {
    console.error('Error fetching help articles:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar los artículos de ayuda',
        articles: [],
        categories: [],
        total: 0
      },
      { status: 500 }
    );
  }
}

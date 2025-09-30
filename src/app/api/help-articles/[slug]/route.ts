import { NextRequest, NextResponse } from 'next/server';
import { getHelpArticleBySlug, getRelatedArticles } from '@/lib/help-articles';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Slug del artículo es requerido' 
        },
        { status: 400 }
      );
    }

    const article = await getHelpArticleBySlug(slug);

    if (!article) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Artículo no encontrado' 
        },
        { status: 404 }
      );
    }

    // Obtener artículos relacionados
    const relatedArticles = await getRelatedArticles(slug, 3);

    return NextResponse.json({
      success: true,
      article,
      relatedArticles
    });

  } catch (error) {
    console.error('Error fetching help article:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar el artículo de ayuda' 
      },
      { status: 500 }
    );
  }
}

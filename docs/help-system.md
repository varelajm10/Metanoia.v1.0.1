# Sistema de Base de Conocimiento (Knowledge Base)

## Descripción

El sistema de base de conocimiento de Metanoia permite a los usuarios acceder a artículos de ayuda organizados, buscar información específica y navegar por contenido estructurado para resolver sus dudas sobre el uso del sistema ERP.

## Características Principales

### 📚 Gestión de Artículos
- **Formato Markdown**: Los artículos se escriben en Markdown con frontmatter para metadatos
- **Metadatos ricos**: Título, descripción, categoría, tags, autor, fecha, dificultad
- **Procesamiento automático**: Conversión de Markdown a HTML con syntax highlighting
- **Organización por categorías**: Artículos agrupados por temas (Productos, Facturación, etc.)

### 🔍 Búsqueda y Filtrado
- **Búsqueda en tiempo real**: Filtrado instantáneo por título, descripción y tags
- **Filtros por categoría**: Navegación por categorías específicas
- **Búsqueda semántica**: Encuentra contenido relacionado por contexto
- **Artículos relacionados**: Sugerencias automáticas basadas en tags y categorías

### 🎨 Interfaz de Usuario
- **Diseño responsive**: Optimizado para desktop, tablet y móvil
- **Navegación intuitiva**: Breadcrumbs y navegación contextual
- **Estados de carga**: Indicadores de progreso y estados de error
- **Accesibilidad**: Cumple estándares WCAG para usuarios con discapacidades

## Estructura de Archivos

```
docs/
├── help-articles/              # Directorio de artículos
│   ├── 01-como-crear-un-producto.md
│   ├── 02-como-enviar-una-factura.md
│   └── ...
src/
├── app/
│   ├── dashboard/help/         # Páginas del centro de ayuda
│   │   ├── page.tsx           # Lista de artículos
│   │   └── [slug]/page.tsx    # Artículo individual
│   └── api/help-articles/     # APIs para gestión de artículos
│       ├── route.ts           # Lista de artículos
│       └── [slug]/route.ts    # Artículo específico
├── components/help/           # Componentes específicos
│   └── HelpNavigation.tsx     # Navegación contextual
└── lib/
    └── help-articles.ts       # Utilidades para procesamiento
```

## Formato de Artículos

### Frontmatter Requerido

```yaml
---
title: "Título del artículo"
description: "Descripción breve del contenido"
category: "Categoría principal"
tags: ["tag1", "tag2", "tag3"]
author: "Autor del artículo"
date: "2024-01-15"
difficulty: "Básico|Intermedio|Avanzado"
---
```

### Estructura de Contenido

```markdown
# Título Principal

## Sección 1
Contenido de la sección...

### Subsección
Más detalles...

## Consejos útiles
- Lista de consejos
- Más información

## Solución de problemas
### Error común
Descripción del error y solución...
```

## APIs Disponibles

### GET /api/help-articles
Obtiene todos los artículos con filtros opcionales.

**Parámetros de consulta:**
- `category`: Filtrar por categoría específica
- `search`: Buscar por término específico

**Respuesta:**
```json
{
  "success": true,
  "articles": [...],
  "categories": [...],
  "total": 10
}
```

### GET /api/help-articles/[slug]
Obtiene un artículo específico con contenido completo.

**Respuesta:**
```json
{
  "success": true,
  "article": {
    "slug": "01-como-crear-un-producto",
    "title": "Cómo crear un producto",
    "content": "...",
    "contentHtml": "...",
    ...
  },
  "relatedArticles": [...]
}
```

## Componentes

### HelpNavigation
Componente de navegación contextual que aparece en páginas de ayuda.

**Características:**
- Búsqueda rápida en tiempo real
- Artículos populares
- Accesos directos a soporte
- Navegación contextual

### HelpPage
Página principal del centro de ayuda.

**Características:**
- Lista de artículos con filtros
- Búsqueda avanzada
- Estadísticas del centro de ayuda
- Enlaces a soporte

### HelpArticlePage
Página de artículo individual.

**Características:**
- Contenido renderizado en HTML
- Artículos relacionados
- Navegación de breadcrumbs
- Opciones de compartir
- Sidebar con información adicional

## Utilidades

### help-articles.ts
Módulo principal para el procesamiento de artículos.

**Funciones principales:**
- `getAllHelpArticles()`: Obtiene todos los artículos
- `getHelpArticleBySlug(slug)`: Obtiene artículo específico
- `getRelatedArticles(slug)`: Obtiene artículos relacionados
- `searchHelpArticles(query)`: Busca artículos por término
- `getAllCategories()`: Obtiene todas las categorías

## Mejores Prácticas

### Para Escritores de Contenido

1. **Títulos descriptivos**: Usa títulos claros y específicos
2. **Metadatos completos**: Completa todos los campos del frontmatter
3. **Estructura lógica**: Organiza el contenido en secciones claras
4. **Ejemplos prácticos**: Incluye ejemplos y casos de uso
5. **Solución de problemas**: Anticipa errores comunes y sus soluciones

### Para Desarrolladores

1. **Validación de datos**: Valida metadatos antes de procesar
2. **Manejo de errores**: Implementa fallbacks para archivos corruptos
3. **Performance**: Cachea artículos procesados cuando sea posible
4. **SEO**: Incluye meta tags apropiados para cada artículo
5. **Accesibilidad**: Mantén contraste y navegación por teclado

## Extensiones Futuras

### Funcionalidades Planificadas

- **Sistema de comentarios**: Permitir feedback de usuarios
- **Rating de artículos**: Sistema de calificaciones
- **Versión en PDF**: Exportación de artículos a PDF
- **Multilingüe**: Soporte para múltiples idiomas
- **Analytics**: Métricas de uso y popularidad
- **Editor WYSIWYG**: Editor visual para no técnicos
- **Sistema de tags avanzado**: Tags jerárquicos y filtros complejos
- **Integración con IA**: Sugerencias automáticas de contenido

### Integraciones

- **Sistema de tickets**: Enlaces directos desde artículos
- **CRM**: Tracking de consultas por cliente
- **Analytics**: Métricas de engagement
- **Notificaciones**: Alertas sobre artículos actualizados

## Mantenimiento

### Tareas Regulares

1. **Revisión de contenido**: Actualizar artículos obsoletos
2. **Optimización SEO**: Mejorar meta descriptions y keywords
3. **Análisis de uso**: Revisar métricas de popularidad
4. **Backup**: Respaldo regular de artículos
5. **Testing**: Verificar funcionamiento en diferentes dispositivos

### Monitoreo

- **Errores 404**: Artículos con enlaces rotos
- **Performance**: Tiempo de carga de páginas
- **Búsquedas vacías**: Términos que no arrojan resultados
- **Artículos no visitados**: Contenido que no se consulta

## Soporte

Para problemas técnicos o sugerencias de mejora:

- **Email**: desarrollo@metanoia.com
- **Slack**: #help-system
- **Documentación**: [Link a documentación técnica]
- **Issues**: [Link al repositorio de issues]

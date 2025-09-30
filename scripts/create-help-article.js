#!/usr/bin/env node

/**
 * Script para crear nuevos artículos de ayuda
 * Uso: node scripts/create-help-article.js "Título del artículo"
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function createSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

function getNextNumber() {
  const helpArticlesDir = path.join(process.cwd(), 'docs', 'help-articles');
  
  if (!fs.existsSync(helpArticlesDir)) {
    return '01';
  }

  const files = fs.readdirSync(helpArticlesDir)
    .filter(file => file.endsWith('.md'))
    .map(file => file.match(/^(\d+)-/)?.[1])
    .filter(Boolean)
    .map(num => parseInt(num, 10))
    .sort((a, b) => a - b);

  if (files.length === 0) {
    return '01';
  }

  const nextNum = Math.max(...files) + 1;
  return nextNum.toString().padStart(2, '0');
}

function createArticleTemplate(title, metadata) {
  const slug = createSlug(title);
  const number = getNextNumber();
  const filename = `${number}-${slug}.md`;
  
  const template = `---
title: "${title}"
description: "${metadata.description}"
category: "${metadata.category}"
tags: [${metadata.tags.map(tag => `"${tag}"`).join(', ')}]
author: "${metadata.author}"
date: "${metadata.date}"
difficulty: "${metadata.difficulty}"
---

# ${title}

${metadata.description}

## Introducción

[Escribe una introducción al tema...]

## Requisitos previos

- [Lista los requisitos necesarios]
- [Para seguir este artículo]

## Procedimiento

### Paso 1: [Título del paso]

[Descripción detallada del paso...]

### Paso 2: [Título del paso]

[Descripción detallada del paso...]

## Consejos útiles

- [Consejo 1]
- [Consejo 2]
- [Consejo 3]

## Solución de problemas

### Error: "[Descripción del error]"

**Causa**: [Explicación de la causa]

**Solución**: [Pasos para resolver el problema]

## Próximos pasos

Una vez completado este procedimiento, puedes:

- [Enlace a artículo relacionado 1]
- [Enlace a artículo relacionado 2]
- [Enlace a artículo relacionado 3]

## Contacto de soporte

Si tienes problemas con este procedimiento:

- **Email**: soporte@metanoia.com
- **Teléfono**: +1 (555) 123-4567
- **Chat en vivo**: Disponible desde tu dashboard
`;

  return { filename, template };
}

async function main() {
  console.log('🚀 Creador de Artículos de Ayuda para Metanoia\n');

  try {
    // Obtener título del artículo
    const title = process.argv[2] || await question('📝 Título del artículo: ');
    
    if (!title.trim()) {
      console.log('❌ El título es requerido');
      process.exit(1);
    }

    // Obtener metadatos
    const description = await question('📄 Descripción breve: ');
    const category = await question('📁 Categoría (Productos, Facturación, CRM, etc.): ');
    const tagsInput = await question('🏷️  Tags (separados por comas): ');
    const author = await question('👤 Autor: ') || 'Equipo Metanoia';
    const difficulty = await question('📊 Dificultad (Básico/Intermedio/Avanzado): ') || 'Básico';

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const metadata = {
      description: description || 'Descripción del artículo',
      category: category || 'General',
      tags: tags.length > 0 ? tags : ['ayuda'],
      author,
      date: new Date().toISOString().split('T')[0],
      difficulty: difficulty || 'Básico'
    };

    // Crear el archivo
    const { filename, template } = createArticleTemplate(title, metadata);
    const filepath = path.join(process.cwd(), 'docs', 'help-articles', filename);

    // Verificar si el directorio existe
    const helpArticlesDir = path.dirname(filepath);
    if (!fs.existsSync(helpArticlesDir)) {
      fs.mkdirSync(helpArticlesDir, { recursive: true });
    }

    // Verificar si el archivo ya existe
    if (fs.existsSync(filepath)) {
      const overwrite = await question(`⚠️  El archivo ${filename} ya existe. ¿Sobrescribir? (y/N): `);
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Operación cancelada');
        process.exit(0);
      }
    }

    // Escribir el archivo
    fs.writeFileSync(filepath, template, 'utf8');

    console.log('\n✅ Artículo creado exitosamente!');
    console.log(`📁 Archivo: ${filename}`);
    console.log(`📍 Ruta: ${filepath}`);
    console.log(`🔗 URL: /dashboard/help/${createSlug(title)}`);
    console.log('\n📝 Puedes editar el archivo y agregar el contenido específico.');
    console.log('🚀 El artículo estará disponible en el centro de ayuda una vez que agregues contenido.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { createArticleTemplate, createSlug };

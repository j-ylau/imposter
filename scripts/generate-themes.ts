#!/usr/bin/env ts-node

/**
 * Auto-generate theme types and configurations from manifest.json
 *
 * This eliminates manual wiring when adding new themes.
 * Just update manifest.json and run: npm run generate:themes
 */

import fs from 'fs';
import path from 'path';

interface ThemeManifest {
  [key: string]: {
    file: string;
    label: string;
    emoji: string;
    category: string;
    description: string;
    audience: string;
    ogColors: {
      start: string;
      end: string;
      accent: string;
    };
  };
}

const manifestPath = path.join(__dirname, '../data/themes/manifest.json');
const manifest: ThemeManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

const themeKeys = Object.keys(manifest);

// Generate Theme union type for schema
const themeUnion = themeKeys.map(key => `  | '${key}'`).join('\n');

const schemaOutput = `// Auto-generated from data/themes/manifest.json
// DO NOT EDIT MANUALLY - Run 'npm run generate:themes' to update

export type Theme =
${themeUnion};
`;

// Generate themes.ts configuration
const imports = themeKeys
  .map((key) => {
    let varName = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    // Handle reserved keywords
    if (varName === 'default') varName = 'defaultWords';
    return `import ${varName} from './${manifest[key].file}';`;
  })
  .join('\n');

const themesObject = themeKeys
  .map((key) => {
    let varName = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    // Handle reserved keywords
    if (varName === 'default') varName = 'defaultWords';
    return key.includes('-') || key === 'default'
      ? `  '${key}': ${varName},`
      : `  ${key}: ${varName},`;
  })
  .join('\n');

const lazyLoadCases = themeKeys
  .map((key) => `    case '${key}':\n      return (await import('./${manifest[key].file}')).default;`)
  .join('\n');

const themeLabels = themeKeys
  .map((key) => `  '${key}': '${manifest[key].label}',`)
  .join('\n');

const themeDescriptions = themeKeys
  .map((key) => `  '${key}': '${manifest[key].description}',`)
  .join('\n');

const themeEmojis = themeKeys
  .map((key) => `  '${key}': '${manifest[key].emoji}',`)
  .join('\n');

const themeAudiences = themeKeys
  .map((key) => `    '${key}': '${manifest[key].audience}',`)
  .join('\n');

const themeCategories = themeKeys
  .map((key) => `  '${key}': '${manifest[key].category}',`)
  .join('\n');

// Get unique categories
const categories = Array.from(new Set(themeKeys.map(key => manifest[key].category))).sort();

const ogColors = themeKeys
  .map((key) => {
    const { start, end, accent } = manifest[key].ogColors;
    return `  '${key}': { start: '${start}', end: '${end}', accent: '${accent}' },`;
  })
  .join('\n');

const themesOutput = `// Auto-generated from data/themes/manifest.json
// DO NOT EDIT MANUALLY - Run 'npm run generate:themes' to update

import type { Theme } from '@/schema';

// Static imports for SSG and game logic
${imports}

export const THEMES: Record<Theme, string[]> = {
${themesObject}
} as const;

// Lazy-load helper for async contexts (reduces bundle size)
export async function getThemeWords(theme: Theme): Promise<string[]> {
  switch (theme) {
${lazyLoadCases}
    default:
      return (await import('./default.json')).default;
  }
}

export const THEME_LABELS: Record<Theme, string> = {
${themeLabels}
};

export const THEME_DESCRIPTIONS: Record<Theme, string> = {
${themeDescriptions}
};

export const THEME_EMOJIS: Record<Theme, string> = {
${themeEmojis}
};

export const THEME_AUDIENCES: Record<Theme, string> = {
${themeAudiences}
};

export const THEME_CATEGORIES: Record<Theme, string> = {
${themeCategories}
};

export const CATEGORIES = ${JSON.stringify(categories)} as const;

export const THEME_OG_COLORS: Record<Theme, { start: string; end: string; accent: string }> = {
${ogColors}
};
`;

// Write generated files
const schemaPath = path.join(__dirname, '../schema/theme-types.ts');
const themesPath = path.join(__dirname, '../data/themes.ts');

fs.writeFileSync(schemaPath, schemaOutput);
fs.writeFileSync(themesPath, themesOutput);

console.log('✅ Theme types and configuration auto-generated successfully!');
console.log(`   - ${themeKeys.length} themes processed`);
console.log(`   - ${schemaPath}`);
console.log(`   - ${themesPath}`);

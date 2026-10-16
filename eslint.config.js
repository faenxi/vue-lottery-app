import boundaries from 'eslint-plugin-boundaries'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

// Шари Feature-Sliced Design від найвищого до найнижчого.
// Модуль може імпортувати лише з шарів, що розташовані нижче за нього.
const layerRules = [
  { from: 'app', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
  { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
  { from: 'widgets', allow: ['features', 'entities', 'shared'] },
  { from: 'features', allow: ['entities', 'shared'] },
  { from: 'entities', allow: ['shared'] },
  // shared складається із сегментів (api, ui, lib, config), які можуть залежати один від одного
  { from: 'shared', allow: ['shared'] },
]

export default defineConfigWithVueTs(
  { name: 'app/files-to-lint', files: ['**/*.{ts,mts,tsx,vue}'] },
  { name: 'app/files-to-ignore', ignores: ['**/dist/**', '**/node_modules/**'] },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    name: 'app/vue-rules',
    rules: {
      // Необов'язкові props у TypeScript за замовчуванням undefined
      'vue/require-default-prop': 'off',
      // Правила суто форматування вимикаємо (форматування не входить до style guide)
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/first-attribute-linebreak': 'off',
    },
  },
  {
    // Правила FSD: напрямок залежностей між шарами та імпорти лише через Public API (index.ts)
    name: 'app/fsd-boundaries',
    files: ['src/**/*.{ts,vue}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': { typescript: { project: './tsconfig.json' } },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', mode: 'folder' },
        { type: 'pages', pattern: 'src/pages/*', mode: 'folder' },
        { type: 'widgets', pattern: 'src/widgets/*', mode: 'folder' },
        { type: 'features', pattern: 'src/features/*', mode: 'folder' },
        { type: 'entities', pattern: 'src/entities/*', mode: 'folder' },
        // у shared кожен сегмент (api, ui, lib, config) має власний Public API
        { type: 'shared', pattern: 'src/shared/*', mode: 'folder' },
      ],
    },
    rules: {
      // Заборона імпортів "вгору" та між слайсами одного шару
      'boundaries/element-types': ['error', { default: 'disallow', rules: layerRules }],
      // Заборона глибоких імпортів: ззовні слайса можна імпортувати лише його index.ts
      'boundaries/entry-point': [
        'error',
        {
          default: 'disallow',
          rules: [{ target: ['pages', 'widgets', 'features', 'entities', 'shared'], allow: 'index.ts' }],
        },
      ],
    },
  },
)

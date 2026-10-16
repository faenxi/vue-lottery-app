import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

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
)

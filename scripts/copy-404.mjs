// GitHub Pages не вміє history-режим: для невідомих адрес віддає 404.html.
// Копіюємо index.html у 404.html, щоб SPA завантажилась і vue-router сам обробив адресу.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('dist/404.html created')

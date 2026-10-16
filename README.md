# vue-lottery-app

Лабораторна робота №5: маршрутизація (vue-router), патерн Repository, авторизація за JWT.
Vue 3 (Composition API) + TypeScript + Pinia + VeeValidate/Yup + Bootstrap (SCSS) + ESLint.

## Запуск

```bash
npm install
npm run dev          # dev-сервер
npm run lint         # ESLint
npm run type-check   # перевірка типів
npm run build        # збірка (створює і dist/404.html для gh-pages)
npm run deploy       # збірка + публікація dist у гілку gh-pages
```

Налаштування середовища лежать у `.env` (не комітиться), приклад у `.env.example`:

```
VITE_API_URL=https://dummyjson.com
```

Тестовий вхід: `emilys` / `emilyspass`.

## Git: гілка feature/routing і деплой

```bash
git checkout main
git checkout -b feature/routing
# скопіюйте файли з архіву в проєкт (папку .git не чіпайте), старі src/ краще замінити повністю
npm install
git add -A
git commit -m "feat: add vue-router, repository pattern, jwt auth"   # або кілька комітів за завданнями
git push -u origin feature/routing
npm run deploy                                                        # публікує dist у гілку gh-pages
```

Далі в GitHub: Settings → Pages → Source: *Deploy from a branch* → гілка `gh-pages`, папка `/ (root)`.
Адреса: `https://<user>.github.io/vue-lottery-app/`.
Якщо репозиторій називається інакше, змініть `VITE_BASE_PATH` у `.env` (наприклад, `/my-repo/`).

## Структура

```
src/
  api/http-client.ts        # єдиний HTTP-клієнт: VITE_API_URL, помилки, Bearer, refresh при 401
  services/                 # патерн Repository
    interfaces.ts           #   Readable<T>, Creatable<T>, Editable<T>, Deletable<T>
    user.service.ts         #   UserService
    auth.service.ts         #   AuthService
    service-provider.ts     #   ServiceProvider (фабрика сервісів)
  types/                    # User, CreateUserDto, UpdateUserDto, Auth*, Paginated
  stores/                   # Pinia: auth, users, winners
  router/                   # маршрути, guards, meta (title, requiresAuth, guestOnly, layout)
  layouts/                  # DefaultLayout, AuthLayout (обираються через meta.layout)
  views/                    # Home, About, Login, Users, UserDetails, UserEdit, NotFound
  components/               # base/, form/, layout/ (AppHeader, AppNavigation, AppLogo), users/, lottery/
  validation/schemas.ts     # Yup-схеми для VeeValidate
```

Компонент `<Logo>` з завдання називається `AppLogo` (за style guide назви компонентів багатослівні).

## Маршрути

| URL | Опис | Доступ |
|---|---|---|
| `/` | Home | всі |
| `/about` | About author | всі |
| `/login` | Login (AuthLayout) | лише гості, авторизованих редіректить на `/users` |
| `/users?page=2&q=john` | Список, пагінація та пошук в query | requiresAuth |
| `/users/:id` | Деталі (`props: true`) | requiresAuth |
| `/users/:id/edit` | Вкладений маршрут редагування | requiresAuth |
| `/:pathMatch(.*)*` | 404 | всі |

## Важливі нотатки

- DummyJSON лише імітує POST/PUT/DELETE, тому `stores/users.ts` сам підтримує локальний стан:
  створені користувачі додаються на першу сторінку, оновлені накладаються поверх відповіді сервера,
  видалені приховуються. Для щойно створених користувачів запити PUT/DELETE на сервер не надсилаються
  (їх там не існує), зміни застосовуються локально.
- Нового користувача DummyJSON завжди повертає з `id: 209`, тому стор видає унікальні id локально.
- Лотерея працює з користувачами поточної сторінки списку; один користувач не може виграти двічі,
  максимум 3 переможці. Видалений користувач зникає і з переможців.
- Щоб швидко побачити автоматичне оновлення токена, поставте в `.env` `VITE_TOKEN_EXPIRES_IN_MINS=1`,
  увійдіть, зачекайте хвилину й перезавантажте сторінку: запит `/auth/me` отримає 401, і interceptor
  викличе `/auth/refresh`.
- У формі редагування пароль необов'язковий: порожнє поле означає «не змінювати».
- Дані для сторінок Home та About (ПІБ, посилання, навички) змінюються в `src/config/site.ts`.

## Контрольні запитання

1. **Патерн Repository** — «посередник» між програмою і джерелом даних. Компонент просить дані в репозиторія і не знає, звідки вони (API, localStorage). Потрібен, щоб код доступу до даних не змішувався з рештою коду.
2. **Складові:** репозиторій (клас із методами getAll, getById, create, update, delete), модель (тип даних, у нас `User`), клієнтський код (компоненти, які викликають репозиторій). У нас ще `ServiceProvider` (видає сервіси) та `http-client` (робить запити).
3. **Модель** описує, як виглядають дані (поля та їхні типи). Репозиторій приймає й повертає саме моделі.
4. Компонент викликає `ServiceProvider.users.getAll()` і не знає ні про `fetch`, ні про URL. Якщо джерело зміниться, правимо лише репозиторій.
5. Клієнтський код залежить від інтерфейсу, а не від конкретного класу. У тесті підставляємо фейковий сервіс замість справжнього, і мережа не потрібна.
6. **Переваги:** розділення відповідальностей, легко тестувати, повторне використання, можна змінити джерело даних без змін у компонентах, менше дублювання коду і помилок.
7. **Vue Router** — офіційна бібліотека для навігації в SPA. Показує потрібний компонент залежно від адреси без перезавантаження сторінки.
8. Масив маршрутів: `{ path: '/users', name: 'users', component: UsersView }`. Передаємо його в `createRouter({ history: createWebHistory(), routes })`.
9. **RouterLink** — посилання для переходу (замість `<a>`). **RouterView** — місце, куди підставляється компонент поточного маршруту.
10. Динамічний параметр у шляху: `/users/:id`. Щоб він прийшов у компонент як prop, додаємо `props: true`, і компонент оголошує `defineProps<{ id: string }>()`.
11. Через `children`: у батьківського маршруту є масив дочірніх, а в батьківському компоненті стоїть свій `<RouterView>`. У нас `/users/:id` містить дочірній `edit`.
12. **Guard** — функція, яка спрацьовує перед (або після) переходу й може дозволити його, скасувати чи перенаправити. У нас `router.beforeEach` перенаправляє неавторизованих на `/login`.
13. `meta` — додаткові дані маршруту (`title`, `requiresAuth`, `layout`). Guard-и та layout читають їх, не знаючи про конкретні сторінки.
14. У `meta.layout` вказуємо ім'я layout (`default` або `auth`). `App.vue` обирає компонент-обгортку (`DefaultLayout` чи `AuthLayout`) і ставить усередину `<RouterView>`.
15. **JWT** — підписаний токен із трьох частин через крапку: header (алгоритм), payload (дані) і signature (підпис). Безпечніше зберігати в `HttpOnly` cookie. `localStorage` читає будь-який JS на сторінці, тому при XSS-атаці токен можна вкрасти.
16. **accessToken** живе недовго і додається до кожного захищеного запиту. **refreshToken** живе довше й потрібен лише для того, щоб отримати новий accessToken, коли старий протермінувався.
17. Адресу можна скопіювати й відкрити в іншому місці. Працюють кнопки «назад/вперед», стан не губиться після перезавантаження. Локальний стан компонента при цьому зникає.
18. DummyJSON лише імітує видалення і насправді нічого не змінює, тому при новому запиті користувач знову прийде зі списку. Виправлення: після успішної відповіді самим прибрати його з локального стану (у нас `deletedUsers` у `stores/users.ts`).

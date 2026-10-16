export interface AppTableColumn {
  /** Унікальний ключ колонки; також ім'я слота cell-<key> */
  key: string
  header: string
  /** Поле рядка, яке виводиться за замовчуванням */
  field?: string
  align?: 'left' | 'right'
  nowrap?: boolean
}

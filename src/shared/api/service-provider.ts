type Factory<T> = () => T

/**
 * Універсальний реєстр сервісів. Шар shared нічого не знає про конкретні сервіси:
 * UserService та AuthService реєструються на рівні app (app/providers/services.ts).
 */
export class ServiceProvider {
  private static factories = new Map<string, Factory<unknown>>()
  private static instances = new Map<string, unknown>()

  static register<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory)
    // Нова фабрика скидає раніше створений екземпляр
    this.instances.delete(key)
  }

  static get<T>(key: string): T {
    if (!this.instances.has(key)) {
      const factory = this.factories.get(key)
      if (!factory) throw new Error(`Service "${key}" is not registered`)
      this.instances.set(key, factory())
    }
    return this.instances.get(key) as T
  }
}

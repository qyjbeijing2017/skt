export function Singleton<T extends new (...args: any[]) => any>() {
  let instance: any
  return (target: T) => {
    return new Proxy(target, {
      construct() {
        if (!instance) {
          instance = new target()
        }
        return instance
      }
    })
  }
}

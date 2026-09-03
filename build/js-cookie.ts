/*
 * @Author: tianhaoliu tigooGame@home.com
 * @Date: 2026-08-23
 * @Description: js-cookie 的 localStorage 兼容 shim
 *               Electron 打包后页面跑在 file:// 协议下，Chromium 会静默禁用
 *               document.cookie，导致 js-cookie 的 get/set/remove 全部失效（不报错）。
 *               通过 Vite alias 将 import "js-cookie" 重定向到本文件，业务代码零改动。
 */

interface CookieAttributes {
  /** 过期时间：天数或 Date */
  expires?: number | Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  [key: string]: unknown
}

interface CookieConverter {
  read?: (value: string, name: string) => string
  write?: (value: string, name: string) => string
}

interface CookiesStatic {
  get(name: string): string | undefined
  set(name: string, value: string, attributes?: CookieAttributes): string | undefined
  remove(name: string, attributes?: CookieAttributes): void
  defaults?: CookieAttributes
  withConverter?: (converter: CookieConverter | { read: CookieConverter['read']; write: CookieConverter['write'] }) => CookiesStatic
}

interface StoredValue {
  v: string
  /** 绝对过期时间戳（毫秒），undefined 表示永不过期 */
  e?: number
}

const FALLBACK = new Map<string, StoredValue>()

function storageAvailable(): boolean {
  try {
    const k = '__js_cookie_shim__'
    window.localStorage.setItem(k, k)
    window.localStorage.removeItem(k)
    return true
  } catch {
    return false
  }
}

const store = {
  get(key: string): StoredValue | undefined {
    if (storageAvailable()) {
      const raw = window.localStorage.getItem(key)
      if (raw == null) return undefined
      try {
        return JSON.parse(raw) as StoredValue
      } catch {
        return undefined
      }
    }
    return FALLBACK.get(key)
  },
  set(key: string, value: StoredValue): void {
    if (storageAvailable()) {
      window.localStorage.setItem(key, JSON.stringify(value))
    } else {
      FALLBACK.set(key, value)
    }
  },
  remove(key: string): void {
    if (storageAvailable()) {
      window.localStorage.removeItem(key)
    } else {
      FALLBACK.delete(key)
    }
  }
}

function toExpireMs(attributes?: CookieAttributes): number | undefined {
  const expires = attributes?.expires
  if (expires == null) return undefined
  if (expires instanceof Date) return expires.getTime()
  // js-cookie 的 expires 为“天数”
  return Date.now() + expires * 86400000
}

const Cookies: CookiesStatic = {
  get(name) {
    const item = store.get(name)
    if (!item) return undefined
    if (item.e != null && item.e <= Date.now()) {
      store.remove(name)
      return undefined
    }
    return item.v
  },
  set(name, value, attributes) {
    const item: StoredValue = { v: String(value), e: toExpireMs(attributes) }
    store.set(name, item)
    return item.v
  },
  remove(name) {
    store.remove(name)
  }
}

export default Cookies

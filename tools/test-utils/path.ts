import { Path } from '@ts-schema-autogen/types'

export class FakePath implements Path.Mod {
  constructor (private readonly cwd: string) {}

  public readonly join = (...paths: string[]): string => {
    if (!paths.length) return '.'
    const [head, ...rest] = paths
    const tail = this.join(...rest)
    if (head === '.') return tail
    if (tail === '.') return head
    if (tail.startsWith('../')) return this.join(this.dirname(head), tail.slice('../'.length))
    const left = head.endsWith('/') ? head.slice(0, -1) : head
    const right = tail.startsWith('/') ? tail.slice(1) : tail
    return left + '/' + right
  }

  public readonly resolve = (...paths: string[]): string => {
    if (!paths.length) return '.'
    const [head, ...rest] = paths
    const tail = this.resolve(...rest)
    if (tail.startsWith('/')) return tail
    return this.join(this.cwd, head, tail)
  }

  public readonly dirname = (path: string): string => {
    if (path === '' || path === '.' || path === '/') return path
    const segments = path.split('/').slice(0, -1)
    if (!segments.length) return '.'
    return this.join(...segments)
  }

  public readonly basename = (path: string): string => {
    const segments = path.split('/')
    return segments[segments.length - 1]
  }
}

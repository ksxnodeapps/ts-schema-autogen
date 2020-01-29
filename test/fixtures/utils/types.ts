export interface FsTree {
  readonly [_: string]: string | FsTree
}

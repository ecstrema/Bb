# tree-structure

Fully featured tree structure without superfluous needs.

## Install

``` shell
npm install bb-tree
```

## Usage

### import

``` typescript
import { TreeNode } from 'bb-tree';
```

or, the short way:

``` typescript
import { TN } from 'bb-tree';
```

`TN` is an alias for TreeNode. If you decide to use TN instead of TreeNode, you **must** use is *consistently*.

### Docs

API is available in docs format [here](https://marr11317.github.io/bb-tree/)

### Getting started

Let's first create a tree:

```typescript
const root = new TN().appendChildren(
                new TN().appendChildren(
                    new TN().appendChildren(
                        new TN(),
                        new TN(),
                    ),
                    new TN(),
                ),
                new TN(),
                new TN().appendChildren(
                    new TN(),
                    new TN(),
                ),
            )
```

This method of initializing a tree has the advantage of easily showing the structure.



## License

MIT

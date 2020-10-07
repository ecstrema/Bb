# Bb-tree-model

Fully featured tree structure without superfluous needs.

- [Bb-tree-model](#bb-tree-model)
  - [Very important part](#very-important-part)
  - [Install](#install)
  - [Usage](#usage)
    - [import](#import)
    - [Docs](#docs)
    - [Getting started](#getting-started)
    - [Next steps](#next-steps)
  - [License](#license)

## Very important part

The "bb" in bb-tree-model is pronounced "B flat", like in music.

## Install

``` shell
npm install bb-tree-model
```

## Usage

### import

``` typescript
import { TreeNode } from 'bb-tree-model';
```

or, the short way:

``` typescript
import { TN } from 'bb-tree-model';
```

`TN` is an alias for TreeNode. If you decide to use TN instead of TreeNode, you *should* use is *consistently*.

### Docs

API is available in docs format [here](https://marr11317.github.io/bb-tree-model)

### Getting started

Complete walkthrough:

```typescript
import { TN } from "bb-tree-model"
```

Let's first create a tree, using the [`appendChildren`](https://marr11317.github.io/classes/tn.html#appendchildren) method:

```typescript
let root = new TN().appendChildren(
                new TN().appendChildren(
                    new TN(),
                    new TN(),
                ),
                new TN(),
            )
```

This method of initializing a tree has the advantage of easily showing the structure.

Now let's print it to the console:

```typescript
root.print();
/**
tree-node
  ├tree-node
  │ ├tree-node
  │ └tree-node
  └tree-node
*/
```

Well that's already something! But we can do better. Let's add some more children.

```typescript
const newChild1 = new TN(root);
const newChild2 = new TN(root);
root.print();
/**
tree-node
  ├tree-node
  │ ├tree-node
  │ └tree-node
  ├tree-node
  ├tree-node
  └tree-node
*/
```

But wait! There's no [`appendChildren`](https://marr11317.github.io/classes/tn.html#appendchildren) here.
That's right, the parent was specified in the children's constructor, so there was no need for it.

Ok. Now let's see navigate through the tree.
If you've ever used tree structures, you probably know some tree traversal algorithms like
*breadth-first* or *depth-first*. Let's try them.

With bb, the *breadth-first* algorithm is implemented in the [`traverse`](https://marr11317.github.io/classes/tn.html#traverse) method.

```typescript
root.traverse((child) => {
    console.log(child.toString);
});
/**
tree-node
tree-node
tree-node
tree-node
tree-node
tree-node
*/
```

hmmm... Interesting. how could we make this better?
let's override the [`TreeNode`](https://marr11317.github.io/bb-tree-model/classes/tn.html) class...

```typescript
class MyRootNode extends TN {
    public get toString(): string {
        return 'I am the root component!'
    }
}
class MyBranchNode extends TN {
    public get toString(): string {
        return 'beware of branches'
    }
}
```

... and use it in a tree

```typescript
root = new MyRootNode().appendChildren(
            new MyBranchNode().appendChildren(
                new TN(),
                new TN(),
            ),
            new MyBranchNode(),
        )
root.print();
/**
I am the root component!
  ├beware of branches
  │ ├tree-node
  │ └tree-node
  └beware of branches
*/
```

Well that looks better. We can try to *breadth-first* again now.

```typescript
root.traverse((child) => {
    console.log(child.toString)
})
/*
I am the root component!
beware of branches
beware of branches
tree-node
tree-node
*/
```

Great! what about *depth-first*? It's called [`walk`](https://marr11317.github.io/bb-tree-model/classes/tn.html#walk) in bb.

```typescript
root.walk((child) => {
    console.log(child.toString)
})
/*
I am the root component!
beware of branches
tree-node
tree-node
beware of branches
*/
```

Wonderful, isn't it?

### Next steps

Explore [the docs](https://marr11317.github.io/bb-tree-model/)

## License

MIT

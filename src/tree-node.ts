/**
 * Tree Node class
 *
 * @class TreeNode
 */
export class TreeNode {
    /**
     * Parent node. Only the root should have a `null` parent.
     */
    private _parent : TreeNode | null;
    /**
     * Getter for {@link _parent} property.
     */
    parent() : TreeNode | null {
        return this._parent;
    }
    /**
     * Setter for {@link _parent} property.
     *
     * @param parent The new parent.
     */
    setParent(parent : TreeNode | null): void {
        this._parent = parent;
    }


    /**
     * Children nodes.
     */
    private _children : TreeNode[];
    /**
     * Getter for {@link _children} property.
     */
    children(): TreeNode[] {
        return this._children;
    }
    /**
     * Getter for {@link _children} property.
     */
    setChildren(children: TreeNode[]): void {
        this._children = children;
    }


    /**
     * Creates an instance of TreeNode..
     * @param [parent=null] the parent element.
     *
     * These two code blocks are equivalent:
     * ```
     * const root = new TN();
     * const childOfRoot = new TN(parent);
     * ```
     * and
     * ```
     * const root = new TN().{@link appendChild}(new TN());
     * ```
     *
     * @note that you should not provide the parent in the constructor
     * if you pass the newly created node to `{@link appendChild}`.
     */
    constructor(parent: TreeNode | null = null) {
        this._parent = parent;
        this._children = [];
        parent?.appendChild(this);
    }

    /**
     * Convert the object to a human understandable string.
     *
     * Use this method as a placeholder for text in tree views.
     *
     * It is especially useful if you want to extend the TreeNode class
     * (something I strongly encourage you to do) and use your
     * classes in a TreeView.
     *
     * It is written as a getter because many TreeView library require
     * this to be a property.
     */
    public get toString(): string {
        return 'tree-node';
    }

    /**
     * Insert child 'child' at position 'index'.
     *
     * @note When looping, don't forget to update the index.
     * @param index The future index of the new child.
     * @param child The child to add.
     */
    insertChildren(index: number, ...children: TreeNode[]): void {
        this.children().splice(index, 0, ...children);
    }

    /**
     * `true` if the element has no parent. `false` otherwise.
     */
    isRoot(): boolean {
        return this.parent() ? false : true;
    }

    /**
     * `true` if the element has no children. `false` otherwise.
     */
    isLeaf(): boolean {
        return this.children().length ? false : true;
    }

    /**
     * `true` if the element has a parent and at least one child. `false` otherwise.
     */
    isBranch(): boolean {
        return !(this.isRoot() || this.isLeaf());
    }

    /**
     * Appends children to the {@link children} list.
     *
     * @param children The children to append.
     * @return Returns itself for chaining.
     */
    appendChildren(...children: TreeNode[]): TreeNode {
        children.forEach((child) => child.setParent(this) );
        this.children().push(...children);
        return this;
    }

    /**
     * Prepends children to the {@link children} list.
     * @param children The children to prepend.
     * @return Returns itself for chaining.
     */
    prependChildren(...children: TreeNode[]): TreeNode {
        children.forEach((child) => child.setParent(this));
        this.children().unshift(...children);
        return this;
    }

    /**
     * Prepends a child to the {@link children} list.
     *
     * Convenience function similar to {@link prependChildren},
     * but with only one child.
     *
     * @param child The child to prepend.
     * @return Returns itself for chaining.
     */
    prependChild(child: TreeNode): TreeNode {
        child.setParent(this);
        this.children().unshift(child);
        return this;
    }

    /**
     * Appends child to {@link children} list.
     *
     * Convenience function similar to {@link appendChildren},
     * but with only one child.
     *
     * @param child The child to append.
     * @return Returns itself for chaining.
     */
    appendChild(child: TreeNode): TreeNode {
        child.setParent(this);

        this.children().push(child);
        return this;
    }

    /**
     * Drop the node from the tree.
     *
     * The parent has this node removed from its children,
     * and this element loses its parent.
     *
     * ```
     * tree
     *   ├branch
     *   │ ├branch
     *   │ │ └leaf
     *   │ ├branch
     *   │ │ └leaf
     *   │ └branch
     *   │   └leaf
     *   ├toBeDropped  <---- This one is dropped
     *   │ └branch
     *   │   └leaf
     *   └branch
     *     ├branch
     *     │ └leaf
     *     └branch
     *       └leaf
     * ```
     *
     * There is now two trees: one being one with the dropped child as root,
     * and the other being the old tree with the dropped node:
     *
     * ```
     * tree
     *   ├branch
     *   │ ├branch
     *   │ │ └leaf
     *   │ ├branch
     *   │ │ └leaf
     *   │ └branch
     *   │   └leaf  ==> toBeDropped
     *   └branch    AND  └branch
     *     ├branch  ==>    └leaf
     *     │ └leaf
     *     └branch
     *       └leaf
     * ```
     *
     * @return Returns itself for chaining.
     */
    drop(): TreeNode {
        // 1) remove this item from the parent's children
        const p = this.parent();
        if (p)
            p.children().splice(p.children().indexOf(this), 1);

        // 2) remove this item's parent
        this.setParent(null);
        return this;
    }

    /**
     * Convert the tree to a string of this form:
     *
     * ```
     * tree
     *   ├branch
     *   │ ├branch
     *   │ │ └leaf
     *   │ ├branch
     *   │ │ └leaf
     *   │ └branch
     *   │   └leaf
     *   ├branch
     *   │ └branch
     *   │   └leaf
     *   └branch
     *     ├branch
     *     │ └leaf
     *     └branch
     *       └leaf
     * ```
     *
     * The text used to display is contained in the {@link toString} property.
     * You should override to string in your subclass for an appropriate meaning.
     *
     * @see {@link toString}
     *
     * @static
     * @param node The node that will be root of this tree.
     * @param [level=0] The start level/indentation. *Mostly used during recursion.*
     * @param [endedLevels=[]] The levels which will not print a vertical line. *Mostly used during recursion.*
     * @param [last=true] Whether this node is the last in his parent. *Mostly used during recursion.*
     * @param [root=true] Whether this node is the root. *Mostly used during recursion.*
     * @return The result string. `console.log` it. It is not printed by default. Use {@link print} to print it.
     */
    static treeToString(node: TreeNode, level: number = 0, endedLevels: number[] = [], last = true, root = true): string {
        let result = '';
        for (let i = 0; i < level; i++) {
            if (endedLevels.includes(i))
                result += '  '
            else
                result += "│ "
        }
        if (!root){
            if (last)
                result += '└'
            else
                result += '├'
        }

        result += node.toString + "\n";
        const len = node.children().length
        for (let i = 0; i < len; i++) {
            const arr = endedLevels.slice()
            if (last)
                arr.push(level)
            result += TreeNode.treeToString(
                node.children()[i],
                level + 1,
                arr,
                (i === (len - 1)),
                false)
        }
        return result;
    }

    /**
     * Prints the output of {@link treeToString | TreeNode.treeToString} to the console.
     *
     * @param mode The print mode. Options are `'log' | 'warn' | 'debug' | 'error' | 'info'`.
     */
    print(mode: 'log' | 'warn' | 'debug' | 'error' | 'info' = 'log'): void {
        switch (mode) {
            case 'log':
                console.log(TreeNode.treeToString(this));
                break;
            case 'warn':
                console.warn(TreeNode.treeToString(this));
                break;
            case 'debug':
                console.debug(TreeNode.treeToString(this));
                break;
            case 'error':
                console.error(TreeNode.treeToString(this));
                break;
            case 'info':
                console.info(TreeNode.treeToString(this));
                break;

            default:
                console.log(TreeNode.treeToString(this));
                console.warn('unknown console mode');
                break;
        }
    }

    /**
     * Move the node and its children to a new parent.
     *
     * @note: Changing the root item's parent results in undefined behavior.
     *
     * @param newParent the future parent of this node.
     * @param index The index of this child in its new parent. If not provided, defaults to appending.
     */
    changeParent(newParent: TreeNode, index?: number): TreeNode {
        // 1) remove this item from the parent's children
        const p = this.parent();
        if (p)
            p.children().splice(p.children().indexOf(this), 1);

        // 2) change this item's parent
        index ? newParent.insertChildren(index, this): newParent.appendChild(this);
        return this;
    }

    /**
     * Similar to the Array's `forEach` function, this one iterates through
     *    the children and applies a callback to them.
     *
     * Use this function for *depth-first* tree traversal.
     * For *breadth-first* traversal, use {@link traverse}.
     *
     * If the order does not matter, [[walk]] is probably faster.
     *
     * ```
     *       tree
     *       ----
     *        j         <-- level 0
     *      /   \
     *     f      k     <-- level 1
     *   /   \      \
     *  a     h      z  <-- level 2
     *   \
     *    d             <-- level 3
     * ```
     *
     * Calling [[walk]] with only a `beforeChildrenCallback`
     * is equivalent to a **depth-first** tree traversal.
     * It will give this order of children: `j, f, a, d, h, k, z`.
     * Also called *preorder traversal*.
     *
     * Calling it with only `afterChildrenCallback`.
     * is the opposite of *depth-first*: it starts from the leaves.
     * It will give this order: `z, k, h, d, a, f, j`.
     *
     * @param node The node from which to start iterating.
     *    The callback will be called on this node and its children.
     * @param afterChildrenCallback The callback to apply to every node
     *                                  **after** applying it to its children.
     * @param beforeChildrenCallback The callback to apply to every node
     *                                  **before** applying it to its children.
     */
    static walk(node: TreeNode,
                beforeChildrenCallback?: (node: TreeNode) => void,
                afterChildrenCallback?: (node: TreeNode) => void): void {
        beforeChildrenCallback?.(node);
        node.children().forEach((child: TreeNode) => {
            TreeNode.walk(child, beforeChildrenCallback, afterChildrenCallback);
        });
        afterChildrenCallback?.(node);
    }

    /**
     * Transform the tree deeper than node into an array.
     *
     * Note that this function does not keep ordering.
     *
     * Useful for *breadth-first* traversal.
     * For *depth-first* traversal, use [[walk]].
     *
     * ```
     *       tree
     *       ----
     *        j         <-- level 0
     *      /   \
     *     f      k     <-- level 1
     *   /   \      \
     *  a     h      z  <-- level 2
     *   \
     *    d             <-- level 3
     * ```
     *
     * ```typescript
     * console.log(TreeNode.flatten(j))
     * // [j, f, k, a, h, z, d]
     * ```
     *
     * {@see breadthFirst}
     *
     * If the order does not matter, [[walk]] is probably faster.
     *
     */
    static flatten(node: TreeNode): TreeNode[] {
        return Array.prototype.concat.apply(node.children(),
                                            node.children().map(TreeNode.flatten));
    }

    /**
     * *Breadth-first* tree traversal algorithm: goes level by level.
     *
     * For *depth-first* traversal, use {@link walk}
     *
     * ```
     *       tree
     *       ----
     *        j         <-- level 0
     *      /   \
     *     f      k     <-- level 1
     *   /   \      \
     *  a     h      z  <-- level 2
     *   \
     *    d             <-- level 3
     * ```
     *
     * ```typescript
     * j.traverse((node: TreeNode) => console.log(node))
     * // j, fk, a, h, z, d
     * ```
     *
     * @param callback The callback to apply.
     */
    traverse(callback: (node: TreeNode) => void) {
        TreeNode.flatten(this).forEach((node) => callback(node) )
    }

    /**
     * Move the node deeper in the tree, by replacing the element with its new parent.
     *
     * @example
     * ```
     * -1 -11
     *    -121
     *    -13
     *
     * child12.moveDeeper(12)
     *
     * -1 -11
     *    -12 --121
     *    -13
     * ```
     * @param newParent The new parent in the hierarchy tree.
     * @returns Returns itself for chaining.
     */
    moveDeeper(newParent: TreeNode): TreeNode {
        const p = this.parent();
        if (p)
            p.children().splice(p.children().indexOf(this), 1, newParent);
        newParent.children().push(this);
        this.setParent(newParent);
        return this;
    }

    /**
     * Replace this node in the tree with a new one.
     *
     * @param node The node that will take this node's place
     * @returns itself for chaining
     *
     * @see {@link moveDeeper}
     */
    replaceWith(node: TreeNode): TreeNode {
        const p = this.parent();
        if (p)
            p.children().splice(p.children().indexOf(this), 1, node);
        this.setParent(null);
        return this;
    }

    /**
     * Index of this child in the parent's children array.
     *
     * When working with large structure, you should override this method
     * to work with an id/sha based approach.
     * It will make tree traversal considerably faster.
     *
     * Note that by default this function uses `Array.prototype.indexOf`, and *may be slow*.
     *
     * @returns The index
     */
    index(): number | undefined {
        const p = this.parent();
        if (!p)
            return undefined;
        return p.children().indexOf(this);
    }

    /**
     * Returns the next element at the same depth in the tree
     *
     * You should only use this function to iterate if you have reimplemented
     * [[index]] to be faster. In its default implementation, this function *may be slow*.
     */
    nextSameLevel(): TreeNode | undefined {
        const p = this.parent();
        if (!p)
            return undefined;

        const i = this.index();
        if (i == undefined)
            return undefined;

        return p.children()[i + 1];
    }

    /**
     * Returns the next element at the same depth in the tree
     *
     * You should only use this function to iterate if you have reimplemented
     * [[index]] to be faster. In its default implementation, this function *may be slow*
     */
    prevSameLevel(): TreeNode | undefined {
        const p = this.parent();
        if (!p)
            return undefined;

        const i = this.index();
        if (i == undefined)
            return undefined;

        return p.children()[i - 1];
    }


    /**
     * Similar to {@link nextInParent}, but if there is
     * no next child a the same depth, on higher levels.
     *
     * You should only use this function to iterate if you have reimplemented
     * [[index]] to be faster. In its default implementation, this function *may be slow*.
     *
     * @return The next element at the same level,
     *         or *the parent's **next** element*, if not found.
     *         Recursively.
     */
    nextUp(): TreeNode | undefined {
        const p = this.parent();
        if (!p)
            return undefined;

        const i = this.index();
        if (i == undefined)
            return undefined;

        const nextInParent = p.children()[i + 1];
        if (nextInParent)
            return nextInParent;

        return p.nextUp();
    }

    /**
     * Similar to {@link previousInParent}, but if there is
     * no next child a the same depth, on higher levels.
     *
     * You should only use this function to iterate if you have reimplemented
     * [[index]] to be faster. In its default implementation, this function *may be slow*.
     *
     * @return The previous element, or the parent element, if not found.
     */
    previousUp(): TreeNode | undefined {
        const p = this.parent();
        if (!p)
            return undefined;

        const i = this.index();
        if (i == undefined)
            return undefined;

        const nextInParent = p.children()[i - 1];
        if (nextInParent)
            return nextInParent;

        return p;
    }


    /**
     * The next element, including children.
     *
     * You should only use this function to iterate if you have reimplemented
     * [[index]] to be faster. In its default implementation, this function *may be slow*.
     */
    next(): TreeNode | undefined {
        if (this.children().length)
            return this.children()[0];

        return this.nextUp();
    }
    /**
     * The previous element, including children.
     *
     * You should only use this function to iterate if you have reimplemented
     * [[index]] to be faster. In its default implementation, this function *may be slow*
     */
    prev(): TreeNode | undefined {
        const prevSameLevel = this.prevSameLevel();
        if (prevSameLevel) {
            const prevCount = prevSameLevel.children().length;
            return prevCount ? prevSameLevel.children()[prevCount - 1] : prevSameLevel;
        }

        return this.previousUp();
    }
}

/**
 * An alias for TreeNode. Its implementation is the following:
 *
 * ```typescript
 * export class TN extends TreeNode {}
 * ```
 *
 * If you are tired of typing TreeNode the long way, use (**consistently**) `TN` instead.
 *
 * @export
 * @class TN
 */
export class TN extends TreeNode {}

import { BbTreeNode } from '../src/tree-node';

describe('BbTreeNode', () => {
    describe('constructor', () => {
        test("without parent", () => {
            expect(new BbTreeNode().parent).toBe(null);
        });
        test("with parent", () => {
            const parent = new BbTreeNode();
            expect(new BbTreeNode(parent).parent).toBe(parent);
            expect(parent.children.length).toBe(1);
            const child2 = new BbTreeNode(parent);
            expect(child2.parent).toBe(parent);
            expect(parent.children.length).toBe(2);
        });
    });
    describe('toString', () => {
        test("toString returns 'tree-node'", () => {
            expect(new BbTreeNode().toString).toBe('tree-node');
        });
    });
    describe('insertChildren', () => {
        const parent = new BbTreeNode();
        for (let i = 0; i < 3; i++) {
            new BbTreeNode(parent);
        }
        describe.each([
            [0, 2],
            [1, 2],
            [2, 2],
            [3, 1],
        ])('%s', (index: number, childCount: number) => {
            test(`index: ${index}`, () => {
                const childArray = [];
                for (let i = 0; i < childCount; i++) {
                    childArray[i] = new BbTreeNode();
                }
                const begLength = parent.children.length;
                parent.insertChildren(index, ...childArray);
                expect(parent.children.length).toBe(begLength + childCount);
                for (let i = 0; i < childCount; i++) {
                    expect(parent.children[index + i]).toBe(childArray[i]);
                }
            });
        } );
    });
    describe('appendChildren', () => {
        const parent = new BbTreeNode();
        for (let i = 0; i < 3; i++) {
            new BbTreeNode(parent);
        }
        describe.each([
            [1],
            [2],
            [3]
        ])('%s', (childCount: number) => {
            test(`childCount: ${childCount}`, () => {
                const childArray = [];
                for (let i = 0; i < childCount; i++) {
                    childArray[i] = new BbTreeNode();
                }
                const begLength = parent.children.length;
                parent.appendChildren(...childArray);
                expect(parent.children.length).toBe(begLength + childCount);
                for (let i = 0; i < childCount; i++) {
                    expect(parent.children[begLength + i]).toBe(childArray[i]);
                }
            });
        });
    });
    describe('prependChildren', () => {
        const parent = new BbTreeNode();
        for (let i = 0; i < 3; i++) {
            new BbTreeNode(parent);
        }
        describe.each([
            [1],
            [2],
            [3]
        ])('%s', (childCount: number) => {
            test(`childCount: ${childCount}`, () => {
                const childArray = [];
                for (let i = 0; i < childCount; i++) {
                    childArray[i] = new BbTreeNode();
                }
                const begLength = parent.children.length;
                parent.prependChildren(...childArray);
                expect(parent.children.length).toBe(begLength + childCount);
                for (let i = 0; i < childCount; i++) {
                    expect(parent.children[i]).toBe(childArray[i]);
                }
            });
        });
    });
    describe('prependChild', () => {
        test('prepend to root', () => {
            const root = new BbTreeNode();
            root.prependChild(new BbTreeNode());
            expect(root.children.length).toEqual(1);
            const child2 = new BbTreeNode();
            root.prependChild(child2);
            expect(root.children.length).toEqual(2);
            expect(root.children[0]).toBe(child2);
        });
    });
    describe('appendChild', () => {
        test('append to root', () => {
            const root = new BbTreeNode();
            root.appendChild(new BbTreeNode());
            expect(root.children.length).toEqual(1);
            const child2 = new BbTreeNode();
            root.appendChild(child2);
            expect(root.children.length).toEqual(2);
            expect(root.children[1]).toBe(child2);
        });
    });

    describe('Needs a tree for testing', () => {
        test('isRoot', () => {
            const root = new BbTreeNode().appendChildren(
                new BbTreeNode().appendChildren(
                    new BbTreeNode()),
                new BbTreeNode());
            expect(root.isRoot()).toBe(true);
            expect(root.children[1].isRoot()).toBe(false);
            expect(root.children[0].isRoot()).toBe(false);
            expect(root.children[0].children[0].isRoot()).toBe(false);
        });
        test('isLeaf', () => {
            const root = new BbTreeNode().appendChildren(
                new BbTreeNode().appendChildren(
                    new BbTreeNode()),
                new BbTreeNode());
            expect(root.isLeaf()).toBe(false);
            expect(root.children[1].isLeaf()).toBe(true);
            expect(root.children[0].isLeaf()).toBe(false);
            expect(root.children[0].children[0].isLeaf()).toBe(true);
        });
        test('drop', () => {
            const root = new BbTreeNode().appendChildren(
                new BbTreeNode().appendChildren(
                    new BbTreeNode()),
                new BbTreeNode());
            const dropped = root.children[0].drop();
            expect(dropped.parent).toBe(null);
            expect(root.children.length).toBe(1);
        });
        test('change parent', () => {
            const root = new BbTreeNode().appendChildren(
                new BbTreeNode().appendChildren(
                    new BbTreeNode()),
                new BbTreeNode());
            const changed = root.children[0];
            changed.changeParent(root.children[1]);
            expect(changed.parent).toBe(root.children[0]);
            expect(root.children.length).toBe(1);
        });
        describe('walk', () => {
            test('before', () => {
                class Before extends BbTreeNode {
                    before = false;
                }
                const root = new Before().appendChildren(
                    new Before().appendChildren(
                        new Before()),
                    new Before());
                Before.walk(root, (node) => {
                    (node as Before).before = true;
                });
                const flattened = [root, root.children[0], root.children[1], root.children[0].children[0]] as Before[];
                flattened.forEach((child: Before) => {
                    expect(child.before).toBe(true);
                });
            });
            test('after', () => {
                class After extends BbTreeNode {
                    after = false;
                }
                const root = new After().appendChildren(
                    new After().appendChildren(
                        new After()),
                    new After());
                After.walk(root, (node) => {
                    (node as After).after = true;
                });
                const flattened = [root, root.children[0], root.children[1], root.children[0].children[0]] as After[];
                flattened.forEach((child: After) => {
                    expect(child.after).toBe(true);
                });
            });
            test('after and before', () => {
                class Both extends BbTreeNode {
                    before = false;
                    after = false;
                }
                const root = new Both().appendChildren(
                    new Both().appendChildren(
                        new Both()),
                    new Both());
                Both.walk(root, (node) => {
                    (node as Both).before = true;
                    (node as Both).after = true;
                });
                const flattened = [root, root.children[0], root.children[1], root.children[0].children[0]] as Both[];
                flattened.forEach((child: Both) => {
                    expect(child.before).toBe(true);
                    expect(child.after).toBe(true);
                });
            });
        });
        test('flatten', () => {
            const root = new BbTreeNode().appendChildren(
                            new BbTreeNode().appendChildren(
                                new BbTreeNode()),
                            new BbTreeNode());
            const flattened = BbTreeNode.flatten(root);
            BbTreeNode.walk(root, (node) => {
                expect(flattened.includes(node));
            });
        });
        test('moveDeeper', () => {
            const root = new BbTreeNode().appendChildren(
                            new BbTreeNode().appendChildren(
                                new BbTreeNode()),
                            new BbTreeNode());
            const newNode = new BbTreeNode();
            const oldNode = root.children[0].children[0].moveDeeper(newNode);
            expect(root.children[0].children[0].children.length).toBe(1);
            expect(root.children.length).toBe(2);
            expect(root.children[0].children[0].children.includes(oldNode)).toBe(true);
        });
        test('replaceWith', () => {
            const root = new BbTreeNode().appendChildren(
                            new BbTreeNode().appendChildren(
                                new BbTreeNode()),
                            new BbTreeNode());
            const newNode = new BbTreeNode();
            const oldNode = root.children[0].children[0].replaceWith(newNode);
            expect(root.children[0].children[0].children.length).toBe(0);
            expect(root.children[0].children.length).toBe(1);
            expect(root.children[0].children[0]).toBe(newNode);
            expect(root.children.length).toBe(2);
            expect(oldNode.parent).toBe(null);
        });
        test('index', () => {
            const root = new BbTreeNode().appendChildren(
                new BbTreeNode().appendChildren(
                    new BbTreeNode()),
                new BbTreeNode());
            expect(root.index()).toBe(undefined);
            expect(root.children[0].index()).toBe(0);
            expect(root.children[0].children[0].index()).toBe(0);
            expect(root.children[1].index()).toBe(1);
        });
        test('nextSameLevel', () => {
            const a = new BbTreeNode();
            const a1 = new BbTreeNode();
            const b = new BbTreeNode();
            const root = new BbTreeNode();
            root.appendChildren(
                a.appendChildren(
                    a1),
                b);
            expect(root.nextSameLevel()).toBe(undefined);
            expect(a.nextSameLevel()).toBe(b);
            expect(a1.nextSameLevel()).toBe(undefined);
            expect(b.nextSameLevel()).toBe(undefined);
        });
        test('prevSameLevel', () => {
            const a = new BbTreeNode();
            const a1 = new BbTreeNode();
            const b = new BbTreeNode();
            const root = new BbTreeNode();
            root.appendChildren(
                a.appendChildren(
                    a1),
                b);
            expect(root.prevSameLevel()).toBe(undefined);
            expect(a.prevSameLevel()).toBe(undefined);
            expect(a1.prevSameLevel()).toBe(undefined);
            expect(b.prevSameLevel()).toBe(a);
        });
        test('nextUp', () => {
            const a = new BbTreeNode();
            const a1 = new BbTreeNode();
            const b = new BbTreeNode();
            const root = new BbTreeNode();
            root.appendChildren(
                a.appendChildren(
                    a1),
                b);
            expect(root.nextUp()).toBe(undefined);
            expect(a.nextUp()).toBe(b);
            expect(a1.nextUp()).toBe(b);
            expect(b.nextUp()).toBe(undefined);
        });
        test('previousUp', () => {
            const a = new BbTreeNode();
            const a1 = new BbTreeNode();
            const b = new BbTreeNode();
            const root = new BbTreeNode();
            root.appendChildren(
                a.appendChildren(
                    a1),
                b);
            expect(root.previousUp()).toBe(undefined);
            expect(a.previousUp()).toBe(root);
            expect(a1.previousUp()).toBe(a);
            expect(b.previousUp()).toBe(a);
        });
        test('next', () => {
            const a = new BbTreeNode();
            const a1 = new BbTreeNode();
            const b = new BbTreeNode();
            const root = new BbTreeNode();
            root.appendChildren(
                a.appendChildren(
                    a1),
                b);
            expect(root.next()).toBe(a);
            expect(a.next()).toBe(a1);
            expect(a1.next()).toBe(b);
            expect(b.next()).toBe(undefined);
        });
        test('prev', () => {
            const a = new BbTreeNode();
            const a1 = new BbTreeNode();
            const b = new BbTreeNode();
            const root = new BbTreeNode();
            root.appendChildren(
                a.appendChildren(
                    a1),
                b);
            expect(root.prev()).toBe(undefined);
            expect(a.prev()).toBe(root);
            expect(a1.prev()).toBe(a);
            expect(b.prev()).toBe(a1);
        });
    });


});

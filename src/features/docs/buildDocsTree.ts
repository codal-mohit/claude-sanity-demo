export type DocsNavItem = {
  _id: string;
  title: string | null;
  slug: string | null;
  parentId: string | null;
};

export type DocsTreeNode = DocsNavItem & { children: DocsTreeNode[] };

// Builds a nested tree from a flat, already ordered list. Orphans (missing parent) become roots.
export function buildDocsTree(items: DocsNavItem[]): DocsTreeNode[] {
  const nodes = new Map<string, DocsTreeNode>(items.map((item) => [item._id, { ...item, children: [] }]));
  const roots: DocsTreeNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined;
    if (parent && parent !== node) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
}

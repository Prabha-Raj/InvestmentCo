const TreeNode = ({ node, level = 0 }) => {
  const isRoot = level === 0;

  return (
    <div className={`flex flex-col gap-4 relative ${!isRoot ? 'pl-6 ml-6 border-l-2 border-[#29382d]' : ''}`}>
      {!isRoot && <div className="absolute -left-6 top-6 w-6 h-0.5 bg-[#29382d]"></div>}

      <div className="flex items-center gap-4">
        <div className={`relative z-10 flex items-center justify-center rounded-full border border-white/10 ${isRoot ? 'size-12 border-primary border-2' : 'size-10 bg-[#29382d]'}`}>
          {isRoot ? (
            <span className="material-symbols-outlined text-white">person</span>
          ) : (
            <span className="text-text-secondary text-xs font-bold">{(node.username || '').slice(0, 2).toUpperCase()}</span>
          )}
        </div>

        <div className="flex flex-col">
          <span className={`${isRoot ? 'text-white font-bold' : 'text-text-secondary text-sm font-medium'}`}>
            {node.username} {isRoot && '(You)'}
          </span>
          <span className="text-xs text-text-secondary">
            {isRoot ? 'Root Node' : `Level ${level}`} • {node.referredUsers?.length || 0} Directs
          </span>
        </div>

        <span className="ml-auto text-primary text-sm font-medium"></span>
      </div>

      {node.referredUsers && node.referredUsers.length > 0 && (
        <div className="flex flex-col gap-4">
          {node.referredUsers.map((child) => (
            <TreeNode key={child._id || child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const normalize = (tree) => {
  if (!tree) return null;
  // backend returns { user: {...}, children: [...] }
  const build = (node) => {
    if (!node) return null;
    const username = node.username || node.user?.username || '';
    const id = node._id || node.user?._id || node.user?.id || node.id;
    const children = node.children || node.user?.children || [];
    return {
      _id: id,
      username,
      referredUsers: children.map((c) => build(c)).filter(Boolean)
    };
  };
  // If top-level is { user, children }
  if (tree.user) {
    const top = {
      _id: tree.user.id || tree.user._id,
      username: tree.user.username,
      referredUsers: (tree.children || []).map((c) => build(c)).filter(Boolean)
    };
    return top;
  }
  return build(tree);
};

const ReferralTree = ({ tree }) => {
  if (!tree) return <div className="text-text-secondary text-sm">Loading network...</div>;
  const normalized = normalize(tree);
  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[500px]">
        <TreeNode node={normalized} />
      </div>
    </div>
  );
};

export default ReferralTree;

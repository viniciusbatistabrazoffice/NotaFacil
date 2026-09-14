export function getInitials(name) {
  return (name ?? '?')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function filterUsers(users, search) {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return users;
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(normalized) ||
      user.email.toLowerCase().includes(normalized)
  );
}

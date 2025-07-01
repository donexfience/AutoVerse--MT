export const getUserId = (): string => {
  let userId = localStorage.getItem("noteapp-user-id");
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("noteapp-user-id", userId);
  }
  return userId;
};

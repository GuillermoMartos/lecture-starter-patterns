const CardEvent = {
  CREATE: "card:create",
  REORDER: "card:reorder",
  DELETE: "card:delete",
  CHANGE_DESCRIPTION: "card:change-description",
  RENAME: "card:rename",
  DUPLICATE: "card:duplicate",
} as const;

export { CardEvent };

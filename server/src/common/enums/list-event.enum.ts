const ListEvent = {
  GET: 'list:get',
  REORDER: 'list:reorder',
  UPDATE: 'list:update',
  CREATE: 'list:create',
  RENAME: 'list:rename',
  DELETE: 'list:delete',
} as const

type ListEventType = (typeof ListEvent)[keyof typeof ListEvent]

export { ListEvent, ListEventType }

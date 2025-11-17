export const TODO_STATUS = ['NotStarted', 'InProgress', 'Completed'] as const;
export type TodoStatusType = (typeof TODO_STATUS)[number];

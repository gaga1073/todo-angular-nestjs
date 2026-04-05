import { inject } from '@angular/core';
import { ENVIRONMENT, Environment } from '@/core/token/environment.token';

export const getEndpoints = () => {
  const { apiBaseUrl } = inject<Environment>(ENVIRONMENT);
  return {
    auth: {
      authentication: () => `${apiBaseUrl}/auth`,
      login: () => `${apiBaseUrl}/auth/login`,
      refreshToken: () => `${apiBaseUrl}/auth/refresh-token`,
      signup: () => `${apiBaseUrl}/auth/signup`,
      logout: () => `${apiBaseUrl}/auth/logout`,
      me: () => `${apiBaseUrl}/auth/me`,
    },
    user: {
      user: (userId: string) => `${apiBaseUrl}/users/${userId}`,
      users: () => `${apiBaseUrl}/users`,
      search: () => `${apiBaseUrl}/users/search`,
      usersByGroupId: (groupId: string) => `${apiBaseUrl}/groups/${groupId}/users`,
      usersByProjectId: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/users`,
      sample: () => `${apiBaseUrl}/user/sample`,
    },
    group: {
      group: (groupId: string) => `${apiBaseUrl}/groups/${groupId}`,
      groups: () => `${apiBaseUrl}/groups`,
      search: () => `${apiBaseUrl}/groups/search`,
      groupsByUserId: (userId: string) => `${apiBaseUrl}/users/${userId}/groups`,
    },
    project: {
      project: (projectId: string) => `${apiBaseUrl}/projects/${projectId}`,
      projects: () => `${apiBaseUrl}/projects`,
      search: () => `${apiBaseUrl}/projects/search`,
    },
    todo: {
      todo: (projectId: string, todoId: string) =>
        `${apiBaseUrl}/projects/${projectId}/todos/${todoId}`,
      todos: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/todos`,
      search: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/todos/search`,
    },
  } as const;
};

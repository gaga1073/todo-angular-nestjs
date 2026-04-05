export const AUTHENTICATION_PATHS = {
  base: 'auth',
  login: 'login',
  signup: 'sign-up',
};

export const AUTHENTICATION_URLs = {
  login: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.login}`,
  signup: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.signup}`,
};

export const USER_PATHS = {
  base: 'user',
  list: 'list',
};

export const USER_URLS = {
  user: `${USER_PATHS.base}`,
  list: `${USER_PATHS.base}/${USER_PATHS.list}`,
};

export const GROUP_PATHS = {
  base: 'group',
  list: 'list',
};

export const GROUP_URLS = {
  user: `${GROUP_PATHS.base}`,
  list: `${GROUP_PATHS.base}/${GROUP_PATHS.list}`,
};

export const PROJECT_PATHS = {
  base: 'projects',
  list: 'list',
};

export const PROJECT_URLs = {
  project: `${PROJECT_PATHS.base}`,
  list: `${PROJECT_PATHS.base}/${PROJECT_PATHS.list}`,
};

export const TODO_PATHS = {
  base: 'todos',
  detail: 'detail',
};

export const TODO_URLs = {
  todoDetail: `${TODO_PATHS.base}/${TODO_PATHS.detail}`,
};

export const HOME_PATHS = {
  base: 'home',
};

export const HOME_URLs = {
  home: `${HOME_PATHS.base}`,
};

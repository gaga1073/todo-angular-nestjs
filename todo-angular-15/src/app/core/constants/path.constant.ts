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

export const TODO_PATHS = {
  base: 'todo',
  home: 'home',
  detail: 'detail',
};

export const TODO_URLs = {
  home: `${TODO_PATHS.base}/${TODO_PATHS.home}`,
  todoDetail: `${TODO_PATHS.base}/${TODO_PATHS.detail}`,
};

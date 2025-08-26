export const AUTHENTICATION_PATHS = {
  base: 'auth',
  login: 'login',
  signup: 'sign-up',
};

export const AUTHENTICATION_URLs = {
  login: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.login}`,
  signup: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.signup}`,
};

export const TODO_PATHS = {
  base: 'todo',
  home: 'home',
};

export const TODO_URLs = {
  home: `${TODO_PATHS.base}/${TODO_PATHS.home}`,
};

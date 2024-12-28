export const configAPI = {
  appDomain: 'http://127.0.0.1:9091', // https://bot.veaba.me
  clientId: 'Iv1.f8c5b24e304d03c9',
  redirectAPI: '/api/github/auth/user',
  updateAPI: '/api/github/content/update',
  getContentAPI: '/api/github/content/get',
  githubOAuthUrl: 'https://github.com/login/oauth/authorize',
};

export const fetchOps: Record<string, string> = {
  mode: "cors",
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  redirect: "follow", // manual, *follow, error
  referrer: "no-referrer", // *client, no-referrer
};

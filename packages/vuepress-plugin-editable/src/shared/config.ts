const _appDomain = 'https://bot.veaba.me';

export const configAPI = {
	_appDomain,
  _clientId: 'Iv1.f8c5b24e304d03c9',
  _redirectAPI: '/api/github/auth/user',
  _updateAPI: '/api/github/content/update',
  _getContentAPI: '/api/github/content/get',
  _githubOAuthUrl: 'https://github.com/login/oauth/authorize',
};

export const fetchOps: Record<string, string> = {
	mode: "cors",
	cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
	redirect: "follow", // manual, *follow, error
	referrer: "no-referrer", // *client, no-referrer
};

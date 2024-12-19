const {resolve} = require("path");
const {_appDomain, _redirectAPI, _clientId, _updateAPI, _getContentAPI, _githubOAuthUrl} = require('./config');

module.exports = (options, ctx) => {
	const {appDomain, getContentAPI, updateAPI, redirectAPI, clientId,} = options;
	return {
		name: "vuepress-plugin-editable",
		extendMarkdown(md) {
			md.use(require("./line"), ctx);
		},
		extendPageData($page) {
			const {_context, _filePath = ""} = $page;
			const cwdLen = _context.cwd.length;
			$page.remoteRelativePath = _filePath.substr(cwdLen).replace(/\\/g, "/");
			const tempUpdateAPI = (appDomain || _appDomain) + (updateAPI || _updateAPI);
			const tempGetContentAPI = (appDomain || _appDomain) + (getContentAPI || _getContentAPI);
			const tempRedirectAPI = (appDomain || _appDomain) + (redirectAPI || _redirectAPI);
			$page.$editable = {
				appDomain: appDomain || _appDomain,
				getContentAPI: tempGetContentAPI,
				updateAPI: tempUpdateAPI,
				redirectAPI: tempRedirectAPI,
				clientId: clientId || _clientId,
				githubOAuthUrl: _githubOAuthUrl
			};
		},
		enhanceAppFiles: [resolve(__dirname, "enhanceAppFiles.js")],
		globalUIComponents: ["EditableReview", "EditableLoading", "EditablePoptip"],
		define: {
			CAN_REVIEW: options.canReview,
		},
		clientRootMixin: resolve(__dirname, "client.js"),
	};
};

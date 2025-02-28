
export interface BtnWords {
  apply?: string;
  restore?: string;
  update?: string;
  oAuth?: string;
}

export interface PostSingleData {
  (owner: string, repo: string, path: string, content: string, line: number): void
}

export interface GetOriginContent {
  (owner: string, repo: string, path: string): void
}

export interface ExtendPages {
  appDomain: string
  getContentAPI: string
  updateAPI: string,
  redirectAPI: string,
  clientId: string
  githubOAuthUrl: string,
}

// CSS
declare module '*.css' { }
declare module '*.css';

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

export interface Options {
  appDomain?: string;
  getContentAPI?: string;
  updateAPI?: string;
  redirectAPI?: string;
  clientId?: string;
  canReview?: boolean;
}


export interface OwnerRepo {
  owner: string,
  repo: string
}

export interface PoptipData {
  success: boolean,
  data: any,
  message: string
  not_found_repo_link?: string
}
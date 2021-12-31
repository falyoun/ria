export interface ISwagger {
  title: string;
  version: string;
  description: string;
  tag: string;
  api: string;
  useAuth?: {
    username: string;
    password: string;
  };
}

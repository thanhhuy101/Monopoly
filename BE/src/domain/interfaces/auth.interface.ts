export interface IAuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  emoji?: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    displayName: string;
    emoji: string;
    avatarUrl?: string;
    level: number;
    experience: number;
    coins: number;
    isOnline: boolean;
  };
  tokens?: IAuthTokens;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export interface IAuthService {
  register(userData: IRegisterRequest): Promise<IAuthResponse>;
  login(credentials: ILoginRequest): Promise<IAuthResponse>;
  verifyToken(token: string): Promise<IJwtPayload>;
  refreshToken(refreshToken: string): Promise<IAuthTokens>;
  logout(userId: string): Promise<void>;
}

export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

export interface IJwtService {
  generateTokens(payload: IJwtPayload): IAuthTokens;
  verifyToken(token: string): IJwtPayload;
  generateAccessToken(payload: IJwtPayload): string;
  generateRefreshToken(payload: IJwtPayload): string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  findByUsername(username: string): Promise<any>;
  findById(id: string): Promise<any>;
  create(userData: any): Promise<any>;
  update(id: string, updates: any): Promise<any>;
  setOnlineStatus(id: string, isOnline: boolean): Promise<void>;
}

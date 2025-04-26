interface TypeOrmJwtConfig {
  secret: string;
  expiresIn: string;
  issuer: string;
  algorithm: string;
}

declare class JwtConfig {
  constructor(env: NodeJS.ProcessEnv);
  public getValue(key: string, throwOnMissing?: boolean): string;
  public ensureValues(keys: string[]): JwtConfig;
  public getTypeOrmConfig(): TypeOrmJwtConfig;
}

declare const jwtConfig: JwtConfig;

export { jwtConfig };

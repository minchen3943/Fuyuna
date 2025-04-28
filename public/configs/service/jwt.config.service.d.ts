import { JwtModuleOptions } from '@nestjs/jwt';

declare class JwtConfig {
  constructor(env: NodeJS.ProcessEnv);
  public getValue(key: string, throwOnMissing?: boolean): string;
  public ensureValues(keys: string[]): JwtConfig;
  public getTypeOrmConfig(): JwtModuleOptions;
}

declare const jwtConfig: JwtConfig;

export { jwtConfig };

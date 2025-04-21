import { TypeOrmModuleOptions } from "@nestjs/typeorm";

declare class PostgresConfig {
  constructor(env: { [k: string]: string | undefined });
  private getValue(key: string, throwOnMissing?: boolean): string;
  public ensureValues(keys: string[]): this;
  public getPort(): string;
  public isProduction(): boolean;
  public getTypeOrmConfig(): TypeOrmModuleOptions;
}

declare const postgresConfig: PostgresConfig;

export { postgresConfig };

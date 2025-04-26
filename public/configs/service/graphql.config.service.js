import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

class GraphqlConfig {
  constructor(env) {
    this.env = env;
  }

  getValue(key, throwOnMissing = true) {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  ensureValues(keys) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  isProduction() {
    const mode = this.getValue('NODE_ENV', false);
    return mode != 'development';
  }
  isSortSchema() {
    const sortSchema = this.getValue('GRAPHQL_SORT_SCHEMA', true);
    return sortSchema == 'true';
  }

  getGraphqlConfig() {
    return {
      autoSchemaFile: this.getValue('GRAPHQL_AUTO_SCHEMA_FILE'),
      sortSchema: this.isSortSchema(),
      playground: !this.isProduction(),
      debug: !this.isProduction(),
    };
  }
}

const graphqlConfig = new GraphqlConfig(process.env).ensureValues([
  'GRAPHQL_AUTO_SCHEMA_FILE',
]);

export { graphqlConfig };

import configs from '../configs.json' with { type: 'json' };
class InfoConfig {
  getNameConfig() {
    const infoConfig = configs.info.name;
    if (!infoConfig) {
      throw new Error('Metadata config not found');
    }
    return infoConfig;
  }
  getLine1Config() {
    const infoConfig = configs.info.line1;
    if (!infoConfig) {
      throw new Error('Metadata config not found');
    }
    return infoConfig;
  }
  getLine2Config() {
    const infoConfig = configs.info.line2;
    if (!infoConfig) {
      throw new Error('Metadata config not found');
    }
    return infoConfig;
  }
}

const infoConfig = new InfoConfig();
export { infoConfig };

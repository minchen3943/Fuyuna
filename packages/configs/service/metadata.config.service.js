import configs from '../configs.json' with { type: 'json' };
class MetaDataConfig {
  getMetadataConfig() {
    const metadataConfig = configs.webMetadata;
    if (!metadataConfig) {
      throw new Error('Metadata config not found');
    }
    return {
      title: {
        template: '%s - ' + metadataConfig.title,
        default: metadataConfig.title,
      },
      description: metadataConfig.description,
      keywords: metadataConfig.keywords,
    };
  }
}

const metadataConfig = new MetaDataConfig();
export { metadataConfig };

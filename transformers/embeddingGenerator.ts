import { defineTransformer } from '@nuxt/content';
import { pipeline } from '@xenova/transformers';
import type { FeatureExtractionPipeline, Tensor } from '@xenova/transformers';
import { tryCatch } from '../shared/utils/try-catch'
import { EMBEDDING_MODEL_NAME } from '../shared/constants/models'
import type { BlogCollectionItem } from '@nuxt/content';

let embedder: FeatureExtractionPipeline | null = null;

console.log('[Embedding Transformer] Initializing...');

export default defineTransformer({
  name: 'embeddingGenerator',
  extensions: ['.md'],
  async transform(content, _options) {
    const blogContent = content as unknown as BlogCollectionItem;
    
    if (!blogContent.title || !blogContent.description) {
      return {
        ...blogContent,
        embedding: null
      };
    }

    let textToEmbed = blogContent.title || '';
    if (blogContent.description) {
      textToEmbed += (textToEmbed ? '. ' : '') + blogContent.description;
    }
    textToEmbed = textToEmbed.trim();

    if (!textToEmbed) {
      return {
        ...blogContent,
        embedding: null
      };
    }

    if (!embedder) {
      console.log(`[Embedding Transformer] Loading model: ${EMBEDDING_MODEL_NAME}...`);
      embedder = await pipeline('feature-extraction', EMBEDDING_MODEL_NAME) as FeatureExtractionPipeline;
      console.log('[Embedding Transformer] Model loaded successfully.');
    }

    const embeddingResult = await tryCatch((async () => {
      const output = await embedder!(textToEmbed, { pooling: 'mean', normalize: true });
      return Array.from((output as Tensor).data as Float32Array);
    })());
    
    if (embeddingResult.error) {
      const errorMessage = embeddingResult.error instanceof Error ? embeddingResult.error.message : 'Unknown error';
      console.error(`[Embedding Transformer] Error generating embedding for ${blogContent.path}:`, embeddingResult.error);
      return {
        ...blogContent,
        embedding: null,
        embeddingError: `Embedding generation failed: ${errorMessage}`
      };
    }
    
    return {
      ...blogContent,
      embedding: embeddingResult.data
    };
  }
});
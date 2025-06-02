import { defineTransformer } from '@nuxt/content';
import { pipeline } from '@xenova/transformers';
import { tryCatch } from '../shared/utils/try-catch'
import { EMBEDDING_MODEL_NAME } from '../shared/constants/models'
import type { BlogCollectionItem } from '@nuxt/content';

interface EmbeddingPipeline {
  (text: string, options: { pooling: string; normalize: boolean }): Promise<{ data: Float32Array }>;
}

const combineTextForEmbedding = (content: BlogCollectionItem): string => {
  let textToEmbed = content.title || '';
  
  if (content.description) {
    textToEmbed += (textToEmbed ? '. ' : '') + content.description;
  }

  return textToEmbed.trim();
};

const shouldSkipContent = (content: BlogCollectionItem): boolean => {
  return !content.title || !content.description;
};

const createEmbeddingFromOutput = (output: { data: Float32Array }): number[] => {
  return Array.from(output.data);
};

let embedder: EmbeddingPipeline | null = null;

const logInfo = (message: string): void => {
  console.log(`[Embedding Transformer] ${message}`);
};

const logError = (message: string, error?: unknown): void => {
  console.error(`[Embedding Transformer] ${message}`, error);
};

const loadModel = async (): Promise<EmbeddingPipeline> => {
  logInfo(`Loading model: ${EMBEDDING_MODEL_NAME}...`);
  const pipelineInstance = await pipeline('feature-extraction', EMBEDDING_MODEL_NAME);
  logInfo('Model loaded successfully.');
  return pipelineInstance as EmbeddingPipeline;
};

const getOrLoadModel = async (): Promise<EmbeddingPipeline> => {
  if (!embedder) {
    embedder = await loadModel();
  }
  return embedder;
};

const generateEmbedding = async (text: string): Promise<number[]> => {
  const model = await getOrLoadModel();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return createEmbeddingFromOutput(output);
};

const setContentEmbedding = (
  content: BlogCollectionItem, 
  embedding: number[] | null, 
  error?: string
) => {
  return {
    ...content,
    embedding,
    ...(error && { embeddingError: error })
  };
};

logInfo('Initializing...');

export default defineTransformer({
  name: 'embeddingGenerator',
  extensions: ['.md'],
  async transform(content, _options) {
    const blogContent = content as unknown as BlogCollectionItem;
    
    if (shouldSkipContent(blogContent)) {
      return setContentEmbedding(blogContent, null);
    }

    const textToEmbed = combineTextForEmbedding(blogContent);
    if (!textToEmbed) {
      return setContentEmbedding(blogContent, null);
    }

    const result = await tryCatch(generateEmbedding(textToEmbed));
    
    if (result.error) {
      const errorMessage = result.error instanceof Error ? result.error.message : 'Unknown error';
      logError(`Error generating embedding for ${blogContent.path}:`, result.error);
      return setContentEmbedding(blogContent, null, `Embedding generation failed: ${errorMessage}`);
    }
    
    return setContentEmbedding(blogContent, result.data);
  }
});
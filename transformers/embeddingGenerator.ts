// server/transformers/embeddingGenerator.ts
import { defineTransformer } from '@nuxt/content';
import { pipeline } from '@xenova/transformers';
import type { BlogPost } from '~/schema/blog';

const modelName = 'Xenova/bge-small-en-v1.5'; // Updated to use the bge-small-en-v1.5 model

// Types
interface ContentNode {
  type: string;
  value?: string;
  children?: ContentNode[];
}

interface ContentBody {
  children?: ContentNode[];
}

interface BlogContent extends BlogPost {
  id: string;
  body?: ContentBody;
  _path?: string;
  [key: string]: unknown;
}

interface EmbeddingPipeline {
  (text: string, options: { pooling: string; normalize: boolean }): Promise<{ data: Float32Array }>;
}

// Functional Core - Pure Functions
const extractTextFromNodes = (nodes: ContentNode[]): string => {
  let text = '';
  for (const node of nodes) {
    if (node.type === 'text' && node.value) {
      text += node.value + ' ';
    } else if (node.children && Array.isArray(node.children)) {
      text += extractTextFromNodes(node.children);
    }
  }
  return text;
};

const extractBodyText = (body: ContentBody): string => {
  if (!body.children || !Array.isArray(body.children)) {
    return '';
  }
  return extractTextFromNodes(body.children).replace(/\s+/g, ' ').trim();
};

const combineTextForEmbedding = (content: BlogContent): string => {
  let textToEmbed = content.title || '';
  
  if (content.description) {
    textToEmbed += (textToEmbed ? '. ' : '') + content.description;
  }

  if (content.body) {
    const bodyText = extractBodyText(content.body);
    if (bodyText) {
      textToEmbed += (textToEmbed ? '. ' : '') + bodyText.substring(0, 1000);
    }
  }

  return textToEmbed.trim();
};

const shouldSkipContent = (content: BlogContent): boolean => {
  // Skip content without required fields
  return !content.title || !content.description;
};

const createEmbeddingFromOutput = (output: { data: Float32Array }): number[] => {
  return Array.from(output.data);
};

// Imperative Shell - Side Effects
let embedder: EmbeddingPipeline | null = null;

const logInfo = (message: string): void => {
  console.log(`[Embedding Transformer] ${message}`);
};

const logError = (message: string, error?: unknown): void => {
  console.error(`[Embedding Transformer] ${message}`, error);
};

const loadModel = async (): Promise<EmbeddingPipeline> => {
  logInfo(`Loading model: ${modelName}...`);
  const pipelineInstance = await pipeline('feature-extraction', modelName);
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
  content: BlogContent, 
  embedding: number[] | null, 
  error?: string
) => {
  return {
    ...content,
    embedding,
    ...(error && { embeddingError: error })
  };
};

// Main Transformer
logInfo('Initializing...');

export default defineTransformer({
  name: 'embeddingGenerator',
  extensions: ['.md'],
  async transform(content, _options) {
    const blogContent = content as BlogContent;
    
    if (shouldSkipContent(blogContent)) {
      return setContentEmbedding(blogContent, null);
    }

    const textToEmbed = combineTextForEmbedding(blogContent);
    if (!textToEmbed) {
      return setContentEmbedding(blogContent, null);
    }

    try {
      const embedding = await generateEmbedding(textToEmbed);
      return setContentEmbedding(blogContent, embedding);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logError(`Error generating embedding for ${blogContent._path}:`, error);
      return setContentEmbedding(blogContent, null, `Embedding generation failed: ${errorMessage}`);
    }
  }
});
/**
 * Calculates the cosine similarity between two vectors.
 * 
 * Cosine similarity measures the cosine of the angle between two non-zero vectors
 * in an inner product space. It ranges from -1 to 1, where:
 * - 1 indicates vectors point in the same direction (most similar)
 * - 0 indicates vectors are orthogonal (no similarity)
 * - -1 indicates vectors point in opposite directions (most dissimilar)
 * 
 * This is commonly used in text analysis, recommendation systems, and machine learning
 * to measure similarity between feature vectors or embeddings.
 * 
 * @param vecA - First vector as an array of numbers
 * @param vecB - Second vector as an array of numbers
 * @returns The cosine similarity between the two vectors (number between -1 and 1)
 * @throws {Error} When vectors have different dimensions
 * 
 * @example
 * ```typescript
 * const vectorA = [1, 2, 3];
 * const vectorB = [4, 5, 6];
 * const similarity = cosineSimilarity(vectorA, vectorB);
 * console.log(similarity); // ~0.974 (high similarity)
 * ```
 */
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    if (vecA.length !== vecB.length) {
      throw new Error(`Vector dimensions don't match: ${vecA.length} vs ${vecB.length}`);
    }
    
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * (vecB[i] ?? 0), 0);
    const magnitudeA = Math.hypot(...vecA);
    const magnitudeB = Math.hypot(...vecB);
    
    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }
     
    return dotProduct / (magnitudeA * magnitudeB);
  }
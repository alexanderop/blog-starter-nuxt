import { pipeline, cos_sim } from '@xenova/transformers';

// Create a feature-extraction pipeline
const extractor = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');

// List of documents you want to embed
const texts = [
    'Hello world.',
    'The giant panda (Ailuropoda melanoleuca), sometimes called a panda bear or simply panda, is a bear species endemic to China.',
    'I love pandas so much!',
];

// Compute sentence embeddings
const embeddings = await extractor(texts, { pooling: 'mean', normalize: true });

// Prepend recommended query instruction for retrieval.
const query_prefix = 'Represent this sentence for searching relevant passages: '
const query = query_prefix + 'What is a panda?';
const query_embeddings = await extractor(query, { pooling: 'mean', normalize: true });

// Sort by cosine similarity score
const scores = embeddings.tolist().map(
    (embedding, i) => ({
        id: i,
        score: cos_sim(query_embeddings.data, embedding),
        text: texts[i],
    })
).sort((a, b) => b.score - a.score);

console.log('\n🔍 Similarity Search Results:');
console.log('=' .repeat(50));
console.log(`Query: "${query.replace(query_prefix, '')}"\n`);

scores.forEach((result, index) => {
    const rank = index + 1;
    const percentage = (result.score * 100).toFixed(1);
    const scoreBar = '█'.repeat(Math.floor(result.score * 20)) + '░'.repeat(20 - Math.floor(result.score * 20));
    
    console.log(`${rank}. [${percentage}%] ${scoreBar}`);
    console.log(`   "${result.text}"`);
    console.log(`   Score: ${result.score.toFixed(4)}\n`);
});

console.log('=' .repeat(50));

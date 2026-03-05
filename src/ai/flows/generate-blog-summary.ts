'use server';
/**
 * @fileOverview A Genkit flow for generating a concise summary of blog post content using AI.
 *
 * - generateBlogSummary - A function that handles the blog summary generation process.
 * - GenerateBlogSummaryInput - The input type for the generateBlogSummary function.
 * - GenerateBlogSummaryOutput - The return type for the generateBlogSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogSummaryInputSchema = z.object({
  content: z.string().describe('The full content of the blog post to summarize.'),
});
export type GenerateBlogSummaryInput = z.infer<typeof GenerateBlogSummaryInputSchema>;

const GenerateBlogSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the blog post content.'),
});
export type GenerateBlogSummaryOutput = z.infer<typeof GenerateBlogSummaryOutputSchema>;

export async function generateBlogSummary(
  input: GenerateBlogSummaryInput
): Promise<GenerateBlogSummaryOutput> {
  return generateBlogSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogSummaryPrompt',
  input: {schema: GenerateBlogSummaryInputSchema},
  output: {schema: GenerateBlogSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with generating concise and informative summaries of blog posts.

Summarize the following blog post content in 2-3 sentences. The summary should capture the main idea and key points, suitable for display in a public feed or search results.

Blog Post Content:
---
{{{content}}}
---`,
});

const generateBlogSummaryFlow = ai.defineFlow(
  {
    name: 'generateBlogSummaryFlow',
    inputSchema: GenerateBlogSummaryInputSchema,
    outputSchema: GenerateBlogSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

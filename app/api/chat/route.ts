import { NextResponse } from 'next/server'
import { StreamingTextResponse } from 'ai'
import { createChatMessage } from '../../config/prompts'
import type { OllamaResponse } from '@/app/types/chat'

const MAX_RESPONSE_LENGTH = 300;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()
        
        console.log('🚀 Ollama Request:', {
            model: process.env.SELECTED_MODEL,
            messages: messages.slice(-1),
            options: {
                num_predict: MAX_RESPONSE_LENGTH
            }
        })
        
        const response = await fetch(`${process.env.OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: process.env.SELECTED_MODEL,
                messages,
                stream: true,
                options: {
                    num_predict: MAX_RESPONSE_LENGTH,
                    stop: ["\n\n", "Human:", "Assistant:", "USER:", "ASSISTANT:"],
                    temperature: 0.7,
                    top_k: 50,
                    top_p: 0.7,
                    repeat_penalty: 1.1
                }
            })
        })

        if (!response.ok) {
            throw new Error(`Ollama error: ${response.status}`)
        }

        let totalLength = 0;
        let currentSentence = '';
        let buffer = '';

        // Transform the stream to extract just the content and limit length
        const transformStream = new TransformStream({
            async transform(chunk, controller) {
                try {
                    const text = new TextDecoder().decode(chunk)
                    const lines = text.split('\n').filter(Boolean)
                    
                    for (const line of lines) {
                        const json = JSON.parse(line) as OllamaResponse
                        console.log('📥 Ollama Raw Response:', json)

                        if (json.message?.content) {
                            // Accumulate content into current sentence
                            currentSentence += json.message.content;
                            
                            // If we have a complete word or sentence ending
                            if (/[\s.!?]$/.test(currentSentence)) {
                                const processedText = currentSentence
                                    .replace(/USER:|ASSISTANT:|Human:|Assistant:/g, '')
                                    .replace(/([,.!?])/g, '$1 ')
                                    .replace(/\s+/g, ' ')
                                    .trim();

                                buffer += processedText;
                                currentSentence = '';

                                // Only send complete sentences
                                if (/[.!?]$/.test(processedText)) {
                                    if (totalLength + buffer.length <= MAX_RESPONSE_LENGTH) {
                                        totalLength += buffer.length;
                                        controller.enqueue(new TextEncoder().encode(buffer));
                                        buffer = '';
                                    } else {
                                        const remainingSpace = MAX_RESPONSE_LENGTH - totalLength;
                                        if (remainingSpace > 0) {
                                            const lastSentence = buffer.match(/[^.!?]+[.!?]/g)?.pop() || buffer;
                                            controller.enqueue(new TextEncoder().encode(lastSentence));
                                        }
                                        controller.terminate();
                                        break;
                                    }
                                }
                            }
                        }

                        if (json.done) {
                            // Send any remaining buffer
                            if (buffer && totalLength + buffer.length <= MAX_RESPONSE_LENGTH) {
                                controller.enqueue(new TextEncoder().encode(buffer));
                            }
                            controller.terminate();
                        }
                    }
                } catch (e) {
                    console.error('Stream transform error:', e)
                }
            }
        })

        return new StreamingTextResponse(response.body!.pipeThrough(transformStream))
    } catch (error) {
        console.error('Chat API Error:', error)
        return NextResponse.json({ error: 'Chat service error' }, { status: 500 })
    }
}
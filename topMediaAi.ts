const API_KEY = process.env.TOPMEDIAI_API_KEY;
const BASE_URL = 'https://api.topmediai.com/v1';

export async function textToSpeech(text: string, voiceId: string) {
    // Removed console log as per instructions

    try {
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text.trim(),
                speaker: voiceId.trim(),
                language: 'en',
                output_format: 'mp3',
                speed: 1.0,
                stability: 0.5,
                similarity: 0.75
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}\nResponse: ${errorText}`);
        }

        const data = await response.json();


        if (data.data?.oss_url) {
            return { audio_url: data.data.oss_url };
        } else {
            throw new Error('No oss_url in response data');
        }
    } catch (error) {

        throw error;
    }
} 
import { NextResponse } from 'next/server'

const MAX_TTS_LENGTH = 500

const VOICE_ID = process.env.TOPMEDIAI_VOICE_ID
if (!VOICE_ID) {
    console.warn('⚠️ No voice ID configured in env variables')
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Truncate text to max length
        const truncatedText = body.text.slice(0, MAX_TTS_LENGTH)
        
        // Use configured voice ID if none provided in request
        const speaker = body.speaker || VOICE_ID
        if (!speaker) {
            throw new Error('No speaker ID provided or configured')
        }
        
        // Ensure all required fields are present
        const requestBody = {
            text: truncatedText,
            speaker,
            language: body.language || 'en',
            output_format: body.output_format || 'mp3',
            speed: body.speed || 1.0,
            stability: body.stability || 0.5,
            similarity: body.similarity || 0.75
        }

        console.log('📝 Making request to TopMediaAI:', {
            url: 'https://api.topmediai.com/v1/text2speech',
            apiKey: process.env.TOPMEDIAI_API_KEY ? 'Present' : 'Missing',
            body: requestBody,
            originalLength: body.text.length,
            truncatedLength: truncatedText.length
        })

        const response = await fetch('https://api.topmediai.com/v1/text2speech', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.TOPMEDIAI_API_KEY!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })

        const responseText = await response.text()
        console.log('📡 TopMediaAI Response:', {
            status: response.status,
            text: responseText
        })

        if (!response.ok) {
            throw new Error(`TTS API error: ${response.status}\n${responseText}`)
        }

        try {
            const data = JSON.parse(responseText)
            return NextResponse.json(data)
        } catch (e) {
            throw new Error(`Invalid JSON response: ${responseText}`)
        }

    } catch (error) {
        console.error('❌ TTS Route Error:', error)
        return NextResponse.json(
            { 
                error: 'TTS Service Error', 
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        )
    }
} 
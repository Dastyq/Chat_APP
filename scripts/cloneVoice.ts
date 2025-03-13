import dotenv from 'dotenv';
import nodeFetch from 'node-fetch';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import FormData from 'form-data';

dotenv.config({ path: './.env.local' });

const API_KEY = process.env.TOPMEDIAI_API_KEY;
const BASE_URL = 'https://api.topmediai.com/v1';

interface CloneResponse {
    speaker: string;
}

async function updateEnvFile(voiceId: string): Promise<void> {
    const envPath = './.env.local'
    try {
        let envContent = await fsPromises.readFile(envPath, 'utf8')
        
        // Update or add TOPMEDIAI_VOICE_ID
        if (envContent.includes('TOPMEDIAI_VOICE_ID=')) {
            envContent = envContent.replace(
                /TOPMEDIAI_VOICE_ID=.*/,
                `TOPMEDIAI_VOICE_ID=${voiceId}`
            )
        } else {
            envContent += `\nTOPMEDIAI_VOICE_ID=${voiceId}`
        }
        
        await fsPromises.writeFile(envPath, envContent)
        console.log('✅ Updated .env.local with new voice ID')
    } catch (error) {
        console.error('❌Failed to update .env file:', error)
    }
}

async function cloneVoice(audioFilePath: string, name: string, description: string): Promise<void> {
    try {
        console.log('API Key:', API_KEY ? 'Present' : 'Missing');
        console.log('Cloning voice...');
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('files', fs.createReadStream(audioFilePath));

        console.log('Making request to:', `${BASE_URL}/clone`);
        const response = await nodeFetch(`${BASE_URL}/clone`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY || '',
                ...formData.getHeaders()
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, error: ${errorText}`);
        }

        const data = await response.json() as CloneResponse;
        console.log('\nVoice Clone Result:');
        console.log('Speaker ID:', data.speaker);
        
        // Automatically update env file
        await updateEnvFile(data.speaker)
        
        console.log('\n✅ Voice ID has been automatically added to .env.local')
        console.log('🔄 Please restart your development server to apply changes')

    } catch (error) {
        console.error('Error:', error);
    }
}

// Usage example
const audioPath = process.argv[2];
const voiceName = process.argv[3] || 'Gary Gensler Voice';
const voiceDescription = process.argv[4] || 'Gary Gensler SEC Chairman voice clone';

if (!audioPath) {
    console.error('Please provide the path to an audio file.');
    console.log('Usage: npm run clone-voice <audioFilePath> [name] [description]');
    process.exit(1);
}

cloneVoice(audioPath, voiceName, voiceDescription); 
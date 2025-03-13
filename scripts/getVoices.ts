const dotenv = require('dotenv');
const nodeFetch = require('node-fetch');
const fs = require('fs/promises');
const path = require('path');

dotenv.config({ path: './.env.local' });

const API_KEY = process.env.TOPMEDIAI_API_KEY;
const BASE_URL = 'https://api.topmediai.com/v1';

interface ClonedVoice {
    name: string;
    speaker: string;
    description: string;
    files: string[];
}

interface ApiResponse {
    clone_voices: ClonedVoice[];
}

async function listClonedVoices() {
    try {
        console.log('🔑 API Key:', API_KEY ? 'Present' : 'Missing');
        
        console.log('🎯 Making request to:', `${BASE_URL}/clone_voices_list`);
        const response = await nodeFetch(`${BASE_URL}/clone_voices_list`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY || '',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, error: ${errorText}`);
        }

        const data = await response.json() as ApiResponse;
        
        // Save response to a file for debugging
        await fs.writeFile(
            path.join(process.cwd(), 'voices-response.json'), 
            JSON.stringify(data, null, 2)
        );
        
        console.log('\n📢 Your Cloned Voices:');
        
        if (data.clone_voices && Array.isArray(data.clone_voices)) {
            data.clone_voices.forEach((voice: ClonedVoice) => {
                console.log('\n----------------------------------------');
                console.log(`Name: ${voice.name}`);
                console.log(`Speaker ID: ${voice.speaker}`);
                console.log(`Description: ${voice.description}`);
                console.log('Audio Files:', voice.files);
                console.log('----------------------------------------');
            });
            
            console.log(`\n✅ Total Voices: ${data.clone_voices.length}`);
        } else {
            console.log('❌ No cloned voices found or unexpected response format:');
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Run the function
listClonedVoices();
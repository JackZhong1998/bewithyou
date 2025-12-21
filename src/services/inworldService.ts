// 开发环境使用代理，生产环境直接调用 API
const API_BASE = import.meta.env.DEV 
  ? '/api/inworld' 
  : 'https://api.inworld.ai';
const API_KEY = import.meta.env.VITE_INWORLD_API_KEY;
// 确保 WORKSPACE 格式正确：workspaces/{workspace_id}
const getWorkspace = () => {
  const ws = import.meta.env.VITE_INWORLD_WORKSPACE || 'default';
  return ws.startsWith('workspaces/') ? ws : `workspaces/${ws}`;
};
const WORKSPACE = getWorkspace();

const getAuthHeader = () => {
  // API key is already base64 encoded credentials
  return `Basic ${API_KEY}`;
};

export const cloneVoice = async (
  audioFile: File,
  displayName: string,
  langCode: string = 'AUTO',
  removeBackgroundNoise: boolean = false
): Promise<string> => {
  // Convert file to base64
  const base64Audio = await fileToBase64(audioFile);
  const audioData = base64Audio.split(',')[1] || base64Audio; // Remove data:audio/...;base64, prefix if present
  
  console.log('Cloning voice:', {
    displayName,
    langCode,
    fileSize: audioFile.size,
    audioDataLength: audioData.length,
    workspace: WORKSPACE,
    apiBase: API_BASE
  });

  const url = `${API_BASE}/voices/v1/${WORKSPACE}/voices:clone`;
  console.log('Request URL:', url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayName,
        langCode,
        voiceSamples: [
          {
            audioData: audioData,
          },
        ],
        audioProcessingConfig: {
          removeBackgroundNoise,
        },
      }),
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Clone success:', data);
    return data.voice?.voiceId || data.voice?.name || '';
  } catch (error: any) {
    console.error('Clone voice error:', error);
    if (error.message) {
      throw error;
    }
    throw new Error(`克隆失败: ${error.message || '网络错误，请重试'}`);
  }
};

export const synthesizeSpeech = async (
  text: string,
  voiceId: string
): Promise<string> => {
  const response = await fetch(`${API_BASE}/tts/v1/voice`, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      voiceId,
      modelId: 'inworld-tts-1-max',
      audioConfig: {
        audioEncoding: 'MP3',
        sampleRateHertz: 22050,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.audioContent;
};

export const playAudio = async (text: string, voiceId: string) => {
  try {
    const audioBase64 = await synthesizeSpeech(text, voiceId);
    const audioBlob = base64ToBlob(audioBase64, 'audio/mpeg');
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    audio.play().catch(err => {
      console.error('Error playing audio:', err);
    });

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw error;
  }
};

// Helper functions
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};


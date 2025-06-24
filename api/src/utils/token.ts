import { env } from "cloudflare:workers"

const TOKEN_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function generateToken(): Promise<{ token: string; expiresAt: number }> {
    const expiresAt = Date.now() + TOKEN_EXPIRY;
    const data = {
        exp: expiresAt,
        random: crypto.randomUUID(),
    };
    
    const token = await new Response(JSON.stringify(data)).text();
    const encryptedToken = await encrypt(token, env.UPLOAD_TOKEN_SECRET);
    
    return {
        token: encryptedToken,
        expiresAt,
    };
}

export async function validateToken(token: string): Promise<boolean> {
    try {
        const decryptedToken = await decrypt(token, env.UPLOAD_TOKEN_SECRET);
        const data = JSON.parse(decryptedToken);
        
        if (!data.exp || typeof data.exp !== 'number') {
            return false;
        }
        
        return data.exp > Date.now();
    } catch {
        return false;
    }
}

async function encrypt(text: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Derive a 256-bit key using SHA-256
    const keyBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(key));
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        data
    );
    
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return btoa(String.fromCharCode(...combined));
}

async function decrypt(encryptedText: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const combined = new Uint8Array(
        atob(encryptedText)
            .split('')
            .map(char => char.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    // Derive the same 256-bit key using SHA-256
    const keyBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(key));
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        data
    );
    
    return new TextDecoder().decode(decrypted);
} 
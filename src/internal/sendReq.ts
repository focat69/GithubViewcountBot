/*
 * sendReq.ts
 * @focat69
 * 2024-08-15 (YYYY-MM-DD)
 * Made to simplify the process of sending requests (and to condense the code size lol)
 */

// Asyncronous methods
async function POSTAsync(url: string, data: any): Promise<any> {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await res.json();
}

async function GETAsync(url: string): Promise<any> {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await res.json();
    } else {
        return await res.text();
    }
}

// Syncronous methods
function POST(url: string, data: any, callback: (data: any) => void) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(data => callback(data));
}

function GET(url: string, options: any, callback: (data: any) => void) {
    const fetchOptions = options ? { ...options } : {};
    fetch(url, fetchOptions).then(res => {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return res.json();
        } else {
            return res.text();
        }
    }).then(data => callback(data));
}

//----------------\\

export {
    POSTAsync,
    GETAsync,
    POST,
    GET
};
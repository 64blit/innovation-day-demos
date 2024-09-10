import { NextResponse } from 'next/server';
import { EyePop } from '@eyepop.ai/eyepop';

export async function GET(req: Request) {
    try {
        const popId = 'f2092629d3524541abf4b16369d9405a'
        const secretKey = 'AAE_w6lCcrCa27chNAbZO-WdZ0FBQUFBQmwyUFk5bmtLZnJBQ2RFVWVDbzU1MnkwTUMzYXhQWjA4a0ZEczFKWWdONjdRS0NGWUZ5aF90aXVQZ3FrcWdkZWwwUEx6Q0luM0F3b3ItMjdqRmhUQkxyTWVvSndFLWRCUENjZGNlanZhbGhRTDdtV289'

        console.log('1', popId, secretKey);
        const endpoint = EyePop.workerEndpoint({
            popId: popId,
            auth: { 
                secretKey: secretKey,
             }
        })

        console.log('2');
        
        await endpoint.connect();

        console.log('3');

        const session = await endpoint.session();

        console.log('4', session);

        return NextResponse.json({ session }, { status: 200 });
    } catch (error) {
        console.error('Error processing session:', error);
        return NextResponse.json({ error: 'Failed to process session' + error }, { status: 500 });
    }
}

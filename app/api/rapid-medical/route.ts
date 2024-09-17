import { NextResponse } from 'next/server';
import { Authentication, EyePop } from '@eyepop.ai/eyepop';

export async function GET(req: Request) {
    try {
        console.log('test')
        const endpoint = EyePop.workerEndpoint(
            {
                popId: process.env.RAPID_MEDICAL_POP_ID,
                auth: {secretKey: process.env.RAPID_MEDICAL_API_KEY as string},
                eyepopUrl: process.env.RAPID_MEDICAL_API_URL
            }
        )

        await endpoint.connect()

        console.log('connect');

        const session = await endpoint.session()

        console.log('session', session)

        return NextResponse.json({ session }, { status: 200 });

    } catch (error) {
        console.error('Error processing image:', error);
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }
}

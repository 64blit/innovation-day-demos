import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import { Authentication, EyePop } from '@eyepop.ai/eyepop';

export async function POST(req: Request) {
    try {
        const { image } = await req.json();

        const img = await loadImage(image);
        const canvas = createCanvas(img.width, img.height);
        const context = canvas.getContext('2d');

        context.drawImage(img, 0, 0);

        const stream = canvas.createPNGStream();
        const endpoint = await EyePop.workerEndpoint(
            {
                popId: process.env.RAPID_MEDICAL_POP_ID,
                auth: {secretKey: process.env.RAPID_MEDICAL_API_KEY as string},
                eyepopUrl: process.env.RAPID_MEDICAL_API_URL
            }
        ).connect();

        let count = 0;
        const resultsArray = [];

        try {
            let results = await endpoint.process({
                stream: stream as unknown as ReadableStream,
                mimeType: 'image/*',
            });

            for await (let result of results) {
                if (result.objects) {
                    for (let object of result.objects) {
                        const { classLabel } = object;
                        if (classLabel === 'ziploc-bag') {
                            count += 1;
                            resultsArray.push(result)
                        }
                    }
                }
            }
        } finally {
            await endpoint.disconnect();
        }

        // const modifiedImage = canvas.toDataURL('image/png');

        return NextResponse.json({ resultsArray, count }, { status: 200 });
    } catch (error) {
        console.error('Error processing image:', error);
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }
}

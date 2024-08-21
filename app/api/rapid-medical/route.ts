import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import { Authentication, EyePop } from '@eyepop.ai/eyepop';
import { Render2d } from '@eyepop.ai/eyepop-render-2d';

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

        try {
            let results = await endpoint.process({
                stream: stream as unknown as ReadableStream,
                mimeType: 'image/*',
            });

            for await (let result of results) {
                if (result.objects) {
                    for (let object of result.objects) {
                        const { x, y, width, height, classLabel } = object;

                        console.log(classLabel)

                        if (classLabel === 'ziploc-bag') {
                            count += 1;
                            context.globalAlpha = 0.3;
                            context.strokeStyle = 'lightblue';
                            context.lineWidth = 2;
                            context.fillRect(x, y, width, height);

                            context.globalAlpha = 1;

                            context.fillStyle = 'white';
                            context.font = '30px Arial';
                            context.fillText('medical sample', x, y - 10);
                        }
                    }
                }
            }
        } finally {
            await endpoint.disconnect();
        }

        const modifiedImage = canvas.toDataURL('image/png');

        return NextResponse.json({ modifiedImage, count }, { status: 200 });
    } catch (error) {
        console.error('Error processing image:', error);
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }
}

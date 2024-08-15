import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import { EyePop } from '@eyepop.ai/eyepop';
import { Render2d } from '@eyepop.ai/eyepop-render-2d';

export async function POST(req: Request) {
    try {
        const { image, desiredObject } = await req.json();

        const img = await loadImage(image);
        const canvas = createCanvas(img.width, img.height);
        const context = canvas.getContext('2d');

        context.drawImage(img, 0, 0);

        const stream = canvas.createPNGStream();
        const endpoint = await EyePop.workerEndpoint().connect();

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

                        if (classLabel === desiredObject) {
                            count += 1;
                            context.strokeStyle = 'blue';
                            context.lineWidth = 2;
                            context.strokeRect(x, y, width, height);


                            context.fillStyle = 'blue';
                            context.font = '30px Arial';
                            context.fillText(classLabel, x, y - 10);
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

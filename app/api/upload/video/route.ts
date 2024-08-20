import { NextRequest, NextResponse } from 'next/server';
import EyePop from '@eyepop.ai/eyepop';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as Blob;
    const stream = video.stream();

    const endpoint = await EyePop.workerEndpoint({popId: process.env.JUMPINGJACKS_POP_ID}).connect();
    let resultsArray = [];

    try {
      let results = await endpoint.process({
        stream: stream,
        mimeType: 'video/*',
      })

      for await (let result of results) {
        console.log(result);
        resultsArray.push(result);
      }
    } finally {
      await endpoint.disconnect();
    }

    return NextResponse.json({ boundingBoxes: resultsArray });
  } catch (error: any) {
    console.error('Failed to upload video:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
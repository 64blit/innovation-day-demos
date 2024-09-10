import { NextRequest, NextResponse } from 'next/server';
// import EyePop from '@eyepop.ai/eyepop';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as Blob;
    const file = new File([video], 'recording.mp4', { type: 'video/mp4' });

    const endpoint = await EyePop.workerEndpoint({ popId: process.env.JUMPINGJACKS_POP_ID }).connect();
    let resultsArray = [];
    let jumpingJackTrackingArray = [];

    const traceState: { [key: number]: { aboveShoulder: boolean; jumpingJackCount: number } } = {};

    try {
      let results = await endpoint.process({
        file: file,
        mimeType: 'video/*',
      });

      for await (let result of results) {
        const { objects, seconds } = result;
        console.log(result)
        const jumpingJackCounts: { [key: number]: number } = {};

        if (!objects) {
          break;
        }

        objects.forEach(obj => {
          const { traceId, keyPoints } = obj;

          if (traceId && keyPoints) {
            if (!traceState[traceId]) {
              traceState[traceId] = { aboveShoulder: false, jumpingJackCount: 0 };
            }

            const bodyPoints = keyPoints[0].points;

            const leftWrist = bodyPoints.find(point => point.classLabel === 'left wrist');
            const rightWrist = bodyPoints.find(point => point.classLabel === 'right wrist');
            const leftShoulder = bodyPoints.find(point => point.classLabel === 'left shoulder');
            const rightShoulder = bodyPoints.find(point => point.classLabel === 'right shoulder');

            if (leftWrist && rightWrist && leftShoulder && rightShoulder) {
              const wristsAboveShoulders =
                leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;

              if (wristsAboveShoulders) {
                // Increment the jumping jack count when both wrists go above the shoulders
                if (!traceState[traceId].aboveShoulder) {
                  traceState[traceId].jumpingJackCount += 1;
                  traceState[traceId].aboveShoulder = true;
                }
              } else {
                // Reset the aboveShoulder state when wrists are no longer above shoulders
                traceState[traceId].aboveShoulder = false;
              }

              jumpingJackCounts[traceId] = traceState[traceId].jumpingJackCount;
            }
          }
        });

        resultsArray.push(result);
        console.log(result);
        if (Object.keys(jumpingJackCounts).length > 0) {
          jumpingJackTrackingArray.push({ seconds, jumpingJackCounts });
        }
      }
    } finally {
      await endpoint.disconnect();
    }

    return NextResponse.json({ resultsArray, jumpingJackTrackingArray });
  } catch (error: any) {
    console.error('Failed to upload video:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

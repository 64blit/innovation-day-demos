import { NextRequest, NextResponse } from 'next/server';
import EyePop from '@eyepop.ai/eyepop';
import type { PredictedKeyPoints, Prediction } from '@eyepop.ai/eyepop';

export async function POST(request: NextRequest) {
  const wristsAboveShoulder = (prediction: Prediction) => {
    const keyPoints = prediction.keyPoints as any[];
    let leftWrist = 0;
    let rightWrist = 0;
    let leftShoulder = 0;
    let rightShoulder = 0;

    for(let keyPoint of keyPoints){
      if(keyPoint.classLabel === 'left_wrist'){
        leftWrist = keyPoint.y;
      } else if(keyPoint.classLabel === 'right_wrist'){
        rightWrist = keyPoint.y;
      } else if(keyPoint.classLabel === 'left_shoulder'){
        leftShoulder = keyPoint.y;
      } else if(keyPoint.classLabel === 'right_shoulder'){
        rightShoulder = keyPoint.y;
      }
    }

    if (leftWrist > leftShoulder && rightWrist > rightShoulder) {
      return true;
    } else if (leftWrist && rightWrist && leftShoulder && rightShoulder) {
      return false;
    } else {
      return 'revert to previous'
    }
  }

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
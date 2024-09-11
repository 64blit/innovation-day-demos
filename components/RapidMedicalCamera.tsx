'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import CameraIcon from './CameraIcon';
import { Button } from './ui/button';
import HelpIcon from './HelpIcon';
import FlashIcon from './FlashIcon';
import { once } from 'events';


let Render2d: any = null
let EyePop: any = null

export async function loadEyePopModules()
{
  try
  {
    if (!EyePop)
    {
      await import('@eyepop.ai/eyepop').then((module) =>
      {
        if (EyePop) return
        EyePop = module.EyePop
        console.log('NodeSdkContext: Loaded EyePop modules', EyePop)
      })
    }

    if (!Render2d)
    {
      await import('@eyepop.ai/eyepop-render-2d').then((module) =>
      {
        if (Render2d) return
        Render2d = module.Render2d
        console.log('NodeSdkContext: Loaded EyePop modules', Render2d)
      })
    }
  } catch (e)
  {
    console.error(e)
  }
}

loadEyePopModules()


interface RapidMedicalCameraProps
{
  goBackToInstructions: () => void;
  goToThankYouPage: () => void;
}

const RapidMedicalCamera = ({ goToThankYouPage, goBackToInstructions }: RapidMedicalCameraProps) =>
{
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isLoaded, setIsLoaded ] = useState(false);
  const [ desiredObjectCount, setDesiredObjectCount ] = useState(0);

  useEffect(() =>
  {
    const constraints = {
      video: {
      facingMode: 'environment',
      width: { ideal: 3840 },
      height: { ideal: 2160 },
      },
    };


    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) =>
      {
        if (videoRef.current)
        {
          videoRef.current.srcObject = stream;
          // set the video resolution to match the stream
          
          videoRef.current.onloadedmetadata = () =>
          {
            if (videoRef.current)
            {
              videoRef.current.width = videoRef.current.videoWidth;
              videoRef.current.height = videoRef.current.videoHeight;
            }
          };

        }
      })
      .catch((error) =>
      {
        console.error('Error accessing camera:', error);
      });

    return () =>
    {
      if (videoRef.current && videoRef.current.srcObject)
      {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const uploadImage = async () =>
  {
    loadEyePopModules()

    if (!canvasRef.current || !videoRef.current) return

    const context = canvasRef.current.getContext('2d');

    if (!context) return

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    setIsLoading(true);

    try
    {

      const imageDataURL = canvasRef.current.toDataURL('image/png');

      let canvasBlob = await fetch(imageDataURL);
      canvasBlob = await canvasBlob.blob() as any;

      const RAPID_MEDICAL_POP_ID='65a2e14afb3d4636a1d1d1e5c29d2bda'
      const RAPID_MEDICAL_API_KEY='AAGcsWj8N2PlKQl9c9ydz3QFZ0FBQUFBQm1mZDB5eDUwalNlYi12NWotd3hsVGJiMW1sVXF1dE9aOU9oSGVBOWtBQXoxZmNjUE5Nb1YzY3RROUdzbVUwUkZtcDhZcG5vSWROTzR1TU8ybGhZckx6RTgzYVZwMjZEREZjalZubnpYaUNMWVdBODg9'
      const RAPID_MEDICAL_API_URL='https://web-api.staging.eyepop.xyz'

      let count = 0;
      const resultsArray = [];

      const endpoint = await EyePop.workerEndpoint({
        // auth: { session: data.session },
        popId: RAPID_MEDICAL_POP_ID,
        auth: {
          secretKey: RAPID_MEDICAL_API_KEY,
        },
        eyepopUrl: RAPID_MEDICAL_API_URL
      }
      ).connect();

      console.log(canvasBlob);

      try
      {
        let results = await endpoint.process({
          file: canvasBlob,
          mimeType: 'image/*',
        });

        for await (let result of results)
        {
          console.log(result);
          if (result.objects)
          {
            for (let object of result.objects)
            {
              const { classLabel } = object;
              if (classLabel === 'ziploc-bag')
              {
                count += 1;
                resultsArray.push(result)
              }
            }
          }
        }
      } finally
      {
        await endpoint.disconnect();
      }

      setDesiredObjectCount(count)


      if (context)
      {
        // @ts-ignore
        const renderer = Render2d.renderer(context as CanvasRenderingContext2D);
        for (let result of resultsArray)
        {
          renderer.draw(result);
        }

      };
    } catch (error)
    {
      console.error('Error uploading image:', error);
    } finally
    {
      setIsLoading(false);
      setIsLoaded(true);
    }

  };

  return (
    <div className="relative w-screen h-[100svh]">
      {isLoaded && (
        <div className='absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center'>
          <h1 className='text-4xl text-center font-bold text-white absolute top-10 left-1/2 transform -translate-x-1/2'>
            Analysis complete
          </h1>
          <span className="bg-[#0B0A33] rounded-full cursor-pointer p-4 text-white">
            {desiredObjectCount == 1 ? `${desiredObjectCount} medical sample` : `${desiredObjectCount} medical samples`}
          </span>
          <Button
            className="bg-eyepop w-[90vw] border-white border font-bold text-md h-12 absolute bottom-10 left-1/2 transform -translate-x-1/2"
            onClick={goToThankYouPage}
          >
            Next
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <MoonLoader className="my-4" color="#34a4eb" size={50} />
          <h1 className='text-white font-bold text-2xl mt-4'>Capturing...</h1>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-screen h-screen object-cover ${isLoading || isLoaded ? 'hidden' : ''}`}
      ></video>
      <canvas
        ref={canvasRef}
        className={`w-screen h-screen object-cover ${isLoaded || isLoading ? '' : 'hidden'}`}
      ></canvas>
      {!isLoading && !isLoaded && (
        <div>
          <button
            onClick={goBackToInstructions}
            className="absolute top-8 left-3/4 transform bg-eyepop border-4 border-white rounded-full cursor-pointer p-4"
          >
            <HelpIcon />
          </button>
          <button
            onClick={uploadImage}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-eyepop border-4 border-white rounded-full cursor-pointer p-4"
          >
            <CameraIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default RapidMedicalCamera;

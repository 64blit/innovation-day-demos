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

interface CargoShotCameraProps
{
  goBackToInstructions: () => void;
  goToThankYouPage: () => void;
}

const CargoShotCamera = ({ goToThankYouPage, goBackToInstructions }: CargoShotCameraProps) =>
{
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isLoaded, setIsLoaded ] = useState(false);


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

      const desiredObjects = [
        'boxes',
        'pallet',
        'pallete',
      ]
      let canvasBlob = await fetch(imageDataURL);

      canvasBlob = await canvasBlob.blob() as any;


      const popId = 'f2092629d3524541abf4b16369d9405a'
      const secretKey = 'AAE_w6lCcrCa27chNAbZO-WdZ0FBQUFBQmwyUFk5bmtLZnJBQ2RFVWVDbzU1MnkwTUMzYXhQWjA4a0ZEczFKWWdONjdRS0NGWUZ5aF90aXVQZ3FrcWdkZWwwUEx6Q0luM0F3b3ItMjdqRmhUQkxyTWVvSndFLWRCUENjZGNlanZhbGhRTDdtV289'
      let count = 0;
      const endpoint = await EyePop.workerEndpoint({
        // auth: {session}
        popId: popId,
        auth: {
          secretKey: secretKey,
        }
      }).connect();

      try
      {

        let results = await endpoint.process({
          stream: canvasBlob as unknown as ReadableStream,
          mimeType: 'image/*',
        });


        for await (let result of results)
        {
          console.log(result);
          if (result.objects)
          {
            for (let object of result.objects)
            {
              const { x, y, width, height, classLabel } = object;

              if (classLabel in desiredObjects)
              {
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
      } finally
      {
        await endpoint.disconnect();
      }



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
        <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center'>
          <h1 className='text-4xl text-center font-bold text-white absolute top-10 left-1/2 transform -translate-x-1/2'>
            Analysis complete
          </h1>
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
        className={`w-full h-[100svh] object-cover ${isLoading || isLoaded ? 'hidden' : ''}`}
      ></video>
      <canvas
        ref={canvasRef}
        width={1080}
        height={1440}
        className={`w-full h-[100svh] object-cover ${isLoaded || isLoading ? '' : 'hidden'}`}
      ></canvas>
      {!isLoading && !isLoaded && (
        <div className='flex flex-col items-center'>
          <h1 className='text-white font-bold absolute top-8 text-center text-xl p-4 drop-shadow-xl bg-black bg-opacity-50 w-[90vw] rounded-lg'>TIP<br />Center the front view of the boxes inside of the outline</h1>
          <div className='w-[90vw] h-[40vh] border-white border-4 border-dashed absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2' />
          <button
            onClick={goBackToInstructions}
            className="absolute bottom-8 right-3/4 transform bg-eyepop border-4 border-white rounded-full cursor-pointer p-4"
          >
            <HelpIcon />
          </button>
          <button
            onClick={uploadImage}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-eyepop border-4 border-white rounded-full cursor-pointer p-4"
          >
            <CameraIcon />
          </button>
          <button
            onClick={uploadImage}
            className="absolute bottom-8 left-3/4 transform bg-eyepop border-4 border-white rounded-full cursor-pointer p-4"
          >
            <FlashIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default CargoShotCamera;

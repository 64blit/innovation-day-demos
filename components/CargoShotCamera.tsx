'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import CameraIcon from './ui/CameraIcon';
import { Button } from './ui/button';
import HelpIcon from './ui/HelpIcon';
import FlashIcon from './ui/FlashIcon';
import { FailPageData } from './Demo';

let Render2d: any = null
let EyePop: any = null

// [
//   {
//     "classId": 0,
//     "classLabel": "pallet",
//     "confidence": 0.873,
//     "height": 296.075,
//     "id": 3691,
//     "inferId": 1,
//     "orientation": 0,
//     "width": 541.005,
//     "x": 494.228,
//     "y": 1175.38
//   },
//   {
//     "classId": 1,
//     "classLabel": "stack of boxes",
//     "confidence": 0.962,
//     "height": 698.596,
//     "id": 3690,
//     "inferId": 1,
//     "orientation": 0,
//     "width": 567.344,
//     "x": 503.785,
//     "y": 673.05
//   }
// ]

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
  goToFailPage: (data?: FailPageData) => void;

}



const CargoShotCamera = ({ goToThankYouPage, goBackToInstructions, goToFailPage }: CargoShotCameraProps) =>
{
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isLoaded, setIsLoaded ] = useState(false);
  const [ desiredObjectCount, setDesiredObjectCount ] = useState<number | null>(null);
  const [ inCompliance, setInCompliance ] = useState<number | null>(null);

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

  const updateCompliance = (stack: any, palette: any) =>
  {
    const stackAspectRatio = stack.width / stack.height;
    const paletteAspectRatio = palette.width / palette.height;

    const stackPaletteRatio = stackAspectRatio / paletteAspectRatio;

    console.log(stackAspectRatio);
    console.log(paletteAspectRatio);
    console.log(stackPaletteRatio);

    console.log((stackPaletteRatio - .345));

    if (Math.abs(stackPaletteRatio - .345) < 0.05)
    {
      stack.isInCompliance = true;
      palette.isInCompliance = true;
    }
  }


  const uploadImage = async () =>
  {
    loadEyePopModules()
    setDesiredObjectCount(null)
    setInCompliance(null);

    if (!canvasRef.current || !videoRef.current) return

    const context = canvasRef.current.getContext('2d');

    if (!context) return

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);


    setIsLoading(true);
    try
    {
      const CARGOSHOT_POP_ID = 'bebfa691191c49d0a54645cdc1dd7f00';
      const CARGOSHOT_API_KEY = 'AAEiXf8WYXoWirMi4E8P37nBZ0FBQUFBQm02MHdTSDJBSzM3Tmwxa0kzejFndHZNdDUzV08wUE9xQ0dXbU9OYnA1eWtoRF9BRjNvMTBSZUZvUUZfcElKUnB2VHZ1NmFOZWdUMDBSSDIwcXNaXzRoSV96NDV2NmtPZHlxRGw1dEFhRXZybnVNemM9'

      const endpoint = await EyePop.workerEndpoint({
        popId: CARGOSHOT_POP_ID,
        auth: { secretKey: CARGOSHOT_API_KEY as string },
        eyepopUrl: 'https://web-api.staging.eyepop.xyz'
      }).connect();

      let count = 0;
      const imageDataURL = canvasRef.current.toDataURL('image/png');
      let canvasBlob = await fetch(imageDataURL)
      canvasBlob = await canvasBlob.blob() as any;

      const desiredObjects = [ 'stack of boxes', 'pallet' ]
      let inComplianceCount = 0;
      try
      {
        let results = await endpoint.process({
          file: canvasBlob,
          mimeType: 'image/*',
        });

        for await (let result of results)
        {
          if (!('objects' in result)) continue

          const pairs = [];
          for (let i = 0; i < result.objects.length; i++)
          {
            const objA = result.objects[ i ];
            for (let j = i + 1; j < result.objects.length; j++)
            {
              const objB = result.objects[ j ];


              const isOverlapping = (
                objA.x < objB.x + objB.width &&
                objA.x + objA.width > objB.x &&
                objA.y < objB.y + objB.height &&
                objA.y + objA.height > objB.y
              ) &&
                (objA.classLabel !== objB.classLabel);

              const isNotPaired = !objA.hasPair && !objB.hasPair;

              if (isOverlapping && isNotPaired)
              {
                if (objA.classLabel === 'stack of boxes')
                {
                  updateCompliance(objA, objB);
                } else
                {
                  updateCompliance(objB, objA);
                }

                objA.hasPair = true;
                objB.hasPair = true;
                pairs.push([ objA, objB ]);

                inComplianceCount += objA.isInCompliance ? 1 : 0;

              }
            }
          }

          console.log(pairs);


          for (let object of result?.objects)
          {
            const { x, y, width, height, classLabel } = object;

            if (desiredObjects.includes(classLabel))
            {
              const color = object.isInCompliance ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
              count += 1;
              context.strokeStyle = color; // Optional: stroke color
              context.lineWidth = 5
              context.strokeRect(x, y, width, height);

              context.font = 'bold 40px Arial';
              context.fillText(classLabel, x + 5, y - 15);
            }

          }

          setInCompliance(inComplianceCount);

          setDesiredObjectCount(count);

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
        <div className='absolute inset-0  flex flex-col items-center justify-center'>
          <h1 className='text-4xl text-center font-bold text-white absolute top-10 left-1/2 transform -translate-x-1/2'>
            Analysis complete
          </h1>


          {inCompliance && inCompliance > 0 ? (
            <>
              <span className=" rounded-full cursor-pointer p-2 text-white bg-blue-950  flex justify-center text-center align-middle items-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className='mr-1 mb-1' xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6 L9 17 L4 12" stroke="white" strokeWidth="2" fill="none" />
                </svg>

                <span className='w-full mr-s2'>
                  {inCompliance} cargo in compliance.
                </span>
              </span>


              <Button
                className="bg-eyepop w-[90vw] border-white border font-bold text-md h-12 absolute bottom-10 left-1/2 transform -translate-x-1/2"
                onClick={goToThankYouPage}
              >
                Next
              </Button>

            </>
          ) : (
            desiredObjectCount === 0 ? (<>
              <span className=" rounded-full cursor-pointer p-2 text-white bg-blue-700  flex justify-center text-center align-middle items-center">

                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className='mr-1 mb-1' xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2 L22 22 H2 Z" fill="none" stroke="white" strokeWidth="2" />
                  <line x1="12" y1="8" x2="12" y2="14" stroke="white" strokeWidth="2" />
                  <circle cx="12" cy="17" r="1" fill="white" />
                </svg>

                <span className='w-full mr-s2'>
                  No cargo detected
                </span>
              </span>

              <Button
                className="bg-eyepop w-[90vw] border-white border font-bold text-md h-12 absolute bottom-10 left-1/2 transform -translate-x-1/2"
                onClick={() =>
                {
                  const failPageData = {
                    header: 'Your cargo height fix guide',
                    subHeader: "",
                    description: "AI reduces fines associated with Cargo out of compliance."
                  } as FailPageData

                  goToFailPage(failPageData)
                  setIsLoaded(false)
                }}
              >
                Next
              </Button>
            </>) :
              (
                <>
                  <span className=" rounded-full cursor-pointer p-2 text-white bg-red-700  flex justify-center text-center align-middle items-center">

                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className='mr-1 mb-1' xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2 L22 22 H2 Z" fill="none" stroke="white" strokeWidth="2" />
                      <line x1="12" y1="8" x2="12" y2="14" stroke="white" strokeWidth="2" />
                      <circle cx="12" cy="17" r="1" fill="white" />
                    </svg>

                    <span className='w-full mr-s2'>
                      {inCompliance} cargo out of compliance
                    </span>
                  </span>

                  <Button
                    className="bg-eyepop w-[90vw] border-white border font-bold text-md h-12 absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    onClick={() =>
                    {
                      const failPageData = {
                        header: 'Your cargo height fix guide',
                        subHeader: "",
                        description: "AI reduces fines associated with Cargo out of compliance."
                      } as FailPageData

                      goToFailPage(failPageData)
                      setIsLoaded(false)
                    }}
                  >
                    Next
                  </Button>
                </>
              )
          )}
        </div>
      )}

      {isLoading && (
        <>
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
            <MoonLoader className="my-4" color="#34a4eb" size={50} />
            <h1 className='text-white font-bold text-2xl mt-4'>Capturing...</h1>
          </div>
        </>
      )}
      <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden -z-10">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`object-cover w-full h-full  ${isLoading || isLoaded ? 'hidden' : ''}`}
        ></video>
        <canvas
          ref={canvasRef}
          className={`object-cover w-full h-full ${isLoaded || isLoading ? '' : 'hidden'}`}
        ></canvas>
      </div>
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

        </div>
      )}
    </div>
  );
};

export default CargoShotCamera;

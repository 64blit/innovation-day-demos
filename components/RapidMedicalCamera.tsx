'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import CameraIcon from './CameraIcon';
import { Button } from './ui/button';
import HelpIcon from './HelpIcon';
import FlashIcon from './FlashIcon';

interface RapidMedicalCameraProps {
  goBackToInstructions: () => void;
  goToThankYouPage: () => void;
}

const RapidMedicalCamera = ({goToThankYouPage, goBackToInstructions}: RapidMedicalCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [desiredObjectCount, setDesiredObjectCount] = useState(0);

  useEffect(() => {
    const constraints = {
      video: {
        facingMode: 'environment',
      },
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const uploadImage = async () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    if (canvasRef.current) {
      setIsLoading(true);
      try {

        const imageDataURL = canvasRef.current.toDataURL('image/png');
        const response = await fetch('/api/rapid-medical', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageDataURL })
        });

        const data = await response.json()

        setDesiredObjectCount(data.count)

        const modifiedImageURL = data.modifiedImage;
        const img = new Image();
        img.src = modifiedImageURL;
        img.onload = () => {
          if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
              context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              context.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            }
          }
        };
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
      }
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
          <MoonLoader className="my-4" color="#34a4eb" size={50}/>
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
        <div>
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

export default RapidMedicalCamera;

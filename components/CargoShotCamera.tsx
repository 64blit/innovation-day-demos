'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import CameraIcon from './ui/CameraIcon';
import { Button } from './ui/button';
import HelpIcon from './ui/HelpIcon';
import FlashIcon from './ui/FlashIcon';

interface CargoShotCameraProps {
  goBackToInstructions: () => void;
  goToThankYouPage: () => void;
}

const CargoShotCamera = ({ goToThankYouPage, goBackToInstructions }: CargoShotCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

    
        const img = new Image()
        img.src = modifiedImageURL
        img.onload = () => {
          if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d')
            if (context) {
              context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
              context.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
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
        className={`w-full h-[100vh] object-cover ${isLoading || isLoaded ? 'hidden' : ''}`}
      ></video>
      <canvas
        ref={canvasRef}
        width={1080}
        height={1440}
        className={`w-full h-[100vh] object-cover ${isLoaded || isLoading ? '' : 'hidden'}`}
      ></canvas>
      {!isLoading && !isLoaded && (
        <div className='flex flex-col items-center'>
            <h1 className='text-white font-bold absolute top-8 text-center text-xl p-4 drop-shadow-xl bg-black bg-opacity-50 w-[90vw] rounded-lg'>TIP<br />Center the front view of the boxes inside of the outline</h1>
            <div className='w-[90vw] h-[40vh] border-white border-4 border-dashed absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2'/>
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

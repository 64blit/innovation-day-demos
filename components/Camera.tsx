'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BarLoader } from 'react-spinners';

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [desiredObjectCount, setDesiredObjectCount] = useState(0);

  const desiredObject = 'laptop' // change to plastic bags for Rapid Medical Demo

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

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        setIsCaptured(true);
      }
    }
  };

  const retakeImage = () => {
    setIsCaptured(false);
    setIsLoaded(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const uploadImage = async () => {
    if (canvasRef.current) {
      setIsLoading(true);
      try {

        const imageDataURL = canvasRef.current.toDataURL('image/png');
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageDataURL, desiredObject: desiredObject }),
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
        <span className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white border-4 border-black rounded-full cursor-pointer p-4">
          {desiredObject} count: {desiredObjectCount}
        </span>
      )}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
          <BarLoader className="my-4" color="#34a4eb" width={200} height={10} />
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-[100svh] object-cover ${isCaptured || isLoading ? 'hidden' : ''}`}
      ></video>
      <canvas
        ref={canvasRef}
        width={1080}
        height={1440}
        className={`w-full h-[100svh] object-cover ${isCaptured && !isLoading ? '' : 'hidden'}`}
      ></canvas>
      {isCaptured && !isLoading && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          {!isLoaded ? (
            <button
              onClick={uploadImage}
              className="bg-white border-4 border-black rounded-full cursor-pointer p-4"
            >
              Upload
            </button>
          ) : (
            <a
              href="https://eyepop.ai"
              className="bg-white border-4 border-black rounded-full cursor-pointer p-4 text-center inline-block"
            >
              Learn
            </a>
          )}
          <span
            className="text-2xl text-white font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
          >
            or
          </span>
          <button
            onClick={retakeImage}
            className="bg-white border-4 border-black rounded-full cursor-pointer p-4"
          >
            Retake
          </button>
        </div>
      )}
      {!isCaptured && !isLoading && (
        <button
          onClick={captureImage}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white border-4 border-black rounded-full cursor-pointer p-8"
        >
        </button>
      )}
    </div>
  );
};

export default Camera;

'use client'

import { Button } from '@/components/ui/button'
import { ReactMediaRecorder } from 'react-media-recorder'
import { useRef, useEffect, useState } from 'react'



export default function JumpingJacksDemo() {
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleStart = () => {
        setIsRecording(true);
    }

    const handleStop = async (blobUrl: string | null) => {
        setIsRecording(false);
        if (blobUrl) {
            try {
                setIsUploading(true);
                const blob = await fetch(blobUrl).then(res => res.blob());
                const formData = new FormData();
                formData.append('video', blob, 'recording.mp4');

                await fetch('/api/upload/video', {
                    method: 'POST',
                    body: formData,
                });

                console.log('Video uploaded successfully!');
            } catch (error) {
                console.error('Failed to upload video:', error);
            } finally {
                setIsUploading(false);
            }
        }
    }

    const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
        const videoRef = useRef<HTMLVideoElement>(null);

        useEffect(() => {
            if (videoRef.current && stream) {
                videoRef.current.srcObject = stream;
            }
        }, [stream]);

        return stream ? (
            <video 
              ref={videoRef} 
              className='w-full h-[100vh] object-cover'
              autoPlay
            />
          ) : null;
          
    };

    if (isUploading) {
        return <div className='h-[100vh] w-full flex items-center justify-center'><p>Uploading...</p></div>;
    }

    return (
        <div className='h-[100vh] w-full flex flex-col items-center justify-center'>
            <ReactMediaRecorder
                video
                onStart={handleStart}
                onStop={handleStop}
                audio={false}
                render={({ startRecording, stopRecording, previewStream }) => (
                    <div className='w-full h-[100vh] flex flex-col items-center justify-center'>
                        {!isRecording ? (
                            <Button onClick={startRecording} className='p-28 bg-eyepop rounded-3xl text-8xl font-black hover:scale-105 transition duration-300'>Start Recording</Button>
                        ) : (
                            <div className='w-full h-[100vh] flex flex-col items-center'>
                                <VideoPreview stream={previewStream} />
                                <Button onClick={stopRecording} className='absolute bottom-20 bg-eyepop text-4xl px-20 py-10 rounded-lg font-semibold hover:scale-105 transition duration-300'>Stop Recording</Button>
                            </div>
                        )}
                    </div>
                )}
            />
        </div>
    )
}

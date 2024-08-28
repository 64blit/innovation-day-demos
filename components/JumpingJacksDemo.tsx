'use client'

import { Button } from '@/components/ui/button'
import { ReactMediaRecorder } from 'react-media-recorder'
import { useRef, useEffect, useState } from 'react'
import { Prediction } from '@eyepop.ai/eyepop'
import { MoonLoader } from 'react-spinners';
import Render2d from '@eyepop.ai/eyepop-render-2d'

export default function JumpingJacksDemo() {
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [resultsArray, setResultsArray] = useState<Prediction[]>([]);
    const [jumpingJackTrackingArray, setJumpingJackTrackingArray] = useState<any[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleStart = () => {
        setIsRecording(true);
    }

    const handleUpload = async (blobUrl: string | null) => {
        setIsRecording(false);
        if (blobUrl) {
            try {
                setIsUploading(true);
                const blob = await fetch(blobUrl).then(res => res.blob());
                const formData = new FormData();
                formData.append('video', blob, 'recording.mp4');

                const response = await fetch('/api/jumping-jacks', {
                    method: 'POST',
                    body: formData,
                });

                setIsUploading(false);
                setIsUploaded(true);

                const { resultsArray, jumpingJackTrackingArray } = await response.json()

                setJumpingJackTrackingArray(jumpingJackTrackingArray)
                setResultsArray(resultsArray)

                console.log('Video uploaded successfully!');
            } catch (error) {
                console.error('Failed to upload video:', error);
            } finally {
                setIsUploading(false);
            }
        }
        setIsUploaded(true);
    }

    const handleRecordAgain = () => {
        setIsUploaded(false);
        setResultsArray([]);
        setJumpingJackTrackingArray([]);
    }

    const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
        const previewRef = useRef<HTMLVideoElement>(null);

        useEffect(() => {
            if (previewRef.current && stream) {
                previewRef.current.srcObject = stream;
            }
        }, [stream]);
        if (!stream) {
            return null;
        }
        return <video ref={previewRef} autoPlay className='w-full h-[100vh] object-cover' />;
    };


    const getClosestPrediction = (seconds: number) => {
        if (resultsArray.length === 0) return null
        return resultsArray.reduce((prev: Prediction, curr: Prediction) => {
            return Math.abs((curr.seconds as number) - seconds) < Math.abs((prev.seconds as number) - seconds)
                ? curr
                : prev
        })
    }

    const getClosestJumpingJackCount = (traceId: number, seconds: number) => {
        let closestEntry = null;

        for (const entry of jumpingJackTrackingArray) {
            if (entry.seconds <= seconds) {
                closestEntry = entry;
            } else {
                break;
            }
        }

        return closestEntry?.jumpingJackCounts[traceId] || 0;
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && isUploaded) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!canvas) {
                console.error('Canvas element not found');
                return;
            }

            const ctx = canvas.getContext('2d');

            if (!ctx) {
                console.error('Unable to get 2D context from canvas');
                return;
            }

            const renderer = Render2d.renderer(ctx as any, [
                Render2d.renderKeypoints(),
            ])


            if (video && resultsArray && renderer) {
                const drawFrame = () => {
                    const result = getClosestPrediction(video.currentTime);

                    try {
                        if (result && canvas) {
                            canvas.width = result.source_width;
                            canvas.height = result.source_height;
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                            if (renderer) {
                                renderer.draw(result as any);
                            }

                            if (result.objects) {
                                result.objects.forEach(obj => {
                                    const traceId = obj.traceId;

                                    const keyPoints = obj.keyPoints![0]?.points;
                                    const jumpingJackCount = getClosestJumpingJackCount(traceId as number, result.seconds as number);

                                    if (keyPoints && jumpingJackCount !== undefined) {
                                        const nose = keyPoints.find(point => point.classLabel === 'nose');

                                        if (nose) {
                                            const text = jumpingJackCount.toString();
                                            const fontSize = 20;
                                            ctx.font = `bold ${fontSize}px 'Press Start 2P'`;
                                            ctx.textAlign = 'center';

                                            const textWidth = ctx.measureText(text).width;
                                            const padding = 10;
                                            const bubbleWidth = textWidth + padding * 4;
                                            const bubbleHeight = fontSize + padding * 2;

                                            // Define the position
                                            const x = nose.x;
                                            const y = nose.y - obj.height * 0.20;

                                            // Draw the thought bubble rectangle
                                            ctx.fillStyle = 'white';
                                            ctx.lineWidth = 2;
                                            ctx.beginPath();
                                            ctx.rect(x - bubbleWidth / 2, y - bubbleHeight - 15, bubbleWidth, bubbleHeight);
                                            ctx.fill();

                                            // Draw the triangle pointer
                                            ctx.beginPath();
                                            ctx.moveTo(x - 10, y - 10);
                                            ctx.lineTo(x, y);
                                            ctx.lineTo(x + 10, y - 10);
                                            ctx.closePath();
                                            ctx.fill();

                                            // Draw the text inside the bubble
                                            ctx.fillStyle = 'blue';
                                            ctx.fillText(text, x, y - bubbleHeight / 2 - 5);
                                        }

                                    }
                                });
                            }
                        } else if (canvas) {
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        }
                    } catch (error) {
                        console.error(error)
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    }

                    requestAnimationFrame(drawFrame);
                }

                video.addEventListener('play', drawFrame);

                video.play()

                return () => {
                    video.removeEventListener('play', drawFrame);
                }
            }
        }
    }, [resultsArray, jumpingJackTrackingArray]);


    return (
        <div className='h-[100vh] w-full flex flex-col items-center justify-center'>
            <ReactMediaRecorder
                video
                onStart={handleStart}
                onStop={handleUpload}
                audio={false}
                render={({ startRecording, stopRecording, previewStream, mediaBlobUrl }) => (
                    <>
                        {isRecording ? <div className='w-full h-[100vh] flex flex-col items-center'>
                            <VideoPreview stream={previewStream} />
                            <Button onClick={stopRecording} className='absolute bottom-20 bg-eyepop text-4xl px-20 py-10 rounded-lg font-semibold hover:scale-105 transition duration-300'>Stop Recording</Button>
                        </div>
                            : isUploading ? <div className='h-[100vh] w-full flex items-center justify-center'><MoonLoader color="#34a4eb" size={200} /></div>
                                : isUploaded && mediaBlobUrl ? <div className='w-full h-[100vh] flex flex-col items-center'>
                                    <canvas
                                        ref={canvasRef}
                                        width={1080}
                                        height={1440}
                                        className={`w-full h-[100vh] object-cover border-2 border-black`}
                                    ></canvas>
                                    <video className="hidden" ref={videoRef} muted loop src={mediaBlobUrl as string}></video>
                                    <Button onClick={handleRecordAgain} className='absolute bottom-20 bg-eyepop text-4xl px-20 py-10 rounded-lg font-semibold hover:scale-105 transition duration-300'>Record Again</Button>
                                </div>
                                    : <Button onClick={startRecording} className='p-28 bg-eyepop rounded-3xl text-8xl font-black hover:scale-105 transition duration-300'>Start Recording</Button>}
                    </>
                )}
            />
        </div>
    )
}

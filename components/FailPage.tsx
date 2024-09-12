'use client'

import { Button } from "./ui/button"

interface FailPageProps
{
  goToThankYouPage: () => void;
}

const FailPage = ({ goToThankYouPage }: FailPageProps) =>
{
  return (
    <div className="absolute top-0 left-0 w-full z-50  text-center p-4 h-full flex flex-col justify-center items-center bg-transparent">
      <div className="bg-black blur-3xl opacity-90 -z-30 w-full h-full absolute top-0 left-0"></div>
      <h1 className="text-3xl mt-32 mb-3 font-semibold text-white">What to do when your samples aren't there?</h1>
      <p className="text-lg my-4 text-white">You have been tasked with picking up medical sample bags from a local clinic's lockbox.</p>
      <Button
        onClick={goToThankYouPage}
        className="bg-eyepop w-[90vw] border-white border font-bold text-md h-12 mt-16"
      >
        Next
      </Button>

    </div>
  )
}

export default FailPage

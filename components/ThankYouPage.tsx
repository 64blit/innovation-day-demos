'use client'

import { Button } from "./ui/button"

interface ThankYouPageProps
{
  goBackToCamera: () => void;
  title: string;
}

const ThankYouPage = ({ goBackToCamera, title }: ThankYouPageProps) =>
{
  return (
    <div className="text-center p-4 flex flex-col justify-center items-center h-full bg-white text-black">
      <h1 className="text-4xl  mb-3 font-semibold">Thank you!</h1>
      <p className="text-lg my-4">Have questions for {title} or <a className="text-sky-700" href="https://eyepop.ai">EyePop.ai</a>?
        {` We'd`} love to hear from you.</p>
      <p className="text-lg my-4">Contact <a className="text-sky-700" href="mailto:andy@eyepop.ai">andy@eyepop.ai</a></p>
      <p className="text-lg my-4">Follow us on <a className="text-sky-700" target="_blank" href="https://www.linkedin.com/company/eyepop-ai/">Linked<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="inline-block align-middle mr-1 -mt-1 ml-1"><path d="M21.6 0H2.4C1.1 0 0 1.1 0 2.4v19.2C0 22.9 1.1 24 2.4 24h19.2c1.3 0 2.4-1.1 2.4-2.4V2.4C24 1.1 22.9 0 21.6 0zM7.9 19.2H4.8V9.6h3.1v9.6zM6.4 8.1c-1.1 0-1.9-0.9-1.9-2s0.9-2 1.9-2c1.1 0 1.9 0.9 1.9 2S7.5 8.1 6.4 8.1zM20 19.2h-3.1v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7v5.2H9.1V9.6h3v1.4h0.1c0.4-0.8 1.4-1.7 2.9-1.7 3.1 0 3.7 2 3.7 4.6V19.2z"></path></svg></a></p>
      <Button
        onClick={goBackToCamera}
        className="bg-eyepop w-[90vw] border-white border font-bold text-md h-12 mt-16"
      >
        Try it again
      </Button>
    </div>
  )
}

export default ThankYouPage

'use client'

import { Button } from "./ui/button"

interface ThankYouPageProps {
    goBackToCamera: () => void;
    title: string;
}

const ThankYouPage = ({goBackToCamera, title}: ThankYouPageProps) => {
    return (
        <div className="text-center p-4">
            <h1 className="text-3xl mt-32 mb-3 font-semibold">Thank you!</h1>
            <p className="text-lg my-4">{`Have questions for {title} or <a className="text-sky-700" href="https://eyepop.ai">EyePop.ai</a>?
            We'd love to hear from you.`}</p>
            <p className="text-lg my-4">Contact <a className="text-sky-700" href="mailto:andy@eyepop.ai">andy@eyepop.ai</a></p>
            <p className="text-lg my-4">Follow us on <a className="text-sky-700" href="https://www.linkedin.com/company/eyepop-ai/">LinkedIn</a></p>
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

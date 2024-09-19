'use client'

import { FailPageData } from "./Demo";
import { Button } from "./ui/button"
import Dots from "./ui/Dots";

interface FailPageProps
{
  data?: FailPageData;
  goToThankYouPage: () => void;
}

const FailPage = ({ data, goToThankYouPage }: FailPageProps) =>
{
  return (
    <div className="absolute top-0 left-0 w-full z-50  text-center p-4 h-full flex flex-col justify-center items-center bg-transparent">
      <div className="bg-white  -z-30 w-full h-full absolute top-0 left-0"></div>
      <div className="text-3xl mt-32 mb-3 font-semibold text-black"> {data?.header}</div>
      <p className="text-lg my-4 text-black">{data?.subHeader}</p>
      <p className="text-lg my-4 text-black">{data?.description}</p>
      <Dots step={0} />

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

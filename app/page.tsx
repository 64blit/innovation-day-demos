"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Loading from "./loading";
import ClientOnlyProps from "@/components/ClientOnlyProps";

export default function Home()
{
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col justify-center">
        <div className="text-3xl text-center mt-16">Check out our demos!</div>
        <Button
          asChild
          className="bg-blue-500 text-white p-4 rounded-lg mx-4 mb-4 mt-16 text-3xl h-12"
        >
          <Link href="/rapid-medical">Rapid Medical</Link>
        </Button>

        <Button
          asChild
          className="bg-green-500 text-white p-4 rounded-lg m-4 text-3xl h-12"
        >
          <Link href="/cargoshot">CargoShot</Link>
        </Button>

        <Button
          asChild
          className="bg-orange-600 text-white p-4 rounded-lg m-4 text-3xl h-12"
        >
          <Link href="/inventory">Inventory</Link>
        </Button>
      </div>
    </Suspense>
  );
}

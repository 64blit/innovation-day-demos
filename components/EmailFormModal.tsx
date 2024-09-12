'use client';

import
{
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import
{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

interface EmailFormModalProps
{
  onModalClose: () => void;
  title: string;
  description: string;
}

const EmailFormModal = ({ onModalClose, title, description }: EmailFormModalProps) =>
{
  const [ isModalOpen, setIsModalOpen ] = useState(true);

  const handleClose = () =>
  {
    setIsModalOpen(false);
    if (onModalClose)
    {
      onModalClose();
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>)
  {
    console.log(values);
    handleClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full h-full bg-black flex flex-col justify-center">
        <DialogHeader>
          <DialogDescription className="text-white flex flex-col gap-1">
            <h1 className="text-3xl mb-3 font-semibold">Welcome to the<br />{title} demo</h1>
            <h1 className="text-xl my-4 font-bold">POWERED BY <a className="text-sky-700" href="https://eyepop.ai">EYEPOP.AI</a></h1>
            <p className="text-lg my-3">{description}</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6 text-left">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" className="h-12 text-black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-12 bg-eyepop outline outline-1 outline-white">
                  <p className="text-white font-bold text-md">Submit</p>
                </Button>
              </form>
            </Form>
            <DialogClose asChild className="w-full h-12 mt-4">
              <Button type="button" variant="secondary" className="bg-transparent text-white">
                Skip
              </Button>
            </DialogClose>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EmailFormModal

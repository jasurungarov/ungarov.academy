"use client";

import useTranslate from "@/hooks/use-translate";
import { contactSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { trackContactLead } from "@/lib/analytics";

function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslate();
  const { lng } = useParams<{ lng: string }>();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      message: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setIsLoading(true);

    const promise = (async () => {
     const response = await fetch(`/${lng}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || data.success !== true) {
        throw new Error("Failed to send message");
      }

      form.reset();
      trackContactLead();
    })();

    toast.promise(promise, {
      loading: t("loading"),
      success: t("successfully"),
      error: t("error"),
    });

    try {
      await promise;
    } catch {
      // Error notification is handled by toast.
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  disabled={isLoading}
                  className="h-32 resize-none"
                  placeholder={t("contactFormTextarea")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={t("contactFormEmail")}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={t("contactFormName")}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-fit border"
          size={"lg"}
          type="submit"
          disabled={isLoading}
          rounded={"full"}>
          <span>{t("send")}</span>
          <Send className="ml-2 size-4" />
        </Button>
      </form>
    </Form>
  );
}

export default ContactForm;

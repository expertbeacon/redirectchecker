"use client"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/api";
import { cn } from "@/lib/utils";
import { ResponseInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Faqs } from "../../shared/faqs";
import { Results } from "./results";
import { UserAgentSelect } from "@/components/shared/user-agent-select";
import { getUserAgentById, getDefaultUserAgent } from "@/lib/user-agents";
import { Shield, TrendingUp, Database, Search, Sparkles } from "lucide-react";
import { Markdown } from "@/components/shared/markdown";

const FormValueSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  userAgentId: z.string()
})

type FormValues = z.infer<typeof FormValueSchema>;

export function MainModern({
  markdownContents
}: Readonly<{
  markdownContents: Record<string, string|undefined>;
}>) {
  const { block1 } = markdownContents;
  const t = useTranslations();
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>(false);
  const [userAgent, setUserAgent] = useState<string>("");
  const [infos, setInfos] = useState<ResponseInfo[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormValueSchema),
    defaultValues: {
      url: "",
      userAgentId: getDefaultUserAgent().id
    }
  })

  const faqs = [
    {
      question: t('frontend.home.faq.qa2.question'),
      answer: t('frontend.home.faq.qa2.answer')
    },
    {
      question: t('frontend.home.faq.qa3.question'),
      answer: t('frontend.home.faq.qa3.answer')
    },
    {
      question: t('frontend.home.faq.qa4.question'),
      answer: t('frontend.home.faq.qa4.answer')
    },
    {
      question: t('frontend.home.faq.qa5.question'),
      answer: t('frontend.home.faq.qa5.answer')
    },
  ]

  const handleSubmit = (values: FormValues) => {
    setFetching(true);
    setError(false);
    setInfos([]);

    const selectedUA = getUserAgentById(values.userAgentId);
    const userAgentString = selectedUA?.userAgent || getDefaultUserAgent().userAgent;

    setUserAgent(userAgentString);

    apiClient.post("/redirectcheck", {
      url: values.url,
      headers: {
        "User-Agent": userAgentString
      }
    })
      .then((res) => {
        setInfos(res as any);
        setFetching(false);
      })
      .catch((error) => {
        setError(error.message);
        console.log("error", error);
        setFetching(false);
      });
  }

  return (
    <div className={cn("max-w-5xl mx-auto w-full")}>
      {/* Hero Section - Modern & Minimal */}
      <div className="text-center py-12 px-4 space-y-6">
        {/* Icon & Title */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 shadow-lg">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Redirect Checker
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional URL redirect analyzer with security auditing & SEO insights
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
            <Shield className="w-4 h-4" />
            <span>Security Analysis</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
            <TrendingUp className="w-4 h-4" />
            <span>SEO Impact</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
            <Database className="w-4 h-4" />
            <span>Full Headers</span>
          </div>
        </div>
      </div>

      {/* Search Form - Clean & Spacious */}
      <div className="mb-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* URL Input with Button */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <FormControl>
                      <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Search className="w-5 h-5" />
                        </div>
                        <Input
                          type="url"
                          className="h-14 pl-12 text-lg rounded-xl border-2 focus-visible:ring-2 focus-visible:ring-blue-500"
                          placeholder="Enter URL (e.g., https://example.com)"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <Button
                      type="submit"
                      disabled={!field.value || fetching}
                      className="h-14 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {fetching ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          Analyzing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Check Redirect
                        </span>
                      )}
                    </Button>
                  </div>
                  <FormMessage className="text-center sm:text-left" />
                </FormItem>
              )}
            />

            {/* User-Agent Selector */}
            <FormField
              control={form.control}
              name="userAgentId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <UserAgentSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      className="rounded-xl border-2"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-6 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-900 dark:text-red-200 font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {fetching && (
        <div className="space-y-4 mb-8">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      )}

      {/* Results */}
      {infos.length > 0 && (
        <div className="mb-12">
          <Results
            userAgent={userAgent}
            infos={infos}
          />
        </div>
      )}

      {/* Content Block */}
      {block1 && (
        <div className="mb-12 prose prose-lg dark:prose-invert max-w-none">
          <Markdown content={block1} />
        </div>
      )}

      {/* FAQs */}
      <div className="mb-12">
        <Faqs faqs={faqs} title={t('frontend.home.faq.title')} />
      </div>
    </div>
  );
}

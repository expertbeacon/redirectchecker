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
import { ResultsModern as Results } from "./results-modern";
import { UserAgentSelectModern } from "@/components/shared/user-agent-select-modern";
import { getUserAgentById, getDefaultUserAgent } from "@/lib/user-agents";
import { Shield, TrendingUp, Database, Search, Sparkles, ArrowRight, Zap, Globe, Lock, X } from "lucide-react";
import { Markdown } from "@/components/shared/markdown";
import { FaqsModern } from "../../shared/faqs-modern";
import { HelpfulTools } from "../../shared/helpful-tools";
import { WhyRedirectChecker } from "../../shared/why-redirect-checker";

type FormValues = {
  url: string;
  userAgentId: string;
};

export function MainUltraModern({
  markdownContents
}: Readonly<{
  markdownContents: Record<string, string | undefined>;
}>) {
  const { block1 } = markdownContents;
  const t = useTranslations();

  const FormValueSchema = z.object({
    url: z.string().url(t('frontend.home.validation.url')),
    userAgentId: z.string()
  });
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
    <div className={cn("max-w-6xl mx-auto w-full")}>
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section - Ultra Modern */}
      <div className="text-center py-16 px-4 space-y-8">
        {/* Icon with animation */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse" />
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white shadow-2xl">
            <ArrowRight className="w-10 h-10" strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
              {t('frontend.home.h1')}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            {t('frontend.home.sub_to_h1')}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="group p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-900 hover:border-green-400 dark:hover:border-green-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">{t('frontend.home.features.security.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t('frontend.home.features.security.description')}</p>
          </div>

          <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-900 hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">{t('frontend.home.features.seo.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t('frontend.home.features.seo.description')}</p>
          </div>

          <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-900 hover:border-purple-400 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">{t('frontend.home.features.analysis.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t('frontend.home.features.analysis.description')}</p>
          </div>
        </div>
      </div>

      {/* Search Form - Modern Card */}
      <div className="mb-12 px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-10" />
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 dark:border-gray-800/50 p-8 shadow-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* URL Input */}
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-600 transition-colors duration-200">
                            <Globe className="w-6 h-6" />
                          </div>
                          <Input
                            type="url"
                            className="h-16 pl-14 pr-4 text-lg rounded-2xl border-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all duration-200"
                            placeholder={t('frontend.home.form.placeholder')}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-center" />
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
                        <UserAgentSelectModern
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!form.watch("url") || fetching}
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {fetching ? (
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('frontend.home.form.analyzing')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <Zap className="w-6 h-6" />
                      {t('frontend.home.form.submit')}
                      <Sparkles className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 px-4">
          <div className="p-6 rounded-2xl border-2 border-red-300 dark:border-red-800 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
                <X className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-200">{t('frontend.home.error.title')}</h4>
                <p className="text-red-800 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {fetching && (
        <div className="space-y-4 mb-8 px-4">
          <div className="space-y-3">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      )}

      {/* Results */}
      {infos.length > 0 && (
        <div className="mb-16 px-4">
          <Results
            userAgent={userAgent}
            infos={infos}
          />
        </div>
      )}

      {/* Why Redirect Checker - Marketing Content */}
      <div className="mb-16">
        <WhyRedirectChecker />
      </div>

      {/* Content Block */}
      {block1 && (
        <div className="mb-16 px-4">
          <div className="prose prose-lg dark:prose-invert max-w-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 dark:border-gray-800/50 p-8 md:p-12 shadow-xl">
            <Markdown content={block1} />
          </div>
        </div>
      )}

      {/* FAQs */}
      <div className="mb-16 px-4">
        <FaqsModern faqs={faqs} title={t('frontend.home.faq.title')} />
      </div>

      {/* Helpful Tools */}
      <div className="mb-16 px-4">
        <HelpfulTools />
      </div>
    </div>
  );
}

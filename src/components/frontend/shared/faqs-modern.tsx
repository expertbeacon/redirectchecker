"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TypographyUL } from "@/components/ui/typography";
import ReactMarkdown from 'react-markdown';
import { HelpCircle } from "lucide-react";

type Faq = {
  question: string;
  answer: string;
}

export function FaqsModern({ faqs, title }: { faqs: Faq[], title?: string; }) {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 dark:border-gray-800/50 p-8 md:p-12 shadow-xl">
        {title && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 shadow-lg">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              {title}
            </h2>
          </div>
        )}

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-2 border-gray-200 dark:border-gray-800 rounded-xl px-6 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <AccordionTrigger className="font-semibold text-left hover:no-underline py-5">
                <span className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert text-base max-w-full pt-2 pb-5 ml-9">
                <ReactMarkdown
                  components={{
                    ul: ({ children }) => (
                      <TypographyUL className="my-4 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
                        {children}
                      </TypographyUL>
                    ),
                    a: ({ children, href }) => (
                      <a className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium" href={href}>
                        {children}
                      </a>
                    ),
                    p: ({ children }) => (
                      <p className="text-muted-foreground leading-relaxed">
                        {children}
                      </p>
                    )
                  }}
                >
                  {faq.answer}
                </ReactMarkdown>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

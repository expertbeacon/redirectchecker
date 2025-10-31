"use client"

import { ExternalLink, Code, FileText, Search, Eye, Globe, Wrench, Image, Type } from "lucide-react"
import { useTranslations } from "next-intl"

export function HelpfulTools() {
  const t = useTranslations();

  const tools = [
  {
    name: t('frontend.helpfulTools.tools.faviconExtractor.name'),
    url: "https://www.faviconextractor.com/",
    description: t('frontend.helpfulTools.tools.faviconExtractor.description'),
    icon: Image,
    color: "from-sky-500 to-blue-600"
  },
  {
    name: t('frontend.helpfulTools.tools.faviconGenerator.name'),
    url: "https://www.favicongenerator.io/",
    description: t('frontend.helpfulTools.tools.faviconGenerator.description'),
    icon: Image,
    color: "from-violet-500 to-purple-600"
  },
  {
    name: t('frontend.helpfulTools.tools.fontGenerator.name'),
    url: "https://www.fontgenerator.dev/",
    description: t('frontend.helpfulTools.tools.fontGenerator.description'),
    icon: Type,
    color: "from-rose-500 to-pink-600"
  },
  {
    name: t('frontend.helpfulTools.tools.schemaValidator.name'),
    url: "https://www.schemavalidator.com/",
    description: t('frontend.helpfulTools.tools.schemaValidator.description'),
    icon: Code,
    color: "from-blue-500 to-cyan-600"
  },
  {
    name: t('frontend.helpfulTools.tools.htmlToMarkdown.name'),
    url: "https://www.htmltomarkdown.io/",
    description: t('frontend.helpfulTools.tools.htmlToMarkdown.description'),
    icon: FileText,
    color: "from-purple-500 to-pink-600"
  },
  {
    name: t('frontend.helpfulTools.tools.whatsMyName.name'),
    url: "https://whatsmynameapp.org/",
    description: t('frontend.helpfulTools.tools.whatsMyName.description'),
    icon: Search,
    color: "from-green-500 to-emerald-600"
  },
  {
    name: t('frontend.helpfulTools.tools.publisherLens.name'),
    url: "https://publisherlens.com/",
    description: t('frontend.helpfulTools.tools.publisherLens.description'),
    icon: Eye,
    color: "from-orange-500 to-red-600"
  },
  {
    name: t('frontend.helpfulTools.tools.serpChecking.name'),
    url: "https://www.serpchecking.com/",
    description: t('frontend.helpfulTools.tools.serpChecking.description'),
    icon: Search,
    color: "from-indigo-500 to-purple-600"
  },
  {
    name: t('frontend.helpfulTools.tools.isItDown.name'),
    url: "https://isitdownorjustme.net/",
    description: t('frontend.helpfulTools.tools.isItDown.description'),
    icon: Globe,
    color: "from-teal-500 to-cyan-600"
  }
];


  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 dark:border-gray-800/50 p-8 md:p-12 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 text-white mb-4 shadow-lg">
            <Wrench className="w-7 h-7" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2">
            {t('frontend.helpfulTools.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('frontend.helpfulTools.subtitle')}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <a
                key={index}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                     style={{
                       backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`
                     }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

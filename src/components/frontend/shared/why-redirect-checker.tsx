"use client"

import { CheckCircle, Zap, Shield, TrendingUp, Target, AlertTriangle, Clock, Globe2 } from "lucide-react"
import { useTranslations } from "next-intl"

export function WhyRedirectChecker() {
  const t = useTranslations();

  const whyNeeded = [
  {
    icon: AlertTriangle,
    title: t('frontend.whyRedirectChecker.problems.brokenChains.title'),
    description: t('frontend.whyRedirectChecker.problems.brokenChains.description'),
    impact: t('frontend.whyRedirectChecker.problems.brokenChains.impact')
  },
  {
    icon: Clock,
    title: t('frontend.whyRedirectChecker.problems.slowLoad.title'),
    description: t('frontend.whyRedirectChecker.problems.slowLoad.description'),
    impact: t('frontend.whyRedirectChecker.problems.slowLoad.impact')
  },
  {
    icon: Shield,
    title: t('frontend.whyRedirectChecker.problems.security.title'),
    description: t('frontend.whyRedirectChecker.problems.security.description'),
    impact: t('frontend.whyRedirectChecker.problems.security.impact')
  },
  {
    icon: TrendingUp,
    title: t('frontend.whyRedirectChecker.problems.seo.title'),
    description: t('frontend.whyRedirectChecker.problems.seo.description'),
    impact: t('frontend.whyRedirectChecker.problems.seo.impact')
  }
];

  const features = [
  {
    icon: Target,
    title: t('frontend.whyRedirectChecker.features.chainAnalysis.title'),
    description: t('frontend.whyRedirectChecker.features.chainAnalysis.description')
  },
  {
    icon: Shield,
    title: t('frontend.whyRedirectChecker.features.securityAudit.title'),
    description: t('frontend.whyRedirectChecker.features.securityAudit.description')
  },
  {
    icon: TrendingUp,
    title: t('frontend.whyRedirectChecker.features.seoAssessment.title'),
    description: t('frontend.whyRedirectChecker.features.seoAssessment.description')
  },
  {
    icon: Globe2,
    title: t('frontend.whyRedirectChecker.features.userAgentTesting.title'),
    description: t('frontend.whyRedirectChecker.features.userAgentTesting.description')
  },
  {
    icon: Zap,
    title: t('frontend.whyRedirectChecker.features.performanceMetrics.title'),
    description: t('frontend.whyRedirectChecker.features.performanceMetrics.description')
  },
  {
    icon: CheckCircle,
    title: t('frontend.whyRedirectChecker.features.exportTools.title'),
    description: t('frontend.whyRedirectChecker.features.exportTools.description')
  }
];


  return (
    <div className="space-y-16 px-4">
      {/* Why You Need This Tool */}
      <div className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-red-400/10 dark:bg-red-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-400/10 dark:bg-orange-600/5 rounded-full blur-3xl" />
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 dark:border-gray-800/50 p-8 md:p-12 shadow-xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 text-white mb-4 shadow-lg">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-3">
              {t('frontend.whyRedirectChecker.whyNeeded.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('frontend.whyRedirectChecker.whyNeeded.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyNeeded.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-900 border-2 border-red-200 dark:border-red-900/50 rounded-2xl p-6 hover:border-red-400 dark:hover:border-red-700 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                      {item.impact}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Our Unique Features */}
      <div className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl" />
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 dark:border-gray-800/50 p-8 md:p-12 shadow-xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 shadow-lg">
              <Zap className="w-7 h-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-3">
              {t('frontend.whyRedirectChecker.whatMakesDifferent.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('frontend.whyRedirectChecker.whatMakesDifferent.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-900 rounded-2xl p-8">
              <p className="text-lg font-semibold mb-2">
                <span className="text-2xl">🎯</span> {t('frontend.whyRedirectChecker.cta.stats')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('frontend.whyRedirectChecker.cta.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

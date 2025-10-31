"use client"

import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponseInfo } from "@/types";
import { TidyURL } from '@protontech/tidy-url';
import { ArrowRight, Copy, Check, Shield, TrendingUp, Database, Eye, Activity } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SecurityAnalysisComponent } from "./security-analysis";
import { SEOAnalysisComponent } from "./seo-analysis";
import { HeaderAnalysisComponent } from "./header-analysis";
import { ExportButton } from "./export-button";
import { VisualChain } from "./visual-chain";

export const ResultsModern = ({ infos, userAgent }: {
  infos: ResponseInfo[];
  userAgent: string;
}) => {
  if (infos.length === 0) return null;
  const fromUrl = infos[0].url;
  const t = useTranslations();
  const [stripTracking, setStripTracking] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const clearUrl = (url: string) => {
    return stripTracking ? TidyURL.clean(url).url : url
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const finalDestination = infos[infos.length - 1];
  const hasRedirects = infos.length > 1 || (infos.length === 1 && infos[0].location);
  const hasSecurity = finalDestination.security;
  const hasSEO = finalDestination.seo;

  const getStatusColor = (status: number) => {
    if (status === 0) return "text-red-600 dark:text-red-400";
    if (status >= 200 && status < 300) return "text-green-600 dark:text-green-400";
    if (status >= 300 && status < 400) return "text-yellow-600 dark:text-yellow-400";
    if (status >= 400 && status < 500) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusBadgeColor = (status: number) => {
    if (status === 0) return "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800";
    if (status >= 200 && status < 300) return "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800";
    if (status >= 300 && status < 400) return "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800";
    return "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800";
  };

  const getRedirectTypeLabel = (info: ResponseInfo) => {
    if (info.redirectType === 'meta-refresh') return 'Meta Refresh';
    if (info.redirectType === 'javascript') return 'JavaScript Redirect';
    if (info.redirectType === 'http') return `HTTP ${info.status}`;
    return '';
  };

  return (
    <>
      <div className="text-xs font-mono text-muted-foreground mb-4 px-4 py-2 bg-muted/50 rounded-lg border border-border">
        <span className="font-semibold">User-Agent:</span> {userAgent}
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-10" />
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 dark:border-gray-800/50 p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    Analysis Results
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {infos.length} hop{infos.length > 1 ? 's' : ''} detected
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground break-all pl-15">
                {fromUrl}
              </p>
            </div>
            <ExportButton infos={infos} />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 h-14 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-1.5 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-inner">
              <TabsTrigger
                value="overview"
                className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg transition-all duration-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="visual"
                className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg transition-all duration-200"
              >
                Visual
              </TabsTrigger>
              {hasSecurity && (
                <TabsTrigger
                  value="security"
                  className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Shield size={16} className="mr-1.5" />
                  Security
                </TabsTrigger>
              )}
              {hasSEO && (
                <TabsTrigger
                  value="seo"
                  className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <TrendingUp size={16} className="mr-1.5" />
                  SEO
                </TabsTrigger>
              )}
              <TabsTrigger
                value="details"
                className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg transition-all duration-200"
              >
                <Database size={16} className="mr-1.5" />
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-900">
                <div className="text-sm font-semibold">
                  {hasRedirects ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-orange-700 dark:text-orange-300">
                        {infos.filter(i => i.location).length} redirect(s) detected
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-green-700 dark:text-green-300">
                        {t('frontend.home.no_redirects_found')}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl border border-border">
                  <span className="text-sm font-medium">{t('shared.strip_tracking_parameters')}</span>
                  <Switch
                    checked={stripTracking}
                    onCheckedChange={setStripTracking}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {infos.map((info, index) => (
                  <div key={index}>
                    {info.location ? (
                      <div className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                            {index + 1}
                          </div>
                          <span className="font-semibold text-muted-foreground">Redirect Step</span>
                          <span className={`text-xs px-3 py-1 rounded-full border-2 font-semibold ${getStatusBadgeColor(info.status)}`}>
                            {getRedirectTypeLabel(info)}
                          </span>
                        </div>

                        <div className="space-y-3 pl-11">
                          <div className="flex items-start gap-3">
                            <span className="text-sm font-semibold text-muted-foreground shrink-0">From:</span>
                            <div className="flex-1 flex items-center gap-2">
                              <span className="text-sm break-all font-mono">{clearUrl(info.url)}</span>
                              <button
                                onClick={() => handleCopyUrl(clearUrl(info.url))}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors duration-200"
                                title="Copy URL"
                              >
                                {copiedUrl === clearUrl(info.url) ? (
                                  <Check size={16} className="text-green-600" />
                                ) : (
                                  <Copy size={16} className="text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pl-6">
                            <ArrowRight size={20} className="text-blue-600 dark:text-blue-400" />
                            <span className={`text-sm font-bold ${getStatusColor(info.status)}`}>
                              {info.status} {info.statusText}
                            </span>
                            <span className="text-xs px-2 py-1 bg-muted rounded-lg font-mono">{info.duration}</span>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400 shrink-0">To:</span>
                            <div className="flex-1 flex items-center gap-2">
                              <span className="text-sm text-green-700 dark:text-green-300 break-all font-mono font-semibold">
                                {clearUrl(info.location)}
                              </span>
                              <button
                                onClick={() => handleCopyUrl(clearUrl(info.location!))}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors duration-200"
                                title="Copy URL"
                              >
                                {copiedUrl === clearUrl(info.location!) ? (
                                  <Check size={16} className="text-green-600" />
                                ) : (
                                  <Copy size={16} className="text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`relative overflow-hidden rounded-2xl p-6 border-2 ${
                        info.status === 0
                          ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-400 dark:border-red-800'
                          : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-400 dark:border-green-800'
                      } shadow-lg`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 rounded-full blur-2xl" />

                        <div className="relative">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                              info.status === 0
                                ? 'bg-gradient-to-br from-red-500 to-red-600'
                                : 'bg-gradient-to-br from-green-500 to-emerald-600'
                            }`}>
                              ✓
                            </div>
                            <div>
                              <span className="font-bold text-lg">
                                {t('frontend.home.final_destination')}
                              </span>
                              <span className={`ml-3 text-xs px-3 py-1 rounded-full border-2 font-semibold ${
                                info.status === 200 ? getStatusBadgeColor(200) : getStatusBadgeColor(0)
                              }`}>
                                {info.status === 200 ? 'Success' : 'Failed'}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3 pl-13">
                            <div className="flex items-start gap-3">
                              <span className="text-sm font-semibold text-muted-foreground shrink-0">URL:</span>
                              <div className="flex-1 flex items-center gap-2">
                                <span className={`text-sm break-all font-mono font-semibold ${
                                  info.status === 0 ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'
                                }`}>
                                  {clearUrl(info.url)}
                                </span>
                                <button
                                  onClick={() => handleCopyUrl(clearUrl(info.url))}
                                  className="p-2 hover:bg-secondary rounded-lg transition-colors duration-200"
                                  title="Copy URL"
                                >
                                  {copiedUrl === clearUrl(info.url) ? (
                                    <Check size={16} className="text-green-600" />
                                  ) : (
                                    <Copy size={16} className="text-muted-foreground" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-muted-foreground">Status:</span>
                              <span className={`text-sm font-bold ${getStatusColor(info.status)}`}>
                                {info.status} {info.statusText}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-muted-foreground">Duration:</span>
                              <span className="text-sm px-2 py-1 bg-muted rounded-lg font-mono">{info.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="visual">
              <VisualChain infos={infos} />
            </TabsContent>

            {hasSecurity && (
              <TabsContent value="security">
                <SecurityAnalysisComponent security={finalDestination.security!} />
              </TabsContent>
            )}

            {hasSEO && (
              <TabsContent value="seo">
                <SEOAnalysisComponent seo={finalDestination.seo!} />
              </TabsContent>
            )}

            <TabsContent value="details">
              <div className="space-y-6">
                {infos.map((info, index) => (
                  <div key={index} className="border-2 border-border rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span>{info.location ? `Hop ${index + 1}` : 'Final Destination'}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        ({info.host})
                      </span>
                    </h4>
                    <HeaderAnalysisComponent info={info} />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

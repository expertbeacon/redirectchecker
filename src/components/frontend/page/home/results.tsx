"use client"

import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponseInfo } from "@/types";
import { TidyURL } from '@protontech/tidy-url';
import { SearchCheckIcon, ArrowRight, Copy, Check, Shield, TrendingUp, Database } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SecurityAnalysisComponent } from "./security-analysis";
import { SEOAnalysisComponent } from "./seo-analysis";
import { HeaderAnalysisComponent } from "./header-analysis";
import { ExportButton } from "./export-button";
import { VisualChain } from "./visual-chain";

export const Results = ({ infos, userAgent }: {
  infos: ResponseInfo[];
  userAgent: string;
}) => {
  if(infos.length === 0 ) return null;
  const fromUrl = infos[0].url;
  const t = useTranslations();
  const [stripTracking, setStripTracking] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const clearUrl=(url: string)=>{
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
    if (status === 0) return "text-red-600";
    if (status >= 200 && status < 300) return "text-green-600";
    if (status >= 300 && status < 400) return "text-yellow-600";
    if (status >= 400 && status < 500) return "text-orange-600";
    return "text-red-600";
  };

  const getRedirectTypeLabel = (info: ResponseInfo) => {
    if (info.redirectType === 'meta-refresh') return 'Meta Refresh';
    if (info.redirectType === 'javascript') return 'JavaScript Redirect';
    if (info.redirectType === 'http') return `HTTP ${info.status}`;
    return '';
  };

  return(
    <>
    <div className="text-xs text-muted-foreground mb-3 font-mono">
      User-Agent: {userAgent}
    </div>

    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-100 dark:border-gray-800 p-8 animate-fade-in-up">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <SearchCheckIcon size={28} className="text-green-600" />
            <h2 className="text-2xl font-bold">Analysis Results</h2>
          </div>
          <p className="text-sm text-muted-foreground break-all">
            {fromUrl}
          </p>
        </div>
        <ExportButton infos={infos} />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 h-12 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Overview</TabsTrigger>
          <TabsTrigger value="visual" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Visual Chain</TabsTrigger>
          {hasSecurity && (
            <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Shield size={14} className="mr-1" />
              Security
            </TabsTrigger>
          )}
          {hasSEO && (
            <TabsTrigger value="seo" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <TrendingUp size={14} className="mr-1" />
              SEO
            </TabsTrigger>
          )}
          <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            <Database size={14} className="mr-1" />
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium">
              {hasRedirects ? (
                <span className="text-orange-600">
                  {infos.filter(i => i.location).length} redirect(s) detected
                </span>
              ) : (
                <span className="text-green-600">
                  {t('frontend.home.no_redirects_found')}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{t('shared.strip_tracking_parameters')}</span>
              <Switch
                checked={stripTracking}
                onCheckedChange={setStripTracking}
              />
            </div>
          </div>

          <div className="space-y-3">
            {infos.map((info, index) => (
              <div key={index}>
                {info.location ? (
                  <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Step {index + 1}</span>
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded">
                        {getRedirectTypeLabel(info)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-muted-foreground">From:</span>
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-sm break-all">{clearUrl(info.url)}</span>
                          <button
                            onClick={() => handleCopyUrl(clearUrl(info.url))}
                            className="p-1 hover:bg-secondary rounded"
                            title="Copy URL"
                          >
                            {copiedUrl === clearUrl(info.url) ? (
                              <Check size={14} className="text-green-600" />
                            ) : (
                              <Copy size={14} className="text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-6">
                        <ArrowRight size={16} className="text-muted-foreground" />
                        <span className={`text-sm font-semibold ${getStatusColor(info.status)}`}>
                          {info.status} {info.statusText}
                        </span>
                        <span className="text-xs text-muted-foreground">({info.duration})</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-muted-foreground">To:</span>
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-sm text-green-600 dark:text-green-400 break-all">
                            {clearUrl(info.location)}
                          </span>
                          <button
                            onClick={() => handleCopyUrl(clearUrl(info.location!))}
                            className="p-1 hover:bg-secondary rounded"
                            title="Copy URL"
                          >
                            {copiedUrl === clearUrl(info.location!) ? (
                              <Check size={14} className="text-green-600" />
                            ) : (
                              <Copy size={14} className="text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`bg-gradient-to-br rounded-xl p-5 border-2 ${
                    info.status === 0
                      ? 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-500'
                      : 'from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 border-green-500'
                  }`}>
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <span className={info.status === 0 ? 'text-red-600' : ''}>
                        {t('frontend.home.final_destination')}
                      </span>
                      {info.status === 200 && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                          Success
                        </span>
                      )}
                      {info.status === 0 && (
                        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-0.5 rounded">
                          Failed
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-muted-foreground">URL:</span>
                        <div className="flex-1 flex items-center gap-2">
                          <span className={`text-sm break-all ${info.status === 0 ? 'text-red-600' : 'text-green-600 dark:text-green-400'}`}>
                            {clearUrl(info.url)}
                          </span>
                          <button
                            onClick={() => handleCopyUrl(clearUrl(info.url))}
                            className="p-1 hover:bg-secondary rounded"
                            title="Copy URL"
                          >
                            {copiedUrl === clearUrl(info.url) ? (
                              <Check size={14} className="text-green-600" />
                            ) : (
                              <Copy size={14} className="text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Status:</span>
                        <span className={`text-sm font-semibold ${getStatusColor(info.status)}`}>
                          {info.status} {info.statusText}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Duration:</span>
                        <span className="text-sm text-muted-foreground">{info.duration}</span>
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
              <div key={index} className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  {info.location ? `Hop ${index + 1}` : 'Final Destination'}
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
    </>
  )
}

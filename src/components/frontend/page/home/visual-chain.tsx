"use client"

import { ResponseInfo } from "@/types";
import { ArrowRight, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface VisualChainProps {
  infos: ResponseInfo[];
}

export function VisualChain({ infos }: VisualChainProps) {
  const getStatusIcon = (status: number) => {
    if (status === 0) return <XCircle className="text-red-600" size={24} />;
    if (status >= 200 && status < 300) return <CheckCircle2 className="text-green-600" size={24} />;
    if (status >= 300 && status < 400) return <ArrowRight className="text-yellow-600" size={24} />;
    return <AlertTriangle className="text-orange-600" size={24} />;
  };

  const getStatusColor = (status: number) => {
    if (status === 0) return "border-red-500 bg-red-50 dark:bg-red-900/20";
    if (status >= 200 && status < 300) return "border-green-500 bg-green-50 dark:bg-green-900/20";
    if (status >= 300 && status < 400) return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
    return "border-orange-500 bg-orange-50 dark:bg-orange-900/20";
  };

  const getTotalTime = () => {
    return infos.reduce((sum, info) => {
      const time = parseFloat(info.duration.replace(' s', ''));
      return sum + (isNaN(time) ? 0 : time);
    }, 0).toFixed(3);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Redirect Chain Visualization</h3>
        <div className="text-sm text-muted-foreground">
          Total Time: <span className="font-semibold">{getTotalTime()}s</span>
        </div>
      </div>

      <div className="relative">
        {infos.map((info, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Node */}
            <div
              className={`w-full border-2 rounded-lg p-4 ${getStatusColor(info.status)} transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(info.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {info.location ? `Step ${index + 1}` : 'Final'}
                    </span>
                    {info.redirectType && info.redirectType !== 'none' && (
                      <span className="text-xs bg-white/50 dark:bg-black/30 px-2 py-0.5 rounded">
                        {info.redirectType === 'meta-refresh' && 'Meta Refresh'}
                        {info.redirectType === 'javascript' && 'JavaScript'}
                        {info.redirectType === 'http' && `HTTP ${info.status}`}
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-mono break-all mb-1">
                    {info.url}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-semibold">
                      {info.status} {info.statusText}
                    </span>
                    <span>•</span>
                    <span>{info.duration}</span>
                    {info.server?.name && (
                      <>
                        <span>•</span>
                        <span>{info.server.name}</span>
                      </>
                    )}
                  </div>

                  {info.ssl && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-green-600 dark:text-green-400">
                        ���� {info.ssl.protocol}
                      </span>
                    </div>
                  )}

                  {(info.security || info.seo) && (
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      {info.security && (
                        <span className={`font-semibold ${
                          info.security.score >= 80 ? 'text-green-600' :
                          info.security.score >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          Security: {info.security.score}/100
                        </span>
                      )}
                      {info.seo && (
                        <span className={`font-semibold ${
                          info.seo.impactScore >= 85 ? 'text-green-600' :
                          info.seo.impactScore >= 70 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          SEO: {info.seo.impactScore}/100
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Arrow */}
            {info.location && index < infos.length - 1 && (
              <div className="flex flex-col items-center my-2">
                <ArrowRight className="text-muted-foreground rotate-90" size={32} />
                <span className="text-xs text-muted-foreground font-semibold mt-1">
                  {info.status} Redirect
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-secondary/30 rounded-lg p-4 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Total Hops</div>
            <div className="text-lg font-semibold">{infos.length}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Redirects</div>
            <div className="text-lg font-semibold">
              {infos.filter(i => i.location).length}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Final Status</div>
            <div className="text-lg font-semibold">
              {infos[infos.length - 1].status}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Total Time</div>
            <div className="text-lg font-semibold">{getTotalTime()}s</div>
          </div>
        </div>
      </div>
    </div>
  );
}

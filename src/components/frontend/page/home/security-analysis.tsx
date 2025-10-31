"use client"

import { SecurityAnalysis } from "@/types";
import { Shield, AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SecurityAnalysisProps {
  security: SecurityAnalysis;
}

export function SecurityAnalysisComponent({ security }: SecurityAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const getSeverityIcon = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return <XCircle className="text-red-600" size={20} />;
      case 'high':
        return <AlertTriangle className="text-orange-600" size={20} />;
      case 'medium':
        return <AlertTriangle className="text-yellow-600" size={20} />;
      case 'low':
        return <Info className="text-blue-600" size={20} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Shield className={getScoreColor(security.score)} size={32} />
        <div>
          <h3 className="text-xl font-semibold">Security Analysis</h3>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getScoreColor(security.score)}`}>
              {security.score}/100
            </span>
            <span className="text-sm text-muted-foreground">
              {getScoreLabel(security.score)}
            </span>
          </div>
        </div>
      </div>

      {security.mixedContent && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-red-600 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-200">Mixed Content Warning</p>
              <p className="text-sm text-red-800 dark:text-red-300">
                This redirect chain contains both HTTPS and HTTP URLs, creating a security vulnerability.
              </p>
            </div>
          </div>
        </div>
      )}

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="headers">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Security Headers</span>
              <span className="text-sm text-muted-foreground">
                ({Object.keys(security.headers).length} configured)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pl-4">
              <HeaderStatus
                name="HSTS (Strict-Transport-Security)"
                present={!!security.headers.hsts}
                details={
                  security.headers.hsts
                    ? `max-age=${security.headers.hsts.maxAge}${
                        security.headers.hsts.includeSubDomains ? ', includeSubDomains' : ''
                      }${security.headers.hsts.preload ? ', preload' : ''}`
                    : undefined
                }
              />
              <HeaderStatus
                name="CSP (Content-Security-Policy)"
                present={!!security.headers.csp}
                details={security.headers.csp}
              />
              <HeaderStatus
                name="X-Frame-Options"
                present={!!security.headers.xFrameOptions}
                details={security.headers.xFrameOptions}
              />
              <HeaderStatus
                name="X-Content-Type-Options"
                present={!!security.headers.xContentTypeOptions}
                details={security.headers.xContentTypeOptions ? "nosniff" : undefined}
              />
              <HeaderStatus
                name="Referrer-Policy"
                present={!!security.headers.referrerPolicy}
                details={security.headers.referrerPolicy}
              />
              <HeaderStatus
                name="Permissions-Policy"
                present={!!security.headers.permissionsPolicy}
                details={security.headers.permissionsPolicy}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {security.issues.length > 0 && (
          <AccordionItem value="issues">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Security Issues</span>
                <span className="text-sm text-red-600">
                  ({security.issues.length} found)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pl-4">
                {security.issues.map((issue, index) => (
                  <div key={index} className="border-l-2 border-gray-300 pl-3 space-y-1">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(issue.severity)}
                      <span className="font-semibold">{issue.title}</span>
                      <span className="text-xs uppercase text-muted-foreground">
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      💡 {issue.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {security.recommendations.length > 0 && (
          <AccordionItem value="recommendations">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Recommendations</span>
                <span className="text-sm text-muted-foreground">
                  ({security.recommendations.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pl-4">
                {security.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}

function HeaderStatus({
  name,
  present,
  details
}: {
  name: string;
  present: boolean;
  details?: string;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      {present ? (
        <CheckCircle2 className="text-green-600 mt-0.5" size={16} />
      ) : (
        <XCircle className="text-red-600 mt-0.5" size={16} />
      )}
      <div className="flex-1">
        <span className={present ? "text-foreground" : "text-muted-foreground"}>
          {name}
        </span>
        {details && (
          <p className="text-xs text-muted-foreground mt-0.5 font-mono break-all">
            {details}
          </p>
        )}
      </div>
    </div>
  );
}

"use client"

import { SEOAnalysis } from "@/types";
import { TrendingUp, AlertCircle, CheckCircle2, Globe } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SEOAnalysisProps {
  seo: SEOAnalysis;
}

export function SEOAnalysisComponent({ seo }: SEOAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className={getScoreColor(seo.impactScore)} size={32} />
        <div>
          <h3 className="text-xl font-semibold">SEO Analysis</h3>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getScoreColor(seo.impactScore)}`}>
              {seo.impactScore}/100
            </span>
            <span className="text-sm text-muted-foreground">
              {getScoreLabel(seo.impactScore)}
            </span>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="meta-tags">
          <AccordionTrigger>
            <span className="font-semibold">Meta Tags & Content</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pl-4">
              <MetaTagStatus label="Title" value={seo.title} />
              <MetaTagStatus label="Meta Description" value={seo.metaDescription} />
              <MetaTagStatus label="H1 Heading" value={seo.h1} />
              <MetaTagStatus
                label="Canonical URL"
                value={seo.canonical}
                copyable
              />
              <MetaTagStatus
                label="Robots Meta Tag"
                value={seo.metaRobots}
                warning={seo.metaRobots?.includes('noindex')}
              />
              <MetaTagStatus
                label="X-Robots-Tag Header"
                value={seo.robotsTag}
                warning={seo.robotsTag?.includes('noindex')}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {seo.hreflang && seo.hreflang.length > 0 && (
          <AccordionItem value="hreflang">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Globe size={18} />
                <span className="font-semibold">Hreflang Tags</span>
                <span className="text-sm text-muted-foreground">
                  ({seo.hreflang.length} languages)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4">
                {seo.hreflang.map((link, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <span className="font-mono text-blue-600 dark:text-blue-400 min-w-[60px]">
                      {link.lang}
                    </span>
                    <span className="text-muted-foreground break-all">{link.url}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="features">
          <AccordionTrigger>
            <span className="font-semibold">Advanced Features</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pl-4">
              <FeatureStatus
                label="Structured Data (JSON-LD)"
                present={seo.hasStructuredData}
              />
              <FeatureStatus
                label="Sitemap Reference"
                present={seo.sitemap}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {seo.recommendations.length > 0 && (
          <AccordionItem value="recommendations">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold">SEO Recommendations</span>
                <span className="text-sm text-muted-foreground">
                  ({seo.recommendations.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pl-4">
                {seo.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
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

function MetaTagStatus({
  label,
  value,
  copyable = false,
  warning = false
}: {
  label: string;
  value?: string;
  copyable?: boolean;
  warning?: boolean;
}) {
  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{label}:</span>
        {warning && (
          <AlertCircle className="text-orange-600" size={14} />
        )}
      </div>
      {value ? (
        <div className="flex items-start gap-2">
          <p className={`text-sm ${warning ? 'text-orange-600' : 'text-muted-foreground'} break-all`}>
            {value}
          </p>
          {copyable && (
            <button
              onClick={handleCopy}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Copy
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">Not found</p>
      )}
    </div>
  );
}

function FeatureStatus({ label, present }: { label: string; present?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {present ? (
        <>
          <CheckCircle2 className="text-green-600" size={16} />
          <span>{label}</span>
        </>
      ) : (
        <>
          <AlertCircle className="text-muted-foreground" size={16} />
          <span className="text-muted-foreground">{label} not detected</span>
        </>
      )}
    </div>
  );
}

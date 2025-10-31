"use client"

import { useState } from "react";
import { Copy, Check, Server, Clock, Database } from "lucide-react";
import { ResponseInfo } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface HeaderAnalysisProps {
  info: ResponseInfo;
}

export function HeaderAnalysisComponent({ info }: HeaderAnalysisProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const headers = info.headers || {};
  const headerEntries = Object.entries(headers).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Detailed Analysis</h3>

      <Accordion type="single" collapsible className="w-full">
        {/* Server Information */}
        {info.server && (
          <AccordionItem value="server">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Server size={18} />
                <span className="font-semibold">Server Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4">
                {info.server.name && (
                  <div className="text-sm">
                    <span className="font-medium">Server:</span>{' '}
                    <span className="text-muted-foreground">
                      {info.server.name}
                      {info.server.version && ` v${info.server.version}`}
                    </span>
                  </div>
                )}
                {info.server.poweredBy && (
                  <div className="text-sm">
                    <span className="font-medium">Powered By:</span>{' '}
                    <span className="text-muted-foreground">{info.server.poweredBy}</span>
                  </div>
                )}
                {info.server.technology && info.server.technology.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Technologies:</span>{' '}
                    <span className="text-muted-foreground">
                      {info.server.technology.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* SSL/TLS Information */}
        {info.ssl && (
          <AccordionItem value="ssl">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <span className="font-semibold">SSL/TLS Certificate</span>
                {!info.ssl.valid && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                    Invalid
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4">
                <div className="text-sm">
                  <span className="font-medium">Status:</span>{' '}
                  <span className={info.ssl.valid ? 'text-green-600' : 'text-red-600'}>
                    {info.ssl.valid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Protocol:</span>{' '}
                  <span className="text-muted-foreground">{info.ssl.protocol}</span>
                </div>
                {info.ssl.cipher && (
                  <div className="text-sm">
                    <span className="font-medium">Cipher:</span>{' '}
                    <span className="text-muted-foreground font-mono text-xs">
                      {info.ssl.cipher}
                    </span>
                  </div>
                )}
                <div className="text-sm">
                  <span className="font-medium">Issuer:</span>{' '}
                  <span className="text-muted-foreground">{info.ssl.issuer}</span>
                </div>
                {info.ssl.subject && (
                  <div className="text-sm">
                    <span className="font-medium">Subject:</span>{' '}
                    <span className="text-muted-foreground">{info.ssl.subject}</span>
                  </div>
                )}
                {info.ssl.expiryDate !== 'N/A' && (
                  <div className="text-sm">
                    <span className="font-medium">Expires:</span>{' '}
                    <span className="text-muted-foreground">
                      {info.ssl.expiryDate} ({info.ssl.daysUntilExpiry} days)
                    </span>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Performance Metrics */}
        {info.timing && (
          <AccordionItem value="timing">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span className="font-semibold">Performance Timing</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4">
                <TimingRow label="Time to First Byte (TTFB)" value={info.timing.ttfb} />
                {info.timing.dns && <TimingRow label="DNS Lookup" value={info.timing.dns} />}
                {info.timing.tcp && <TimingRow label="TCP Connection" value={info.timing.tcp} />}
                {info.timing.tls && <TimingRow label="TLS Handshake" value={info.timing.tls} />}
                {info.timing.download && (
                  <TimingRow label="Content Download" value={info.timing.download} />
                )}
                <TimingRow label="Total Time" value={info.timing.total} bold />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Response Details */}
        <AccordionItem value="response">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Database size={18} />
              <span className="font-semibold">Response Details</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pl-4 text-sm">
              {info.bodySize && (
                <div>
                  <span className="font-medium">Content Size:</span>{' '}
                  <span className="text-muted-foreground">
                    {formatBytes(info.bodySize)}
                  </span>
                </div>
              )}
              {info.compression && (
                <div>
                  <span className="font-medium">Compression:</span>{' '}
                  <span className="text-muted-foreground">{info.compression}</span>
                </div>
              )}
              <div>
                <span className="font-medium">Redirect Type:</span>{' '}
                <span className="text-muted-foreground capitalize">
                  {info.redirectType?.replace('-', ' ') || 'none'}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* HTTP Headers */}
        <AccordionItem value="headers">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span className="font-semibold">HTTP Response Headers</span>
              <span className="text-sm text-muted-foreground">
                ({headerEntries.length})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 pl-4">
              {headerEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-start gap-2 py-1 text-sm hover:bg-secondary/50 rounded px-2 -mx-2"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {key}:
                    </span>{' '}
                    <span className="text-muted-foreground break-all">{value}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(`${key}: ${value}`, key)}
                    className="flex-shrink-0 p-1 hover:bg-secondary rounded"
                    title="Copy header"
                  >
                    {copiedKey === key ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <Copy size={14} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function TimingRow({
  label,
  value,
  bold = false
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between text-sm ${bold ? 'font-semibold' : ''}`}>
      <span>{label}:</span>
      <span className="text-muted-foreground">{value.toFixed(0)} ms</span>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResponseInfo } from "@/types";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { downloadFile, generateCSV, generateJSON, getFilenameFromUrl } from "@/lib/export-generator";

interface ExportButtonProps {
  infos: ResponseInfo[];
}

export function ExportButton({ infos }: ExportButtonProps) {
  const handleExportCSV = () => {
    const csv = generateCSV(infos);
    const filename = getFilenameFromUrl(infos[0].url);
    downloadFile(csv, `${filename}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    const json = generateJSON(infos);
    const filename = getFilenameFromUrl(infos[0].url);
    downloadFile(json, `${filename}.json`, 'application/json');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download size={16} className="mr-2" />
          Export Results
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileSpreadsheet size={16} className="mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson size={16} className="mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useApp } from "@/app/stores/useApp";
import GridTable from "@/components/GridTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";

type FileKey = "clients" | "workers" | "tasks";

function jsonToCSV(json: any[]): string {
  if (!json.length) return "";
  const headers = Object.keys(json[0]);
  const rows = json.map((row) =>
    headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function downloadCSV(filename: string, data: string) {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function DashboardGrid() {
  const { uploadedFiles } = useApp();

  const [validationSummary, setValidationSummary] = useState<Record<FileKey, number>>({
    clients: 0,
    workers: 0,
    tasks: 0,
  });

  const handleExportAll = () => {
    if (uploadedFiles.clients.length)
      downloadCSV("clients.csv", jsonToCSV(uploadedFiles.clients));
    if (uploadedFiles.workers.length)
      downloadCSV("workers.csv", jsonToCSV(uploadedFiles.workers));
    if (uploadedFiles.tasks.length)
      downloadCSV("tasks.csv", jsonToCSV(uploadedFiles.tasks));
  };

  const handleValidationChange = (type: FileKey, count: number) => {
    setValidationSummary((prev) => ({ ...prev, [type]: count }));
  };

  const totalErrors = Object.values(validationSummary).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Data Grids</h2>
          <p className="text-sm text-gray-500">
            {totalErrors === 0
              ? "No validation errors."
              : `⚠️ Total Validation Errors: ${totalErrors}`}
          </p>
        </div>
        <Button onClick={handleExportAll} variant="outline">
          Export All as CSV
        </Button>
      </div>

      <Card className="p-4 text-sm text-gray-700 border border-purple-100 shadow-sm bg-purple-50">
        <p className="font-medium mb-2">Validation Summary:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Clients: {validationSummary.clients} error(s)</li>
          <li>Workers: {validationSummary.workers} error(s)</li>
          <li>Tasks: {validationSummary.tasks} error(s)</li>
        </ul>
      </Card>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="workers">Workers</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <GridTable
            data={uploadedFiles.clients}
            type="clients"
            onValidationChange={handleValidationChange}
          />
        </TabsContent>

        <TabsContent value="workers">
          <GridTable
            data={uploadedFiles.workers}
            type="workers"
            onValidationChange={handleValidationChange}
          />
        </TabsContent>

        <TabsContent value="tasks">
          <GridTable
            data={uploadedFiles.tasks}
            type="tasks"
            onValidationChange={handleValidationChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DashboardGrid;

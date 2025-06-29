"use client";

import { useRef } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { Upload, Users, Briefcase, ClipboardList, CheckCircle, ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CSVRow, useApp } from "./stores/useApp";

type FileKey = "clients" | "workers" | "tasks";

const fileTypes: {
  key: FileKey;
  label: string;
  icon: LucideIcon;
  description: string;
}[] = [
  {
    key: "clients",
    label: "Clients",
    icon: Users,
    description: "Upload client information",
  },
  {
    key: "workers",
    label: "Workers",
    icon: Briefcase,
    description: "Upload worker details",
  },
  {
    key: "tasks",
    label: "Tasks",
    icon: ClipboardList,
    description: "Upload task assignments",
  },
];

export default function UploadFiles() {
  const router = useRouter();
  const { uploadedFiles, setFileData } = useApp();

  const fileInputRefs = {
    clients: useRef<HTMLInputElement>(null),
    workers: useRef<HTMLInputElement>(null),
    tasks: useRef<HTMLInputElement>(null),
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: FileKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setFileData(type, results.data as CSVRow[]);
      },
    });
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2 text-gray-900">Upload CSV Data</h1>
        <p className="text-gray-600 text-sm">Select and upload CSV files to begin data processing.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {fileTypes.map(({ key, label, icon: Icon, description }) => (
          <Card
            key={key}
            className="border rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex gap-3 items-center pb-2">
              <div className="p-2 bg-purple-100 rounded-md">
                <Icon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base">{label}</CardTitle>
                <CardDescription className="text-xs">{description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-md border-2 border-dashed border-gray-300 p-5 text-center cursor-pointer hover:border-purple-400 transition"
                onClick={() => fileInputRefs[key]?.current?.click()}
              >
                <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-700 font-medium">Upload {key}.csv</p>
                <p className="text-xs text-gray-500">Click to browse files</p>
              </div>

              <input
                type="file"
                accept=".csv"
                ref={fileInputRefs[key]}
                onChange={(e) => handleFileUpload(e, key)}
                className="hidden"
              />

              {uploadedFiles[key].length > 0 && (
                <div className="mt-3 flex items-center text-green-600 text-sm gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Uploaded {uploadedFiles[key].length} rows
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          className="bg-purple-600 hover:bg-purple-700 transition-colors"
          onClick={() => router.push("/dashboard/grid")}
        >
          Continue
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </main>
  );
}

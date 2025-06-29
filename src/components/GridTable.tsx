"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CSVRow, useApp } from "@/app/stores/useApp";
import { Button } from "@/components/ui/button";

type GridTableProps = {
  data: CSVRow[];
  type: "clients" | "workers" | "tasks";
  onValidationChange?: (type: "clients" | "workers" | "tasks", count: number) => void;
};

type ValidationError = {
  rowIndex: number;
  field: string;
  message: string;
};

function GridTable({ data, type, onValidationChange }: GridTableProps) {
  const { setFileData } = useApp();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const validateWithAI = useCallback(async (inputData: CSVRow[]) => {
    setLoading(true);
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, data: inputData }),
      });

      const result = await response.json();
      setErrors(result.errors || []);
      onValidationChange?.(type, result.errors?.length || 0);
    } catch {
      onValidationChange?.(type, 0);
    } finally {
      setLoading(false);
    }
  }, [type, onValidationChange, data]);


  useEffect(() => {
    if (!data || data.length === 0) return;

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      validateWithAI(data);
    }, 500);

    setDebounceTimeout(timeout);
  }, [data, validateWithAI]);


  const handleCellChange = (rowIndex: number, key: string, value: string) => {
    const updatedRow = { ...data[rowIndex], [key]: value };
    const updatedData = [...data];
    updatedData[rowIndex] = updatedRow;
    setFileData(type, updatedData);
  };

  const getErrorMessage = (rowIndex: number, field: string) =>
    errors.find(
      (err) =>
        err.rowIndex === rowIndex &&
        err.field.toLowerCase() === field.toLowerCase()
    )?.message;

  if (!data || data.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 capitalize">{type} Table</h2>
        <Button onClick={() => validateWithAI(data)} variant="outline" disabled={loading}>
          {loading ? "Validating..." : "Re-Validate Now"}
        </Button>
      </div>
      <div className="overflow-auto border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((key) => {
                  const errorMessage = getErrorMessage(rowIndex, key);
                  const isErrored = Boolean(errorMessage);

                  return (
                    <td key={key} className="px-4 py-2 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <input
                          className={`w-full bg-transparent outline-none border rounded px-2 py-1 text-sm ${isErrored
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-purple-500"
                            }`}
                          value={row[key] != null ? String(row[key]) : ""}
                          onChange={(e) =>
                            handleCellChange(rowIndex, key, e.target.value)
                          }
                        />
                        {isErrored && (
                          <span className="text-xs text-red-500">{errorMessage}</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GridTable;

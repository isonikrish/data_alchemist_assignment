"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Rule = (
  | { type: "coRun"; tasks: string[] }
  | { type: "slotRestriction"; group: string; minCommonSlots: number }
  | { type: "loadLimit"; group: string; maxSlotsPerPhase: number }
) & {
  priority: number;
};

export default function Rules() {
  const [ruleType, setRuleType] = useState<Rule["type"]>("coRun");
  const [coRunTasks, setCoRunTasks] = useState("");
  const [slotGroup, setSlotGroup] = useState("");
  const [minSlots, setMinSlots] = useState(1);
  const [loadGroup, setLoadGroup] = useState("");
  const [maxLoad, setMaxLoad] = useState(1);
  const [priority, setPriority] = useState(1);
  const [rules, setRules] = useState<Rule[]>([]);

  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddRule = () => {
    const base = { priority };
    if (ruleType === "coRun") {
      const tasks = coRunTasks.split(",").map((t) => t.trim());
      if (tasks.length >= 2) {
        setRules([...rules, { type: "coRun", tasks, ...base }]);
        setCoRunTasks("");
        setPriority(1);
      }
    } else if (ruleType === "slotRestriction" && slotGroup) {
      setRules([
        ...rules,
        { type: "slotRestriction", group: slotGroup, minCommonSlots: minSlots, ...base },
      ]);
      setSlotGroup("");
      setMinSlots(1);
      setPriority(1);
    } else if (ruleType === "loadLimit" && loadGroup) {
      setRules([
        ...rules,
        { type: "loadLimit", group: loadGroup, maxSlotsPerPhase: maxLoad, ...base },
      ]);
      setLoadGroup("");
      setMaxLoad(1);
      setPriority(1);
    }
  };

  const handleDownload = () => {
    const sorted = [...rules].sort((a, b) => a.priority - b.priority);
    const blob = new Blob([JSON.stringify(sorted, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rules.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAIConvert = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-rule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const json = await res.json();
      if (json.rule) {
        setRules([...rules, { ...json.rule, priority }]);
        setAiPrompt("");
        setPriority(1);
      } else {
        toast.error("AI could not understand the rule.");
      }
    } catch {
      toast.error("Failed to generate rule from AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Rule Builder</h2>
        {rules.length > 0 && (
          <Button size="sm" onClick={handleDownload}>
            Generate Rules Config
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Rule with AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder='e.g. "Run T1 and T2 together"'
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={4}
            />
            <label className="font-medium text-sm">Priority:</label>
            <Input
              type="number"
              min={1}
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              placeholder="Priority (lower = higher)"
            />
            <Button onClick={handleAIConvert} disabled={loading} size="sm">
              {loading ? "Thinking..." : "Generate with AI"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Rule Manually</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="font-medium text-sm">Type:</label>
              <select
                className="border rounded px-3 py-1 text-sm"
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value as Rule["type"])}
              >
                <option value="coRun">Co-Run</option>
                <option value="slotRestriction">Slot Restriction</option>
                <option value="loadLimit">Load Limit</option>
              </select>
            </div>
            <label className="font-medium text-sm">Priority:</label>
            <Input
              type="number"
              min={1}
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              placeholder="Priority (lower = higher)"
            />

            {ruleType === "coRun" && (
              <Input
                placeholder="Task IDs (comma-separated)"
                value={coRunTasks}
                onChange={(e) => setCoRunTasks(e.target.value)}
              />
            )}

            {ruleType === "slotRestriction" && (
              <>
                <Input
                  placeholder="Group Name"
                  value={slotGroup}
                  onChange={(e) => setSlotGroup(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Min Common Slots"
                  value={minSlots}
                  onChange={(e) => setMinSlots(Number(e.target.value))}
                />
              </>
            )}

            {ruleType === "loadLimit" && (
              <>
                <Input
                  placeholder="Worker Group"
                  value={loadGroup}
                  onChange={(e) => setLoadGroup(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max Slots per Phase"
                  value={maxLoad}
                  onChange={(e) => setMaxLoad(Number(e.target.value))}
                />
              </>
            )}

            <Button onClick={handleAddRule} size="sm">
              Add Rule
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Current Rules ({rules.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <p className="text-sm text-gray-500">No rules added yet.</p>
          ) : (
            <Textarea
              className="text-sm font-mono"
              rows={10}
              value={JSON.stringify(rules, null, 2)}
              readOnly
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

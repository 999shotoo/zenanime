"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ServerOption {
  name: string;
  servers: string[];
}

const serverOptions: ServerOption[] = [
  {
    name: "Sub",
    servers: ["Takiko", "Hikuto", "Remove 1080p"],
  },
  {
    name: "Dub",
    servers: ["Takiko", "Hikuto", "Remove 1080p"],
  },
];

export function ServerSelect() {
  return (
    <Card className="space-y-4">
      {serverOptions.map((option) => (
        <div key={option.name} className="space-y-2 flex gap-8">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span className="block w-2 h-2 rounded-full bg-blue-500" />
            {option.name}
          </div>
          <div className="flex flex-wrap gap-2">
            {option.servers.map((server) => (
              <Button
                key={server}
                variant="outline"
                className="h-8 bg-[#2a2b36] border-0 text-white hover:bg-[#3a3b46] hover:text-white"
              >
                {server}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}

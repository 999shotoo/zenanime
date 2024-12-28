"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

export function AnimeTabs() {
  const [activeTab, setActiveTab] = useState("characters");

  return (
    <Card className="bg-card mt-4">
      <Tabs defaultValue="characters" className="w-full">
        <TabsList className="border-b rounded-none h-12 bg-transparent">
          <TabsTrigger
            value="characters"
            className="data-[state=active]:bg-transparent data-[state=active]:text-primary"
          >
            Characters
          </TabsTrigger>
          <TabsTrigger
            value="relation"
            className="data-[state=active]:bg-transparent data-[state=active]:text-primary"
          >
            Relation
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="data-[state=active]:bg-transparent data-[state=active]:text-primary"
          >
            Comments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="characters" className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <Image
                src="/placeholder.svg"
                alt="Character"
                width={64}
                height={64}
              />
            </Avatar>
            <div>
              <h3 className="font-semibold">Prequel</h3>
              <p className="text-sm text-muted-foreground">BLUE LOCK</p>
              <p className="text-xs text-muted-foreground">TV • Finished</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="relation">Relation content</TabsContent>
        <TabsContent value="comments">Comments content</TabsContent>
      </Tabs>
    </Card>
  );
}

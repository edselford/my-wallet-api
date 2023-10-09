"use client"

import MainLayout from "@/components/MainLayout";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Metadata } from "next";
import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { formatIdr } from "@/lib/formatter";
import { trackings as DATA } from "@/lib/dataExample";
import { useState } from "react";
import Footer from "@/components/Footer";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";


// export const metadata: Metadata = {
//   title: 'Tracking - MyWallet',
//   description: 'MyWallet application',
//   icons: {
//     icon: "/vercel.svg"
//   },
// }

export function TrackingCard({ day }: { day: string }) {
  const [trackings, setTrackings] = useState(DATA);

  const handleDragDrop = (results: any) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "group") {
      const reorderedTrackings = [...trackings];

      const sourceIndex = source.index;
      const destinationIndex = destination.index;

      const [removedTrack] = reorderedTrackings.splice(sourceIndex, 1);
      reorderedTrackings.splice(destinationIndex, 0, removedTrack);

      return setTrackings(reorderedTrackings);
    }
  }

  return <DragDropContext onDragEnd={handleDragDrop}>
    <div className="bg-black p-4 pb-1 flex-1 min-w-[300px] rounded-xl border border-neutral-800">
      <h1 className="border-b border-b-neutral-800 pb-3 font-semibold text-lg text-center">{day}</h1>
      <Droppable droppableId="ROOT" type="group">
        {(provided: any) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="pt-3 grid">
            {trackings.map((track, index) => {
              return <ContextMenu>
                <ContextMenuTrigger>
                  <Draggable draggableId={track.id} key={track.id} index={index}>
                    {(provided) => (
                      <div className="border border-neutral-800 p-3 bg-neutral-950 rounded-md mb-3" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                        <p className="text-sm">{track.name}</p>
                        <p className="text-sm font-semibold rounded">{formatIdr(100000)}</p>
                      </div>
                    )}
                  </Draggable>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Profile</ContextMenuItem>
                  <ContextMenuItem>Billing</ContextMenuItem>
                  <ContextMenuItem>Team</ContextMenuItem>
                  <ContextMenuItem>Subscription</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            })}
          </div>
        )}
      </Droppable>
    </div>
  </DragDropContext>
}

export default function Home() {
  return (
    <MainLayout loggedIn={true} active="/tracking">
      <PageHeader>
        <PageHeaderTitle>Tracking</PageHeaderTitle>
      </PageHeader>

      <div className="flex flex-wrap gap-6 p-6">
        <TrackingCard day="Sunday" />
        <TrackingCard day="Monday" />
        <TrackingCard day="Tuesday" />
        <TrackingCard day="Wednesday" />
        <TrackingCard day="Thursday" />
        <TrackingCard day="Friday" />
        <TrackingCard day="Saturday" />
      </div>

      <Footer />
    </MainLayout>
  )
}

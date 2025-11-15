import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useMutation } from "convex/react";
import { useMemo, useEffect } from "react";
import RoomData from "./RoomData";
import IngredientList from "./IngredientList";
import RecipeGeneration from "./RecipeGeneration";
import ConstraintsForm from "./ConstraintsForm";
import ParticipantsList from "./ParticipantsList";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface RoomContentProps {
  roomId: Id<"rooms">;
}

function RoomContentInner({ roomId }: RoomContentProps) {
  const joinRoom = useMutation(api.rooms.joinRoom);

  // Auto-join room when component mounts
  useEffect(() => {
    const autoJoin = async () => {
      try {
        console.log("Auto-joining room:", roomId);
        await joinRoom({ roomId });
        console.log("Successfully joined room");
      } catch (err) {
        console.error("Failed to auto-join room:", err);
        // Non-fatal - user might already be a participant
      }
    };
    autoJoin();
  }, [roomId, joinRoom]);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Room Header */}
        <RoomData roomId={roomId} />

        {/* Ingredients Section */}
        <IngredientList roomId={roomId} />

        {/* Recipes Section */}
        <RecipeGeneration roomId={roomId} />
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Participants */}
        <ParticipantsList roomId={roomId} />

        {/* Constraints */}
        <ConstraintsForm roomId={roomId} />
      </div>
    </div>
  );
}

export default function RoomContent({ roomId }: RoomContentProps) {
  const convex = useMemo(() => {
    // Try multiple ways to get the URL
    let url = import.meta.env.PUBLIC_CONVEX_URL;
    console.log("RoomContent - Initial Convex URL from env:", url);
    
    if (!url) {
      console.error("❌ PUBLIC_CONVEX_URL is not set! Using fallback.");
      url = 'http://127.0.0.1:3210';
    }
    
    console.log("✅ Convex initializing with URL:", url);
    const client = new ConvexReactClient(url);
    console.log("✅ Convex client created:", client);
    return client;
  }, []);

  console.log("🎯 RoomContent rendering with roomId:", roomId);

  return (
    <ClerkProvider publishableKey={import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <RoomContentInner roomId={roomId} />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

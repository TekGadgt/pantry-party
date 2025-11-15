import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useMutation } from "convex/react";
import { useMemo, useState } from "react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

function JoinRoomFormInner() {
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinRoom = useMutation(api.rooms.joinRoom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsJoining(true);

    try {
      console.log("Joining room:", roomId);
      await joinRoom({
        roomId: roomId as Id<"rooms">,
      });
      console.log("Successfully joined room");
      
      // Navigate to the room
      window.location.href = `/room/${roomId}`;
    } catch (err) {
      console.error("Failed to join room:", err);
      setError(err instanceof Error ? err.message : "Failed to join room");
      setIsJoining(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="room-id"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Room ID
        </label>
        <input
          type="text"
          id="room-id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter room ID"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isJoining}
        className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isJoining ? "Joining..." : "Join Room"}
      </button>
    </form>
  );
}

export default function JoinRoomForm() {
  const convex = useMemo(() => {
    let url = import.meta.env.PUBLIC_CONVEX_URL;
    console.log("JoinRoomForm - Initial Convex URL:", url);

    if (!url) {
      url = "http://127.0.0.1:3210";
    }
    console.log("JoinRoomForm - Convex URL:", url);
    return new ConvexReactClient(url);
  }, []);

  return (
    <ClerkProvider publishableKey={import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <JoinRoomFormInner />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

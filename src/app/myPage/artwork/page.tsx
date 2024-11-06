import React from "react";
import MyArtwork from "@/components/artwork/MyArtwork";
import MonthlyArtwork from "@/components/artwork/MonthlyArtwork";
import MemoryCollection from "@/components/artwork/MemoryCollection";

const ArtworkPage: React.FC = () => {
  return (
    <div>
      <MyArtwork />
      <MonthlyArtwork />
      <MemoryCollection />
    </div>
  );
};

export default ArtworkPage;

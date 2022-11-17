import React from "react";

interface VolcanoFirmwareVersionProps {
  volcanoFirmwareVersion: string;
}

export default function VolcanoFirmwareVersion({
  volcanoFirmwareVersion,
}: VolcanoFirmwareVersionProps) {
  return <div>Volcano firmware: {volcanoFirmwareVersion}</div>;
}

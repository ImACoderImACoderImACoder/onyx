interface BleFirmwareVersionProps {
  bleFirmwareVersion: string;
}

export default function BleFirmwareVersion({
  bleFirmwareVersion,
}: BleFirmwareVersionProps) {
  return <div>Ble Firmware: {bleFirmwareVersion}</div>;
}

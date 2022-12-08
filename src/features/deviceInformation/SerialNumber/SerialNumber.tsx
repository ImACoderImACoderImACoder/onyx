interface SerialNumberProps {
  serialNumber: string;
}

export default function SerialNumber({ serialNumber }: SerialNumberProps) {
  return <div>Serial Number: {serialNumber}</div>;
}

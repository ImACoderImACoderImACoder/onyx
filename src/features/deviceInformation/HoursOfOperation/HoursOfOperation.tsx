interface hoursOfOperationProps {
  hoursOfOperation: string;
}

export default function hoursOfOperation({
  hoursOfOperation,
}: hoursOfOperationProps) {
  return <div>Hours of Operation: {hoursOfOperation}</div>;
}

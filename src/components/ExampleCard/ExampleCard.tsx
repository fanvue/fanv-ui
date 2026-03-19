import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, cn } from "@fanvue/ui";

export interface ExampleCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function ExampleCard({
  title,
  description,
  actionLabel = "Learn more",
  onAction,
  className,
}: ExampleCardProps) {
  return (
    <Card className={cn("w-[350px]", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onAction}>{actionLabel}</Button>
      </CardFooter>
    </Card>
  );
}

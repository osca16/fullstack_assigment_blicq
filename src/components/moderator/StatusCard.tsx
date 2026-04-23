import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type StatusCardProps = Readonly<{
	title: string;
	value: number;
	description: string;
}>;

export default function StatusCard({ title, value, description }: StatusCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardDescription>{title}</CardDescription>
				<CardTitle className="text-2xl">{value}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}

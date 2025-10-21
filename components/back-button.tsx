"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
	const router = useRouter();

	const handleBack = () => {
		router.back();
	};

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={handleBack}
			className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground min-w-0 px-2 sm:px-3"
		>
			<ArrowLeft className="h-4 w-4 flex-shrink-0" />
			<span className="hidden sm:inline">Back</span>
		</Button>
	);
}

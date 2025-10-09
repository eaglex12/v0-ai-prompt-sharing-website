"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function ContactForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		
		// Simulate form submission
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		setIsSubmitting(false);
		setSubmitStatus("success");
		setFormData({ name: "", email: "", subject: "", message: "" });
		
		// Reset status after 3 seconds
		setTimeout(() => setSubmitStatus("idle"), 3000);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="name">Name *</Label>
					<Input
						id="name"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						placeholder="Your name"
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email *</Label>
					<Input
						id="email"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleInputChange}
						placeholder="your@email.com"
						required
					/>
				</div>
			</div>
			<div className="space-y-2">
				<Label htmlFor="subject">Subject *</Label>
				<Input
					id="subject"
					name="subject"
					value={formData.subject}
					onChange={handleInputChange}
					placeholder="What's this about?"
					required
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="message">Message *</Label>
				<Textarea
					id="message"
					name="message"
					value={formData.message}
					onChange={handleInputChange}
					placeholder="Tell us more about your inquiry..."
					rows={6}
					required
				/>
			</div>
			<Button 
				type="submit" 
				className="w-full"
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<>
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
						Sending...
					</>
				) : (
					<>
						<Send className="h-4 w-4 mr-2" />
						Send Message
					</>
				)}
			</Button>
			{submitStatus === "success" && (
				<div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
					Message sent successfully! We'll get back to you soon.
				</div>
			)}
			{submitStatus === "error" && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
					Something went wrong. Please try again.
				</div>
			)}
		</form>
	);
}

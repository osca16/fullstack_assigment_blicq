type ApprovalEmailTemplateInput = {
	adTitle: string;
	note?: string;
};

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

export function buildApprovalEmailTemplate({ adTitle, note }: ApprovalEmailTemplateInput) {
	const safeTitle = escapeHtml(adTitle);
	const safeNote = note?.trim() ? escapeHtml(note.trim()) : null;

	return {
		subject: `Your advertisement was approved: ${adTitle}`,
		text: [
			`Good news! Your advertisement "${adTitle}" has been approved and is now live.`,
			safeNote ? `Moderator note: ${note?.trim()}` : null,
		]
			.filter(Boolean)
			.join("\n"),
		html: `
			<h2>Your advertisement is now live</h2>
			<p>We approved your advertisement: <strong>${safeTitle}</strong>.</p>
			${safeNote ? `<p><strong>Moderator note:</strong> ${safeNote}</p>` : ""}
		`.trim(),
	};
}

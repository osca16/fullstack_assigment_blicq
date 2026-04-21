type RejectionEmailTemplateInput = {
	adTitle: string;
	reason: string;
};

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

export function buildRejectionEmailTemplate({ adTitle, reason }: RejectionEmailTemplateInput) {
	const cleanedReason = reason.trim();
	const safeTitle = escapeHtml(adTitle);
	const safeReason = escapeHtml(cleanedReason);

	return {
		subject: `Your advertisement was rejected: ${adTitle}`,
		text: [
			`Your advertisement "${adTitle}" was not approved.`,
			`Reason: ${cleanedReason}`,
		].join("\n"),
		html: `
			<h2>Your advertisement was not approved</h2>
			<p>Advertisement: <strong>${safeTitle}</strong></p>
			<p><strong>Reason:</strong> ${safeReason}</p>
		`.trim(),
	};
}

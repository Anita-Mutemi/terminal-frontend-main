export function cleanUrl(url) {
	// Remove protocol (any protocol, not just http or https) and optional user:pass@
	let noProtocol = url.replace(/^[a-zA-Z]+:\/\/(?:[^@]+@)?/, '');
	// Remove www. if present
	let noWww = noProtocol.replace(/^www\./, '');
	// Remove port number, path, query parameters, or fragment if they exist
	let domainOnly = noWww.split(/[\/:?#]/)[0];
	return domainOnly;
}

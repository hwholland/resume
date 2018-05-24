function navigateTo(navId) {
	var sCurrentHost = window.parent.location.origin + window.parent.location.pathname;
	window.parent.location.href = sCurrentHost + navId;
}
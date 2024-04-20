function loadSettings() {
    let theme = localStorage.getItem('theme');
    if (theme) {
        document.documentElement.setAttribute('theme', theme);
    }

    let showBanner = localStorage.getItem("showBanner");
    if (showBanner == null || showBanner == undefined || showBanner == "true") {
        document.documentElement.setAttribute('showBanner', true)
    } else {
        document.documentElement.setAttribute('showBanner', false)
    }

    if (window.location.pathname.substring(1, 11) == "innerWorld" ||
        window.location.pathname.substring(1, 11) == "innerworld") {
        if (theme == 'dark') {
            document.documentElement.setAttribute('theme', 'light')
        } else {
            document.documentElement.setAttribute('theme', 'dark')
        }
    }
};
loadSettings();
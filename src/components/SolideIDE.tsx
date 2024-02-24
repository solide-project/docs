const SolideIDE = ({ url }) => {
    // const { isDarkTheme } = useColorMode();
    // { isDarkTheme ? "Dark" : "Light" }

    return <iframe
        src={url}
        height="400" width="300"
        style={{ "borderRadius": "8px", "width": "100%", "overflow": "hidden" }} />
};

export default SolideIDE;
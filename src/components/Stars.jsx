function Stars({ rating }) {
    const value = rating / 2;

    return (
        <div style={{ position: "relative", display: "inline-block", fontSize: "22px" }}>
            <div style={{ color: "#555" }}>{"★★★★★"}</div>
            <div style={{position: "absolute", top: 0, left: 0, whiteSpace: "nowrap", overflow: "hidden", width: `${(value / 5) * 100}%`, color: "gold"}}>{"★★★★★"}</div>
        </div>
    );
}
export default Stars;
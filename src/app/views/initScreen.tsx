import * as React from "react";
import { styled } from "../../../stitches.theme";
export default function InitScreen({ setView }) {
    const Layout = styled("section", {
        display: "grid",
        gridTemplateRows: "171px 1fr 60px",
    })
    return (
        <Layout>
            <img width="100%" height="auto" src={require("../assets/splash-image.png")} />
            <button onClick={() => setView("main")}>Next</button>
        </Layout>

    )
}
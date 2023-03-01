import * as React from "react";
import { BrandName } from "../../lib/plugin-config";
import { styled } from "../../../stitches.theme";
//@ts-ignore
import splash from "../assets/splash-image.png"
import { Headings } from "../components/Headings";
import { P } from "../components/Paragraph";
import { Button } from "../components/Button";
import PrevButton from "../components/PrevButton";
import { screens } from "../../lib/plugin-config";
import { BottomBar } from "../components/BottomBar";
export default function GettingStarted({ setView }) {
    const Container = styled("div", {
        padding: 16,
    })

    return (
        <section>
            <img width="100%" height="auto" src={splash} />
            <Container>
                <Headings><strong>Welcome to {BrandName}</strong></Headings>
                <P>
                    {`First we will need to generate the markdown components. If this is your first time using Figma.md you will need to generate the default components. You can adjust the styling of the components after it is generated.

                    If you have existing markdown components use assign custom to connect them to Figma.md `}
                </P>
                <BottomBar css={{ left: 16 }}>
                    <PrevButton css={{ width: "100%", textAlign: "left" }} onClick={() => setView(screens.init)} />
                    <Container css={{ padding: 0, display: "flex", gap: "$1" }}>
                        <Button onClick={() => setView(screens.custom)}>Assign Custom</Button>
                        <Button onClick={() => setView(screens.loading)}>Generate Default</Button>
                    </Container>
                </BottomBar>
            </Container>
        </section>

    )
}
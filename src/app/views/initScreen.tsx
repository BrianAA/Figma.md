import * as React from "react";
import { BrandName } from "../../lib/plugin-config";
import { styled } from "../../../stitches.theme";
//@ts-ignore
import splash from "../assets/splash-image.png"
import { Headings } from "../components/Headings";
import { P } from "../components/Paragraph";
import { Button } from "../components/Button";
import { screens } from "../../lib/plugin-config";
import { BottomBar } from "../components/BottomBar";
export default function InitScreen({ setView }) {
    const Container = styled("div", {
        padding: 16,
    })

    return (
        <section>
            <img width="100%" height="auto" src={splash} />
            <Container>
                <Headings><strong>Welcome to {BrandName}</strong></Headings>
                <P>
                    {`A new way to generate documentation in Figma using markdown and custom Figma components. Figma.md was created out a need to create comprehensive documentation in Figma with the ease of editing using markdown.
                    
                    Figma.md uses standard markdown syntax, but as well extends the markdown editing power using Figma components.`}
                </P>
                <BottomBar>
                    <Button onClick={() => setView(screens.gettingStarted)}>Next</Button>
                </BottomBar>
            </Container>

        </section>

    )
}
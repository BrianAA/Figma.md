import * as React from 'react'
//@ts-ignore
import splash from "../assets/splash-image.png"
import { LoadingBar } from '../components/Progress'
import { styled } from '../../../stitches.theme'
import { Headings } from '../components/Headings'
import { screens } from '../../lib/plugin-config'
export default function SetUpLoading({ setView, LoadingText, progressValue }) {
    const [ProgressValue, setProgress] = React.useState(0);
    const Container = styled("div", {
        padding: 16,
    })
    React.useEffect(() => {
        setProgress(progressValue)
    }, [])

    React.useEffect(() => {
        if (ProgressValue == 100) {
            setView(screens.main)
        }
    }, [ProgressValue])

    return (
        <Container css={{ height: "100%", padding: 0, display: "grid", gridTemplateRows: "171px 1fr" }}>
            <img width="100%" height="auto" src={splash} />
            <Container css={{ display: "flex", flexDirection: "column" }}>
                <Headings><strong>{LoadingText}</strong></Headings>
                <Container css={{ height: "100%", paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 47, display: "flex", alignItems: "center" }}>
                    <LoadingBar progressValue={ProgressValue} />
                </Container>
            </Container>
        </Container>
    )
}

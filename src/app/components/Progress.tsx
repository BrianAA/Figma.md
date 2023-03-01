
import * as React from "react";
import * as Progress from '@radix-ui/react-progress';
import { styled } from "../../../stitches.theme";

export function LoadingBar({ progressValue }) {
    const StyledProgress = styled(Progress.Root, {
        position: "relative",
        overflow: "hidden",
        background: "$grayLight",
        borderRadius: "99999px",
        width: "330px",
        height: "7px",
        transform: "translateZ(0)",
    })
    const Indicator = styled(Progress.Indicator, {
        backgroundColor: "$accent",
        width: "100%",
        height: "100%",
        transition: "transform 660ms cubic-bezier(0.65, 0, 0.35, 1)",
    })
    return (
        <StyledProgress value={progressValue}>
            <Indicator style={{ transform: `translateX(-${100 - progressValue}%)` }} />
        </StyledProgress>
    )
}
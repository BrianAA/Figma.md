import { styled } from "../../../stitches.theme";

export const Button = styled("button", {
    fontWeight: 400,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: 11,
    fontFamily: "Inter",
    padding: "8 16",
    background: "transparent",
    border: "1px solid #333333",
    borderRadius: 6,
    transition: "background .25s",
    "&:hover": {
        background: "$grayLight",
    }
})
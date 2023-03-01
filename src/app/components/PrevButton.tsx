import React from 'react'
import { styled } from '../../../stitches.theme'
export default function PrevButton({ css, onClick }) {
    const PrevButton = styled("button", {
        cursor: "pointer",
        background: "transparent",
        border: "none",
        textDecoration: "underline",
        fontSize: '$1',
        color: "$gray500",
        transition: "opacity .2s",
        "&:hover": {
            opacity: .5
        }
    })
    return (
        <PrevButton css={css} onClick={onClick}>{`<prev`}</PrevButton>
    )
}

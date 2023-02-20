import React from 'react'
import { styled } from '../../../stitches.theme'
export default function PrevButton({ onClick }) {
    const PrevButton = styled("button", {
        cursor: "pointer",
        background: "transparent",
        border: "none",
        textDecoration: "underline",
        fontSize: '$1',
        color: "$gray500",
    })
    return (
        <PrevButton onClick={onClick}>{`<prev`}</PrevButton>
    )
}

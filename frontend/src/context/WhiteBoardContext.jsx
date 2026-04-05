import { createContext, useState } from "react";

export const WhiteBoardContext = createContext();

export default function WhiteBoardProvider( { children }){
    const [board, setBoard] = useState(null);
    const [collaborators, setCollaborators] = useState([])

    return (
        <WhiteBoardContext.Provider value={
            {
                board,
                setBoard,
                collaborators,
                setCollaborators,
            }
        }>
            {children}
        </WhiteBoardContext.Provider>
    )
}